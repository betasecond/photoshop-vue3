import { useUndoRedoStore } from "../store/undoRedoStore";
import {CanvasContext} from "../types/contextType";

export function adjustColorTemperature({ canvas, ctx }: CanvasContext, colorTemperature: number) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }
    // 保存当前图像状态到撤销/重做存储
    undoRedoStore.saveCanvasState();
    // 获取当前图像数据
    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;

    // 色温调整系数，假设色温范围为-100到100
    const redAdjustment = colorTemperature > 0 ? colorTemperature / 100 : 0;
    const blueAdjustment = colorTemperature < 0 ? -colorTemperature / 100 : 0;

    // 遍历像素数据，调整红色和蓝色通道
    for (let i = 0; i < data.length; i += 4) {
        // 红色通道调整
        data[i] = Math.min(255, Math.max(0, data[i] + (redAdjustment * 255)));  // R
        // 绿色通道不变
        // 蓝色通道调整
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + (blueAdjustment * 255))); // B
    }

    // 将调整后的图像数据放回画布
    ctx.value.putImageData(imageData, 0, 0);


}
