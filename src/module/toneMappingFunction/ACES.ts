import {ACESParams} from "../../types/ToneMappingConfigType";

export function applyACES(r: number, g: number, b: number, params: ACESParams): number[] {
    const { exposure, whitePoint } = params;
    // ACES 算法（这里只是一个示例）
    r = r * exposure * whitePoint;
    g = g * exposure * whitePoint;
    b = b * exposure * whitePoint;
    return [r, g, b];
}
