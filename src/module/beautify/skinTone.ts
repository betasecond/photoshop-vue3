// 皮肤色调调整函数
export function applySkinToneAdjustment(data: Uint8ClampedArray, skinTone: string) {
    // 根据 skinTone 参数调整颜色
    if (skinTone === "warm") {
        // 增加红色和黄色的饱和度
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.1);        // R
            data[i + 1] = Math.min(255, data[i + 1] * 1.05); // G
        }
    } else if (skinTone === "cool") {
        // 增加蓝色的饱和度
        for (let i = 0; i < data.length; i += 4) {
            data[i + 2] = Math.min(255, data[i + 2] * 1.1); // B
        }
    }
}