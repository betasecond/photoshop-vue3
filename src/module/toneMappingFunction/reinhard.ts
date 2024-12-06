import {ReinhardParams} from "../../types/toneMappingConfigType";

export function applyReinhard(r: number, g: number, b: number, params: ReinhardParams): number[] {
    const { a, maxLuminance } = params;
    // 简化的 Reinhard 算法实现（这里只是一个示例）
    const scale = a / (1 + a);
    r = r * scale / maxLuminance;
    g = g * scale / maxLuminance;
    b = b * scale / maxLuminance;
    return [r, g, b];
}