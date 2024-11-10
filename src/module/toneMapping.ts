import { useUndoRedoStore } from "../store/undoRedoStore";

export function applyToneMapping(
    canvas: Ref<HTMLCanvasElement | null>,
    ctx: Ref<CanvasRenderingContext2D | null>,
    toneMappingType: string,
    params: { [key: string]: number }
) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }

    // 获取当前图像数据
    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;

    // 色调映射算法（举例：Reinhard 算法）
    const applyReinhard = (r: number, g: number, b: number): [number, number, number] => {
        // Reinhard Tone Mapping公式（简单示例）
        const a = 0.18; // 暗区亮度参数
        const maxLuminance = 1.0; // 最大亮度
        r = r * a / (r + maxLuminance);
        g = g * a / (g + maxLuminance);
        b = b * a / (b + maxLuminance);
        return [r, g, b];
    };

    // 根据选择的色调映射类型应用不同的算法
    const toneMappingFunction = (r: number, g: number, b: number) => {
        switch (toneMappingType) {
            case 'Reinhard':
                return applyReinhard(r, g, b);
            // 可以添加更多的色调映射算法（如ACES、Filmic等）
            default:
                return [r, g, b]; // 默认返回原色
        }
    };

    // 遍历像素数据并应用色调映射
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i] / 255; // Red channel (归一化到[0, 1])
        let g = data[i + 1] / 255; // Green channel
        let b = data[i + 2] / 255; // Blue channel

        // 应用色调映射算法
        [r, g, b] = toneMappingFunction(r, g, b);

        // 恢复到[0, 255]并更新像素数据
        data[i] = Math.min(255, Math.max(0, r * 255));
        data[i + 1] = Math.min(255, Math.max(0, g * 255));
        data[i + 2] = Math.min(255, Math.max(0, b * 255));
    }

    // 更新画布数据
    ctx.value.putImageData(imageData, 0, 0);
    undoRedoStore.saveCanvasState();
}
