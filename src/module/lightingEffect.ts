import {useUndoRedoStore} from "../store/undoRedoStore";
import {CanvasContext} from "../types/contextType";

export function adjustLightingEffect({ canvas, ctx }: CanvasContext, lightX: number, lightY: number, lightStrength: number) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }

    // 获取当前画布上的图像数据
    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;  // 图像的像素数据

    // 遍历每个像素，模拟光照效果
    for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % canvas.value.width;  // 当前像素的X坐标
        const y = Math.floor(i / 4 / canvas.value.width);  // 当前像素的Y坐标

        // 计算当前像素到光源的距离（可以使用欧几里得距离公式）
        const distance = Math.sqrt(Math.pow(x - lightX, 2) + Math.pow(y - lightY, 2));

        // 根据距离计算亮度变化，距离越远亮度越低
        const intensity = Math.max(0, 1 - (distance / lightStrength));

        // 获取当前像素的RGB通道数据
        data[i] = Math.min(255, data[i] * (1 + intensity));       // R 通道
        data[i + 1] = Math.min(255, data[i + 1] * (1 + intensity)); // G 通道
        data[i + 2] = Math.min(255, data[i + 2] * (1 + intensity)); // B 通道
    }

    // 将调整后的数据放回画布
    ctx.value.putImageData(imageData, 0, 0);

    // 在调整光照效果后保存状态
    undoRedoStore.saveCanvasState();
}
