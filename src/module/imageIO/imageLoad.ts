import { useUndoRedoStore } from '../../store/undoRedoStore';
import { CanvasContext } from "../../types/contextType";

/**
 * 加载图像并绘制到画布上
 * @param {Event} event - 文件选择事件
 * @param {CanvasContext} context - 画布上下文，包含 canvas 和 ctx 的引用
 */
export function loadImage(event: Event, { canvas, ctx }: CanvasContext) {
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
    undoRedoStore.saveCanvasState();

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