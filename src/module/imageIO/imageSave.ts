import { useUndoRedoStore } from "../../store/undoRedoStore";
import { Ref } from "vue";

/**
 * 保存画布上的图像为 PNG 文件
 * @param {Ref<HTMLCanvasElement | null>} canvas - 画布的引用
 */
export function saveImage(canvas: Ref<HTMLCanvasElement | null>) {
    if (!canvas.value) {
        console.error("Can't save the image");
        return;
    }

    // 获取画布内容的 Data URL
    const dataURL = canvas.value.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'image.png';
    link.click();
}