import { useUndoRedoStore } from '../store/undoRedoStore';
import {WatermarkOptions} from "../types/watermarkType";


// 默认水印配置
export const defaultOptions: WatermarkOptions = {
    text: "Watermark",
    fontSize: 20,
    color: "rgba(0, 0, 0, 0.5)", // 半透明黑色
    opacity: 0.5,
    position: { x: 100, y: 100 },
};

// 添加水印函数
export function applyWatermark(
    canvas: Ref<HTMLCanvasElement | null>,
    ctx: Ref<CanvasRenderingContext2D | null>,
    options: WatermarkOptions = defaultOptions
): void {
    const undoRedoStore = useUndoRedoStore();
    undoRedoStore.saveCanvasState();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }

    const { text, fontSize, color, opacity, position } = { ...defaultOptions, ...options };

    ctx.value.save(); // 保存当前画布状态

    // 设置水印样式
    ctx.value.globalAlpha = opacity!;
    ctx.value.font = `${fontSize}px Arial`;
    ctx.value.fillStyle = color!;

    // 计算水印位置
    const posX = position!.x || canvas.value.width - 100;
    const posY = position!.y || canvas.value.height - 50;

    // 绘制水印
    ctx.value.fillText(text, posX, posY);

    ctx.value.restore(); // 恢复画布状态

    // // 保存操作后状态
    // undoRedoStore.saveCanvasState();
}
