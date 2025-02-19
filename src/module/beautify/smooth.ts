// 应用平滑效果（盒式模糊）
import { FaceDetectionResult } from "../../types/faceDetectionType";
import {CanvasContext} from "../../types/contextType";

/**
 * 对图像数据应用平滑效果
 * @param {Uint8ClampedArray} data - 图像数据数组
 * @param {number} width - 图像宽度
 * @param {number} height - 图像高度
 * @param {number} radius - 模糊半径
 * @returns {Uint8ClampedArray} 平滑处理后的图像数据
 */
function applySmoothEffect(data: Uint8ClampedArray, width: number, height: number, radius: number) {
    const result = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            let count = 0;

            // 对周围像素应用模糊（盒式模糊）
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    // 确保坐标不越界
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const idx = (ny * width + nx) * 4;
                        r += data[idx];     // 红色
                        g += data[idx + 1]; // 绿色
                        b += data[idx + 2]; // 蓝色
                        a += data[idx + 3]; // 透明度
                        count++;
                    }
                }
            }

            // 设置新像素值（平均值）
            const idx = (y * width + x) * 4;
            result[idx] = r / count;       // 红色
            result[idx + 1] = g / count;   // 绿色
            result[idx + 2] = b / count;   // 蓝色
            result[idx + 3] = a / count;   // 透明度
        }
    }

    return result;
}

/**
 * 对特定区域（人脸框）应用平滑效果
 * @param {ImageData} faceImageData - 人脸区域的图像数据
 * @param {FaceDetectionResult} face - 人脸检测结果
 * @param {number} radius - 模糊半径
 */
function applySmoothToFaceRegion(
    faceImageData: ImageData,
    face: FaceDetectionResult,
    radius: number
) {
    const data = faceImageData.data;
    const width = face.width;
    const height = face.height;

    const faceData = applySmoothEffect(data, width, height, radius);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const resultIdx = ((y + face.y) * faceImageData.width + (x + face.x)) * 4;

            faceImageData.data[resultIdx] = faceData[idx];       // 红色
            faceImageData.data[resultIdx + 1] = faceData[idx + 1]; // 绿色
            faceImageData.data[resultIdx + 2] = faceData[idx + 2]; // 蓝色
            faceImageData.data[resultIdx + 3] = faceData[idx + 3]; // 透明度
        }
    }
}

/**
 * 对检测到的人脸区域应用平滑效果
 * @param {CanvasContext} context - 画布上下文
 * @param {FaceDetectionResult[]} faceDetections - 人脸检测结果数组
 * @param {number} radius - 模糊半径
 */
export function applySmoothingToFace(
    { canvas, ctx }: CanvasContext,
    faceDetections: FaceDetectionResult[],
    radius: number
) {
    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }

    faceDetections.forEach(face => {
        const faceImageData = ctx.value.getImageData(face.x, face.y, face.width, face.height);
        applySmoothToFaceRegion(faceImageData, face, radius);
        ctx.value.putImageData(faceImageData, face.x, face.y);
    });
}