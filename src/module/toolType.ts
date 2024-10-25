// 工具类型定义
export enum ToolType {
    Brush = 'brush',
    Eraser = 'eraser',
    Line = 'line',
    Rectangle = 'rectangle',
    Circle = 'circle',
    Crop = 'crop',
    Rotate = 'rotate',
    Brightness = 'brightness',
    Contrast = 'contrast',
    Saturation = 'saturation',
    Exposure = 'exposure',
    HSL = 'hsl',
    Sharpen = 'sharpen',
    Smoothing = 'smoothing',
    CurveAdjustment = 'curveAdjustment',
    HistogramEqualization = 'histogramEqualization',
    ToneMapping = 'toneMapping',
    ColorTemperature = 'colorTemperature',
    Dehaze = 'dehaze',
    FaceDetection = 'faceDetection',
    FaceBeautify = 'faceBeautify',
    AdvancedFilters = 'advancedFilters',
    FaceExpression = 'faceExpression',
    LocalBrightnessExposure = 'localBrightnessExposure'
}
// 工具映射函数
export function mapToolType(tool: string): ToolType {
    const toolType = ToolType[tool as keyof typeof ToolType];
    if (toolType) {
        return toolType;
    } else {
        throw new Error(`Invalid tool type: ${tool}`);
    }
}