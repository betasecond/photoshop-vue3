import { useUndoRedoStore } from '../store/undoRedoStore';



export function initializeCanvas(canvas: Ref<HTMLCanvasElement | null>, ctx: Ref<CanvasRenderingContext2D | null>) {
    const undoRedoStore = useUndoRedoStore(); // 获取 store 实例
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

export function loadImage(event: Event, canvas: Ref<HTMLCanvasElement | null>, ctx: Ref<CanvasRenderingContext2D | null>) {
    const undoRedoStore = useUndoRedoStore();
    // 参数校验
    if (!event || !canvas || !ctx) {
        console.log('Event, canvas, or context is missing');
        return;
    }

    if (!canvas.value) {
        console.log('Canvas reference is null');
        return;
    }

    if (!ctx.value) {
        console.log('Canvas context is null');
        return;
    }

    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
        console.log('No file selected');
        return;
    }

    if (!file.type.startsWith('image/')) {
        console.log('Selected file is not an image');
        return;
    }

    console.log('File selected:', file.name);

    const reader = new FileReader();

    reader.onload = function (e) {
        console.log('FileReader onload triggered');
        const img = new Image();

        img.onload = function () {
            console.log('Image onload triggered, drawing image on canvas');
            if (!canvas.value || !ctx.value) {
                console.log('Canvas or context is missing during image drawing');
                return;
            }

            // 清空画布并绘制图片
            ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
            ctx.value.drawImage(img, 0, 0, canvas.value.width, canvas.value.height);
            console.log('Image drawn on canvas');

            undoRedoStore.saveCanvasState();
        };

        // 确认 img.src 被正确设置
        console.log('Setting image source');
        img.src = e.target?.result as string;
    };

    // 读取文件
    console.log('Starting to read file as Data URL');
    reader.readAsDataURL(file);
}


export function saveImage(canvas: Ref<HTMLCanvasElement | null>) {
    if (!canvas.value) return;

    const dataURL = canvas.value.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'image.png';
    link.click();
}

export function startDrawing(tool: string, isDrawing: boolean) {
    const undoRedoStore = useUndoRedoStore();
    if (mapToolType(tool) === 'brush' || mapToolType(tool) === 'eraser') {
        undoRedoStore.saveCanvasState();
        return true;
    }
    return false;
}

export function stopDrawing(ctx: Ref<CanvasRenderingContext2D | null>) {
    const undoRedoStore = useUndoRedoStore();

    ctx.value?.beginPath();

}

// 工具类型定义
export enum ToolType {
    Brush = 'brush',
    Eraser = 'eraser',
    Line = 'line',
    Rectangle = 'rectangle',
    Circle = 'circle',
    // 其他未来可能的工具类型
}
// 工具映射函数
function mapToolType(tool: string): ToolType {
    switch (tool) {
        case 'brush':
            return ToolType.Brush;
        case 'eraser':
            return ToolType.Eraser;
        case 'line':
            return ToolType.Line;
        case 'rectangle':
            return ToolType.Rectangle;
        default:
            throw new Error('Invalid tool type');
    }
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
        // 其他工具逻辑
        default:
            console.log('Unknown tool selected');
    }
    // 检查绘制完成后是否保存了状态
    const undoRedoStore = useUndoRedoStore();
    // debug
    // console.log('Before save state: undoStack:', undoRedoStore.undoStack.length, 'redoStack:', undoRedoStore.redoStack.length);
    // undoRedoStore.saveCanvasState(canvas, ctx);
    // console.log('After save state: undoStack:', undoRedoStore.undoStack.length, 'redoStack:', undoRedoStore.redoStack.length);

}
// 示例：画笔绘制函数
function drawBrush(ctx: CanvasRenderingContext2D, x: number, y: number, config: any) {
    ctx.lineWidth = config.brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = config.color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// 示例：橡皮擦绘制函数
function drawEraser(ctx: CanvasRenderingContext2D, x: number, y: number, config: any) {
    ctx.clearRect(x - config.eraserSize / 2, y - config.eraserSize / 2, config.eraserSize, config.eraserSize);
}
export function adjustBrightness(canvas: Ref<HTMLCanvasElement | null>, ctx: Ref<CanvasRenderingContext2D | null>, brightnessValue: number) {
    const undoRedoStore = useUndoRedoStore(); // 获取 undo/redo store

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
