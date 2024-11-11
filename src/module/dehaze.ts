import { Ref } from 'vue';
import { adjustContrast } from './contrast';  // 导入现有的对比度调整函数
import { adjustBrightness } from './brightness';  // 导入现有的亮度调整函数

// 用于去雾的算法实现
export function adjustDehaze({ canvas, ctx }: CanvasContext, dehazeStrength: number) {
    // 根据去雾强度计算对比度和亮度
    const contrastValue = dehazeStrength * 0.5;  // 对比度值，根据强度调整
    const brightnessValue = dehazeStrength * 0.3;  // 亮度值，根据强度调整

    // 调整对比度
    adjustContrast(canvas, ctx, contrastValue);

    // 调整亮度
    adjustBrightness(canvas, ctx, brightnessValue);
}