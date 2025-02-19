// 皮肤色调调整函数
/**
 * 调整图像的皮肤色调
 * @param {Uint8ClampedArray} data - 图像数据数组
 * @param {string} skinTone - 皮肤色调类型（"warm" 或 "cool"）
 */
export function applySkinToneAdjustment(data: Uint8ClampedArray, skinTone: string) {
    if (skinTone === "warm") {
        // 增加红色和黄色的饱和度
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.1);        // 调整红色分量
            data[i + 1] = Math.min(255, data[i + 1] * 1.05); // 调整绿色分量
        }
    } else if (skinTone === "cool") {
        // 增加蓝色的饱和度
        for (let i = 0; i < data.length; i += 4) {
            data[i + 2] = Math.min(255, data[i + 2] * 1.1); // 调整蓝色分量
        }
    }
}