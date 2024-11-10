// 亮度调整函数
export function applyBrightnessAdjustment(data: Uint8ClampedArray, brightness: number) {
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + brightness);        // R
        data[i + 1] = Math.min(255, data[i + 1] + brightness); // G
        data[i + 2] = Math.min(255, data[i + 2] + brightness); // B
    }
}