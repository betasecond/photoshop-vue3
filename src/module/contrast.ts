import {useUndoRedoStore} from "../store/undoRedoStore";
import {CanvasContext} from "../types/ContextType";

export function adjustContrast({ canvas, ctx }: CanvasContext, contrastValue: number) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }

    // 获取当前图像数据
    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;
    const factor = (259 * (contrastValue + 255)) / (255 * (259 - contrastValue));

    // 遍历像素，调整对比度
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, factor * (data[i] - 128) + 128);        // R
        data[i + 1] = Math.min(255, factor * (data[i + 1] - 128) + 128); // G
        data[i + 2] = Math.min(255, factor * (data[i + 2] - 128) + 128); // B
    }

    ctx.value.putImageData(imageData, 0, 0);
    undoRedoStore.saveCanvasState();
}
