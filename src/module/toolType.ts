// 绘图工具 (Drawing Tools)
export enum DrawingToolType {
    Brush = 'brush',
    Eraser = 'eraser',
    Line = 'line',
    Rectangle = 'rectangle',
    Circle = 'circle',
}

// 选择工具 (Shape Selection)
export enum SelectionToolType {
    Crop = 'crop',
    Rotate = 'rotate',
}

// 参数调整工具 (Parameter Adjustment)
export enum AdjustmentToolType {
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
}

// 一键式功能 (One-click Actions)
export enum OneClickActionToolType {
    Watermark = 'watermark',
    Dehaze = 'dehaze',
    FaceDetection = 'faceDetection',
    FaceBeautify = 'faceBeautify',
    AdvancedFilters = 'advancedFilters',
    FaceExpression = 'faceExpression',
    LocalBrightnessExposure = 'localBrightnessExposure',
}
// 判断工具类型是否属于绘图工具
export function isDrawingTool(tool: ToolType): tool is DrawingToolType {
    return Object.values(DrawingToolType).includes(tool as DrawingToolType);
}

// 判断工具类型是否属于选择工具
export function isSelectionTool(tool: ToolType): tool is SelectionToolType {
    return Object.values(SelectionToolType).includes(tool as SelectionToolType);
}

// 判断工具类型是否属于参数调整工具
export function isAdjustmentTool(tool: ToolType): tool is AdjustmentToolType {
    return Object.values(AdjustmentToolType).includes(tool as AdjustmentToolType);
}

// 判断工具类型是否属于一键式功能
export function isOneClickActionTool(tool: ToolType): tool is OneClickActionToolType {
    return Object.values(OneClickActionToolType).includes(tool as OneClickActionToolType);
}
// 所有工具类型集合
export type ToolType = DrawingToolType | SelectionToolType | AdjustmentToolType | OneClickActionToolType;
// 工具映射函数
export function mapToolType(tool: string): ToolType {
    // 检查是否在绘图工具中
    if (tool in DrawingToolType) {
        return DrawingToolType[tool as keyof typeof DrawingToolType];
    }
    // 检查是否在选择工具中
    if (tool in SelectionToolType) {
        return SelectionToolType[tool as keyof typeof SelectionToolType];
    }
    // 检查是否在参数调整工具中
    if (tool in AdjustmentToolType) {
        return AdjustmentToolType[tool as keyof typeof AdjustmentToolType];
    }
    // 检查是否在一键式功能中
    if (tool in OneClickActionToolType) {
        return OneClickActionToolType[tool as keyof typeof OneClickActionToolType];
    }

    // 若不属于任何工具分类，抛出错误
    throw new Error(`Invalid tool type: ${tool}`);
}