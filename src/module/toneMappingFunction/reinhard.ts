import { ReinhardParams } from "../../types/toneMappingConfigType";

// 应用 Reinhard 色调映射算法
/**
 * 应用 Reinhard 色调映射算法
 * @param {number} r - 红色分量，范围 0-1
 * @param {number} g - 绿色分量，范围 0-1
 * @param {number} b - 蓝色分量，范围 0-1
 * @param {ReinhardParams} params - Reinhard 算法参数，包含缩放因子和最大亮度
 * @returns {number[]} 应用 Reinhard 算法后的 RGB 颜色数组
 */
export function applyReinhard(r: number, g: number, b: number, params: ReinhardParams): number[] {
    const { a, maxLuminance } = params;
    const scale = a / (1 + a);
    r = r * scale / maxLuminance;
    g = g * scale / maxLuminance;
    b = b * scale / maxLuminance;
    return [r, g, b];
}