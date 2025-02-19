/**
 * 表示裁剪区域的接口
 */
export interface CropArea {
    x: number; // 裁剪区域左上角的 x 坐标
    y: number; // 裁剪区域左上角的 y 坐标
    width: number; // 裁剪区域的宽度
    height: number; // 裁剪区域的高度
}