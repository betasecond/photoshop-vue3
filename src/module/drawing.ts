import {useUndoRedoStore} from "../store/undoRedoStore";
import {ToolType} from "./toolType";
import {drawBrush} from "./brush";
import {drawEraser} from "./eraser";




export function startDrawing(tool: ToolType, isDrawing: boolean): boolean {
    const undoRedoStore = useUndoRedoStore();

    if (tool === ToolType.Brush || tool === ToolType.Eraser) {
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
    tool: ToolType,
    config: { color: string, brushSize: number, eraserSize: number },
    isDrawing: boolean
) {
    if (!isDrawing || !ctx.value || !canvas.value) return;

    const rect = canvas.value.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;


    switch (tool) {
        case ToolType.Brush:
            drawBrush(ctx.value, x, y, config);
            break;
        case ToolType.Eraser:
            drawEraser(ctx.value, x, y, config);
            break;
        default:
            console.warn('Unknown tool selected');
    }


}