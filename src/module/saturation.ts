import {hslToRgb, rgbToHsl} from "../utils/colorUtils";
import {useUndoRedoStore} from "../store/undoRedoStore";
import {CanvasContext} from "../types/contextType";

export function adjustSaturation({ canvas, ctx }: CanvasContext, saturationValue: number) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }
    undoRedoStore.saveCanvasState();

    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;
    const saturationAdjustment = saturationValue / 100;  // 将输入值转换为一个适当的比率

    for (let i = 0; i < data.length; i += 4) {
        let [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
        s = Math.min(1, Math.max(0, s * (1 + saturationAdjustment))); // 调整饱和度

        const [r, g, b] = hslToRgb(h, s, l);
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
    }

    ctx.value.putImageData(imageData, 0, 0);
}