import {FilmicParams} from "../../types/toneMappingConfigType";

export function applyFilmic(r: number, g: number, b: number, params: FilmicParams): number[] {
    const { exposure, contrast, saturation } = params;
    // Filmic 算法（这里只是一个示例）
    r = r * exposure * contrast * saturation;
    g = g * exposure * contrast * saturation;
    b = b * exposure * contrast * saturation;
    return [r, g, b];
}