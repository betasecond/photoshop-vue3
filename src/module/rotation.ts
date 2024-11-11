import { useUndoRedoStore } from '../store/undoRedoStore';
import {CanvasContext} from "../types/ContextType";

export function adjustRotation({ canvas, ctx }: CanvasContext, angle: number) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }

    // 保存当前状态到撤销栈
    undoRedoStore.saveCanvasState();

    // 获取当前画布内容
    const width = canvas.value.width;
    const height = canvas.value.height;

    // 创建一个临时 Canvas 来存储当前内容
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) {
        console.error('Temporary canvas context is missing.');
        return;
    }

    // 将当前内容绘制到临时 Canvas
    tempCtx.drawImage(canvas.value, 0, 0);

    // 调整主画布尺寸以适应旋转后的内容
    canvas.value.width = height;
    canvas.value.height = width;

    // 在主画布上应用旋转变换并绘制内容
    ctx.value.save();
    ctx.value.translate(height / 2, width / 2);  // 移动到新的中心
    ctx.value.rotate(Math.PI / 2);               // 旋转 90 度
    ctx.value.drawImage(tempCanvas, -width / 2, -height / 2); // 将内容绘制到中心
    ctx.value.restore();
}