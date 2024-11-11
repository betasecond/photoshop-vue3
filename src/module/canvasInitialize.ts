import { useUndoRedoStore } from '../store/undoRedoStore';



export function initializeCanvas({ canvas, ctx }: CanvasContext) {
    if (canvas.value) { // 确保 canvas.value 不为空
        ctx.value = canvas.value.getContext('2d'); // 将 context 赋值给 ctx
        if (ctx.value) { // 确保获取到的 context 不为空
            ctx.value.fillStyle = '#ffffff';
            ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
            console.log('Canvas initialized');
        } else {
            console.error("Failed to get 2D context");
        }
    } else {
        console.error("Canvas element is null");
    }
}