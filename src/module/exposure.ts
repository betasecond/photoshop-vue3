import { useUndoRedoStore } from "../store/undoRedoStore";
import {CanvasContext} from "../types/contextType";

export function adjustExposure({ canvas, ctx }: CanvasContext, exposureValue: number) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }
    undoRedoStore.saveCanvasState();

    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;
    const trueExposureValue = Math.pow(2, exposureValue / 100);  // 使用指数调整来增加或减少曝光效果

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * trueExposureValue);       // R 通道
        data[i + 1] = Math.min(255, data[i + 1] * trueExposureValue); // G 通道
        data[i + 2] = Math.min(255, data[i + 2] * trueExposureValue); // B 通道
    }

    ctx.value.putImageData(imageData, 0, 0);
}
