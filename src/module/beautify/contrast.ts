// 对比度调整函数
export function applyContrastAdjustment(data: Uint8ClampedArray, contrast: number) {
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, factor * (data[i] - 128) + 128);        // R
        data[i + 1] = Math.min(255, factor * (data[i + 1] - 128) + 128); // G
        data[i + 2] = Math.min(255, factor * (data[i + 2] - 128) + 128); // B
    }
}