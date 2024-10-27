export function drawEraser(ctx: CanvasRenderingContext2D, x: number, y: number, config: any) {
    ctx.clearRect(x - config.eraserSize / 2, y - config.eraserSize / 2, config.eraserSize, config.eraserSize);
}