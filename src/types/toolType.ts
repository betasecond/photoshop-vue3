/**
 * 表示不同绘图工具的枚举
 */
export enum DrawingToolType {
    Brush = 'brush',
    Eraser = 'eraser',
    Line = 'line',
    Rectangle = 'rectangle',
    Circle = 'circle',
}

/**
 * 表示不同选择工具的枚举
 */
export enum SelectionToolType {
    pass = "pass"
}

/**
 * 表示不同编辑工具的枚举
 */
export enum EditToolType {
    Crop = 'crop',
    Rotate = 'rotate',
    FlipHorizontal = 'flipHorizontal',
    FlipVertical = 'flipVertical',
}

/**
 * 表示不同调整工具的枚举
 */
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

/**
 * 表示不同一键操作工具的枚举
 */
export enum OneClickActionToolType {
    Watermark = 'watermark',
    Dehaze = 'dehaze',
    FaceDetection = 'faceDetection',
    FaceBeautify = 'faceBeautify',
    AdvancedFilters = 'advancedFilters',
    FaceExpression = 'faceExpression',
    LocalBrightnessExposure = 'localBrightnessExposure',
    VarletStyle = 'varletStyle',
}

/**
 * 检查工具类型是否为绘图工具
 * @param tool - 要检查的工具类型
 * @returns {boolean} 如果工具是绘图工具则返回 true，否则返回 false
 */
export function isDrawingTool(tool: ToolType): tool is DrawingToolType {
    return Object.values(DrawingToolType).includes(tool as DrawingToolType);
}

/**
 * 检查工具类型是否为选择工具
 * @param tool - 要检查的工具类型
 * @returns {boolean} 如果工具是选择工具则返回 true，否则返回 false
 */
export function isSelectionTool(tool: ToolType): tool is SelectionToolType {
    return Object.values(SelectionToolType).includes(tool as SelectionToolType);
}

/**
 * 检查工具类型是否为调整工具
 * @param tool - 要检查的工具类型
 * @returns {boolean} 如果工具是调整工具则返回 true，否则返回 false
 */
export function isAdjustmentTool(tool: ToolType): tool is AdjustmentToolType {
    return Object.values(AdjustmentToolType).includes(tool as AdjustmentToolType);
}

/**
 * 检查工具类型是否为一键操作工具
 * @param tool - 要检查的工具类型
 * @returns {boolean} 如果工具是一键操作工具则返回 true，否则返回 false
 */
export function isOneClickActionTool(tool: ToolType): tool is OneClickActionToolType {
    return Object.values(OneClickActionToolType).includes(tool as OneClickActionToolType);
}

/**
 * 检查工具类型是否为编辑工具
 * @param tool - 要检查的工具类型
 * @returns {boolean} 如果工具是编辑工具则返回 true，否则返回 false
 */
export function isEditTool(tool: ToolType): tool is EditToolType {
    return Object.values(EditToolType).includes(tool as EditToolType);
}

/**
 * 表示所有可能的工具类型
 */
export type ToolType = DrawingToolType | SelectionToolType | AdjustmentToolType | OneClickActionToolType | EditToolType;

/**
 * 将字符串映射到工具类型
 * @param tool - 表示工具类型的字符串
 * @returns {ToolType} 对应的工具类型
 * @throws {Error} 如果工具类型无效则抛出错误
 */
export function mapToolType(tool: string): ToolType {
    // 检查是否为绘图工具
    if (tool in DrawingToolType) {
        return DrawingToolType[tool as keyof typeof DrawingToolType];
    }
    // 检查是否为选择工具
    if (tool in SelectionToolType) {
        return SelectionToolType[tool as keyof typeof SelectionToolType];
    }
    // 检查是否为调整工具
    if (tool in AdjustmentToolType) {
        return AdjustmentToolType[tool as keyof typeof AdjustmentToolType];
    }
    // 检查是否为一键操作工具
    if (tool in OneClickActionToolType) {
        return OneClickActionToolType[tool as keyof typeof OneClickActionToolType];
    }

    // 如果工具类型无效，抛出错误
    throw new Error(`Invalid tool type: ${tool}`);
}