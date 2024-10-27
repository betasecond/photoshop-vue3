// 定义水印选项接口
export interface WatermarkOptions {
    text: string;             // 水印内容
    fontSize?: number;        // 字体大小，默认 20
    color?: string;           // 字体颜色，默认黑色
    opacity?: number;         // 透明度，默认 0.5
    position: { x: number; y: number }; // 水印位置，默认右下角
}
