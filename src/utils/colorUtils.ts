/**
 * 将 RGB 颜色转换为 HSL 颜色
 * @param {number} r - 红色分量，范围 0-255
 * @param {number} g - 绿色分量，范围 0-255
 * @param {number} b - 蓝色分量，范围 0-255
 * @returns {[number, number, number]} HSL 颜色数组，分别表示色相、饱和度和亮度
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    // 将 RGB 分量从 0-255 范围转换到 0-1 范围
    r /= 255;
    g /= 255;
    b /= 255;

    // 找到最大和最小的 RGB 分量
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    // 如果最大和最小分量不相等，则计算色相和饱和度
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    // 返回 HSL 颜色数组
    return [h, s, l];
}

/**
 * @param {number} h - 色相，范围 0-1
 * @param {number} s - 饱和度，范围 0-1
 * @param {number} l - 亮度，范围 0-1
 * @returns {[number, number, number]} RGB 颜色数组，分别表示红色、绿色和蓝色分量，范围 0-255
 */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r, g, b;

    // 如果饱和度为 0，则为灰色
    if (s === 0) {
        r = g = b = l;
    } else {
        // 辅助函数，将色相转换为 RGB
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        // 计算 q 和 p
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        // 计算 RGB 分量
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
}