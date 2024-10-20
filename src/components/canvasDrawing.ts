import { Ref } from 'vue';

export function initializeCanvas(canvas: Ref<HTMLCanvasElement | null>, ctx: Ref<CanvasRenderingContext2D | null>) {
    if (canvas.value) {
        ctx.value = canvas.value.getContext('2d');
        ctx.value.fillStyle = '#ffffff';
        ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
        console.log('Canvas initialized');
    }
}

export function loadImage(event: Event, canvas: Ref<HTMLCanvasElement | null>, ctx: Ref<CanvasRenderingContext2D | null>) {
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
    if (tool === 'brush' || tool === 'eraser') {
        return true;
    }
    return false;
}

export function stopDrawing(ctx: Ref<CanvasRenderingContext2D | null>) {
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
    tool: string,  // 这里接受来自 props 的字符串工具类型
    config: { color: string, brushSize: number, eraserSize: number },
    isDrawing: boolean
) {
    if (!isDrawing || !ctx.value || !canvas.value) return;

    const rect = canvas.value.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 将字符串工具映射到枚举值
    const selectedTool = mapToolType(tool);

    switch (selectedTool) {
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
