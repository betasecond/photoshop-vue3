// 工具类型定义
export enum ToolType {
    Brush = 'brush',
    Eraser = 'eraser',
    Line = 'line',
    Rectangle = 'rectangle',
    Circle = 'circle',
    // 其他未来可能的工具类型
}
// 工具映射函数
function mapToolType(tool: string): ToolType {
    switch (tool) {
        case 'brush':
            return ToolType.Brush;
        case 'eraser':
            return ToolType.Eraser;
        case 'line':
            return ToolType.Line;
        case 'rectangle':
            return ToolType.Rectangle;
        default:
            throw new Error('Invalid tool type');
    }
}