import { useUndoRedoStore } from "../store/undoRedoStore";
import {CanvasContext} from "../types/contextType";

export function cropCanvas(
{ canvas, ctx }: CanvasContext,
    cropArea: { x: number, y: number, width: number, height: number }
) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }
    // 保存当前画布状态
    undoRedoStore.saveCanvasState();
    // 获取裁剪区域的图像数据
    const croppedImageData = ctx.value.getImageData(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // 清空画布并绘制裁剪区域的图像数据
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    // 将裁剪后的图像放回指定位置
    ctx.value.putImageData(croppedImageData, cropArea.x, cropArea.y);
    // 保存裁剪后的状态
    undoRedoStore.saveCanvasState();
}
