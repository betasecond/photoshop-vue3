// 应用平滑效果（盒式模糊）
import {FaceDetectionResult} from "../../types/FaceDetectionType";

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

// 对特定区域（人脸框）应用平滑效果
function applySmoothToFaceRegion(
    faceImageData: ImageData,
    face: FaceDetectionResult,
    radius: number
) {
    // 获取人脸区域的像素数据
    const data = faceImageData.data;
    const width = face.width;
    const height = face.height;

    // 提取出人脸框区域的图像数据
    const faceData = applySmoothEffect(data, width, height, radius);

    // 更新图像数据
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const resultIdx = ((y + face.y) * faceImageData.width + (x + face.x)) * 4;

            // 将平滑后的数据放回原图像数据
            faceImageData.data[resultIdx] = faceData[idx];       // 红色
            faceImageData.data[resultIdx + 1] = faceData[idx + 1]; // 绿色
            faceImageData.data[resultIdx + 2] = faceData[idx + 2]; // 蓝色
            faceImageData.data[resultIdx + 3] = faceData[idx + 3]; // 透明度
        }
    }
}

// 应用到指定的人脸框区域
export function applySmoothingToFace(
{ canvas, ctx }: CanvasContext,
    faceDetections: FaceDetectionResult[],
    radius: number
) {
    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }


    // 遍历所有检测到的人脸并应用平滑
    faceDetections.forEach(face => {
        // 获取每个人脸区域的数据
        const faceImageData = ctx.value.getImageData(face.x, face.y, face.width, face.height);

        // 对当前人脸区域应用平滑效果
        applySmoothToFaceRegion(faceImageData, face, radius);

        // 将处理后的图像数据放回canvas
        ctx.value.putImageData(faceImageData, face.x, face.y);
    });
}
