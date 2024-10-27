export function drawBrush(ctx: CanvasRenderingContext2D, x: number, y: number, config: any) {
    ctx.lineWidth = config.brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = config.color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}