import { FilmicParams } from "../../types/toneMappingConfigType";

// 应用 Filmic 色调映射算法
/**
 * 应用 Filmic 色调映射算法
 * @param {number} r - 红色分量，范围 0-1
 * @param {number} g - 绿色分量，范围 0-1
 * @param {number} b - 蓝色分量，范围 0-1
 * @param {FilmicParams} params - Filmic 算法参数，包含曝光度、对比度和饱和度
 * @returns {number[]} 应用 Filmic 算法后的 RGB 颜色数组
 */
export function applyFilmic(r: number, g: number, b: number, params: FilmicParams): number[] {
    const { exposure, contrast, saturation } = params;

    r = r * exposure * contrast * saturation;
    g = g * exposure * contrast * saturation;
    b = b * exposure * contrast * saturation;
    return [r, g, b];
}