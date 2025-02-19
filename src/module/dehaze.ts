import { Ref } from 'vue';
import {adjustContrast, privateAdjustContrast} from './contrast';  // 导入现有的对比度调整函数
import {adjustBrightness, privateadjustBrightness} from './brightness';
import {CanvasContext} from "../types/contextType";
import {useUndoRedoStore} from "../store/undoRedoStore";
import axios from "axios";
import {loadImage} from "./imageIO/imageLoad";  // 导入现有的亮度调整函数

// 用于去雾的算法实现
export function adjustDehaze({ canvas, ctx }: CanvasContext, dehazeStrength: number) {
    // 根据去雾强度计算对比度和亮度

    const contrastValue = dehazeStrength * 0.5;  // 对比度值，根据强度调整
    const brightnessValue = dehazeStrength * 0.3;  // 亮度值，根据强度调整

    // 调整对比度
    privateAdjustContrast(canvas,ctx, contrastValue);

    // 调整亮度
    privateadjustBrightness(canvas,ctx, brightnessValue);
}

// 线性拉伸
function stretchImage(data: number[], width: number, height: number, s = 0.005, bins = 2000): number[] {
    const hist = new Array(bins).fill(0);
    const cumsum = new Array(bins).fill(0);
    const min = Math.min(...data);
    const max = Math.max(...data);

    // 创建直方图
    data.forEach((value) => {
        let bin = Math.floor(((value - min) / (max - min)) * bins);
        bin = Math.min(bin, bins - 1); // 防止溢出
        hist[bin]++;
    });

    // 计算累积分布
    cumsum[0] = hist[0];
    for (let i = 1; i < bins; i++) {
        cumsum[i] = cumsum[i - 1] + hist[i];
    }

    // 拉伸
    let lmin = 0;
    let lmax = bins - 1;
    while (lmin < bins && cumsum[lmin] / data.length < s) {
        lmin++;
    }
    while (lmax >= 0 && cumsum[lmax] / data.length > 1 - s) {
        lmax--;
    }

    return data.map((value) => {
        let scaled = (value - min) / (max - min);
        return Math.min(Math.max((scaled - lmin / bins) / ((lmax - lmin) / bins), 0), 1);
    });
}

// 获取高斯权重矩阵
function getGaussianKernel(radius: number): number[][] {
    const size = radius * 2 + 1;
    const kernel: number[][] = new Array(size).fill(0).map(() => new Array(size).fill(0));
    let sum = 0;
    for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
            let dist = Math.sqrt(x * x + y * y);
            kernel[y + radius][x + radius] = Math.exp(-dist * dist / (2 * radius * radius));
            sum += kernel[y + radius][x + radius];
        }
    }

    // 归一化
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            kernel[y][x] /= sum;
        }
    }

    return kernel;
}

// 图像去雾
export function newDehazeImage({ canvas, ctx }: CanvasContext, radius = 5, ratio = 4,dehazeStrength = 10) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }

    // 保存画布状态以便撤销/重做
    undoRedoStore.saveCanvasState();

    // 获取当前图像数据
    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;
    const width = canvas.value.width;
    const height = canvas.value.height;

    // 获取高斯核
    const kernel = getGaussianKernel(radius);

    // 去雾操作
    const resultData = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            let count = 0;

            // 对每个像素应用高斯卷积
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    // 跳过画布外的像素
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const idx = (ny * width + nx) * 4;

                        // 对RGB通道进行加权平均
                        r += data[idx] * kernel[dy + radius][dx + radius];
                        g += data[idx + 1] * kernel[dy + radius][dx + radius];
                        b += data[idx + 2] * kernel[dy + radius][dx + radius];
                        a += data[idx + 3] * kernel[dy + radius][dx + radius];
                        count++;
                    }
                }
            }

            const idx = (y * width + x) * 4;
            resultData[idx] = r / count * ratio;
            resultData[idx + 1] = g / count * ratio;
            resultData[idx + 2] = b / count * ratio;
            resultData[idx + 3] = a / count * ratio;
        }
    }

    // 设置拉伸图像数据
    const stretchedData = stretchImage(resultData, width, height);

    // 将修改后的图像数据返回到画布
    ctx.value.putImageData(new ImageData(stretchedData, width, height), 0, 0);
}

export async function adjustDehazeByBackend({ canvas, ctx }: CanvasContext, dehazeStrength: number) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }

    // 保存当前画布状态
    undoRedoStore.saveCanvasState();

    // 获取 canvas 的 ImageData
    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);

    // 获取 RGBA 数据并去掉 Alpha 通道
    const rgbaData = Array.from(imageData.data); // 转为数组
    const rgbData = [];
    const alphaData = [];

    // 提取 RGB 通道（去掉 Alpha）
    for (let i = 0; i < rgbaData.length; i += 4) {
        const r = rgbaData[i];
        const g = rgbaData[i + 1];
        const b = rgbaData[i + 2];
        const a = rgbaData[i + 3]; // 保存原始的 Alpha 通道
        rgbData.push(r, g, b);
        alphaData.push(a);
    }

    // 构造 ImageData 对象，发送到后端
    const imageDataToSend = {
        colorSpace: "srgb",  // 保持为 sRGB 色彩空间
        data: rgbData,       // 仅包含 RGB 数据
        height: canvas.value.height,
        width: canvas.value.width
    };



    try {
        // 向后端发送 POST 请求
        const response = await axios.post('http://localhost:23333/dehaze/', imageDataToSend, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // 获取去雾后的数据
        const dehazedData = response.data;
        const dehazedImageBase64 = response.data.location;
        if (dehazedImageBase64) {
            // 根据 Base64 数据加载图像
            const img = new Image();

            img.onload = function () {
                console.log('去雾后的图像加载完毕，绘制到画布上');
                if (!canvas.value || !ctx.value) {
                    console.log('Canvas or context is missing during image drawing');
                    return;
                }

                // 清空画布并绘制去雾后的图片
                ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
                ctx.value.drawImage(img, 0, 0, canvas.value.width, canvas.value.height);
                console.log('去雾后的图像绘制到画布上');
            };

            // 设置图像的 src 为 Base64 编码的图像数据
            img.src = dehazedImageBase64;
        } else {
            console.error('去雾后的图像路径未返回');
        }

        // 将新的去雾图像数据绘制到 canvas 上
        ctx.value.putImageData(imageData, 0, 0);

    } catch (error) {
        console.error('去雾请求失败:', error);
    }
}

