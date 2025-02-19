// 亮度调整函数
/**
 * 调整图像的亮度
 * @param {Uint8ClampedArray} data - 图像数据数组
 * @param {number} brightness - 亮度调整值
 */
export function applyBrightnessAdjustment(data: Uint8ClampedArray, brightness: number) {
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + brightness);        // 调整红色分量
        data[i + 1] = Math.min(255, data[i + 1] + brightness); // 调整绿色分量
        data[i + 2] = Math.min(255, data[i + 2] + brightness); // 调整蓝色分量
    }
}