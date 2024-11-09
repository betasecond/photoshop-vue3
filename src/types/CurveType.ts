interface CurvePoint {
    input: number;  // 输入色阶（x轴）
    output: number; // 输出色阶（y轴）
}

interface CurveAdjustmentState {
    redCurve: Curve;
    greenCurve: Curve;
    blueCurve: Curve;
}

type Curve = CurvePoint[];
