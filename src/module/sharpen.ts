// 拉普拉斯算子
import {useUndoRedoStore} from "../store/undoRedoStore";
import {CanvasContext} from "../types/ContextType";
//
// const sharpenKernel = [
//     [0, -1, 0],
//     [-1, 5, -1],
//     [0, -1, 0]
// ];

const sharpenKernel = [
    [-1, -1, -1],
    [-1, 10, -1],
    [-1, -1, -1]
];
// TODO:后续可能要换wasm实现
export function applySharpen(
    { canvas, ctx }: CanvasContext,
    intensity: number
): void {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }
    undoRedoStore.saveCanvasState();
    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // 将卷积矩阵应用于每个像素
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const i = (y * width + x) * 4;
            let r = 0, g = 0, b = 0;

            // 应用 3x3 锐化矩阵
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const weight = sharpenKernel[ky + 1][kx + 1] * intensity;
                    const j = ((y + ky) * width + (x + kx)) * 4;
                    r += data[j] * weight;
                    g += data[j + 1] * weight;
                    b += data[j + 2] * weight;
                }
            }

            // 更新像素值
            data[i] = Math.min(Math.max(r, 0), 255);
            data[i + 1] = Math.min(Math.max(g, 0), 255);
            data[i + 2] = Math.min(Math.max(b, 0), 255);
        }
    }

    // 将处理后的数据应用回画布
    ctx.value.putImageData(imageData, 0, 0);
}
