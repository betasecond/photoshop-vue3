/**
 * 表示水印选项的接口
 */
export interface WatermarkOptions {
    text: string; // 水印内容
    fontSize?: number; // 水印字体大小，默认值为 20
    color?: string; // 水印字体颜色，默认值为黑色
    opacity?: number; // 水印透明度，默认值为 0.5
    position: { x: number; y: number }; // 水印位置，默认值为右下角
}