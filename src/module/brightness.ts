import {useUndoRedoStore} from "../store/undoRedoStore";
import {CanvasContext} from "../types/ContextType";

export function adjustBrightness({ canvas, ctx }: CanvasContext, brightnessValue: number) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }

    // 获取当前画布上的图像数据
    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;  // 图像的像素数据
    const trueBrightnessValue = brightnessValue / 10.0;
    // 遍历每个像素，调整亮度
    // TODO:性能关键部分 后面换WASM
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + trueBrightnessValue);       // R 通道
        data[i + 1] = Math.min(255, data[i + 1] + trueBrightnessValue); // G 通道
        data[i + 2] = Math.min(255, data[i + 2] + trueBrightnessValue); // B 通道
    }

    // 将调整后的数据放回画布
    ctx.value.putImageData(imageData, 0, 0);

    // 在调整亮度后保存状态
    undoRedoStore.saveCanvasState();
}
