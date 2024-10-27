import {useUndoRedoStore} from "../store/undoRedoStore";
import { DrawingToolType} from '../types/toolType';
import {drawBrush} from "./brush";
import {drawEraser} from "./eraser";




export function startDrawing(tool: DrawingToolType, isDrawing: boolean): boolean {
    const undoRedoStore = useUndoRedoStore();

    if (tool === DrawingToolType.Brush || tool === DrawingToolType.Eraser) {
        if (!isDrawing) {
            console.log("isDrawing",tool)
            undoRedoStore.saveCanvasState();
        }
        return true;
    }
    return false;
}

export function stopDrawing(ctx: Ref<CanvasRenderingContext2D | null>) {
    ctx.value?.beginPath();

}

// 绘制函数签名
export function draw(
    event: MouseEvent,
    canvas: Ref<HTMLCanvasElement | null>,
    ctx: Ref<CanvasRenderingContext2D | null>,
    tool: DrawingToolType,
    config: { color: string, brushSize: number, eraserSize: number },
    isDrawing: boolean
) {
    if (!isDrawing || !ctx.value || !canvas.value) return;

    const rect = canvas.value.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;


    switch (tool) {
        case DrawingToolType.Brush:
            drawBrush(ctx.value, x, y, config);
            break;
        case DrawingToolType.Eraser:
            drawEraser(ctx.value, x, y, config);
            break;
        default:
            console.warn('Unknown tool selected');
    }


}