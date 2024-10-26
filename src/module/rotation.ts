import { useUndoRedoStore } from '../store/undoRedoStore';

export function adjustRotation(canvas: Ref<HTMLCanvasElement | null>, ctx: Ref<CanvasRenderingContext2D | null>, angle: number) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }

    const radians = (angle * Math.PI) / 180;

    undoRedoStore.saveCanvasState(); // 保存当前状态

    // 在画布上进行旋转操作
    ctx.value.save();
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    ctx.value.translate(canvas.value.width / 2, canvas.value.height / 2);
    ctx.value.rotate(radians);
    ctx.value.translate(-canvas.value.width / 2, -canvas.value.height / 2);
    ctx.value.restore();
}