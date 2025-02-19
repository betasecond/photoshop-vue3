/**
 * 表示曲线上的一个点的接口
 */
interface CurvePoint {
    input: number;  // 输入色阶（x 轴）
    output: number; // 输出色阶（y 轴）
}

/**
 * 表示曲线调整状态的接口
 */
export interface CurveAdjustmentState {
    redCurve: Curve; // 红色通道的曲线
    greenCurve: Curve; // 绿色通道的曲线
    blueCurve: Curve; // 蓝色通道的曲线
}

type Curve = CurvePoint[];