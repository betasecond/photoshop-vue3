// 对比度调整函数
/**
 * 调整图像的对比度
 * @param {Uint8ClampedArray} data - 图像数据数组
 * @param {number} contrast - 对比度调整值
 */
export function applyContrastAdjustment(data: Uint8ClampedArray, contrast: number) {
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, factor * (data[i] - 128) + 128);        // 调整红色分量
        data[i + 1] = Math.min(255, factor * (data[i + 1] - 128) + 128); // 调整绿色分量
        data[i + 2] = Math.min(255, factor * (data[i + 2] - 128) + 128); // 调整蓝色分量
    }
}