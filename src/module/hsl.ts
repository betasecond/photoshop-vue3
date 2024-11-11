import { useUndoRedoStore } from "../store/undoRedoStore";
import { rgbToHsl, hslToRgb } from "../utils/colorUtils";
import {HSL} from "../types/HSLType";
import {CanvasContext} from "../types/ContextType";

export function adjustHSL({ canvas, ctx }: CanvasContext, newHSL:HSL) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }
    undoRedoStore.saveCanvasState();

    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        let [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);

        // 调整 HSL 值
        h = (h + newHSL.hue / 360) % 1;
        s = Math.min(1, Math.max(0, s * (1 + newHSL.saturation / 100)));
        l = Math.min(1, Math.max(0, l * (1 + newHSL.lightness / 100)));

        const [r, g, b] = hslToRgb(h, s, l);
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
    }

    ctx.value.putImageData(imageData, 0, 0);
}
