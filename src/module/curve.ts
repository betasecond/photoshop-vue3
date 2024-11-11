import {useUndoRedoStore} from "../store/undoRedoStore";

export function adjustCurve(
{ canvas, ctx }: CanvasContext,
    curve: Curve,
    channel: 'red' | 'green' | 'blue'
) {
    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }
    if(!curve){
        console.error('curve is missing.');
        return;
    }
    const undoRedoStore = useUndoRedoStore();
    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;
    undoRedoStore.saveCanvasState();
    // 对每个像素进行曲线调整
    for (let i = 0; i < data.length; i += 4) {
        let channelValue: number;
        if (channel === 'red') {
            channelValue = data[i];
        } else if (channel === 'green') {
            channelValue = data[i + 1];
        } else {
            channelValue = data[i + 2];
        }

        // 使用曲线调整每个通道的值
        const adjustedValue = applyCurve(channelValue, curve);

        // 更新相应通道的值
        if (channel === 'red') {
            data[i] = adjustedValue;
        } else if (channel === 'green') {
            data[i + 1] = adjustedValue;
        } else {
            data[i + 2] = adjustedValue;
        }
    }

    ctx.value.putImageData(imageData, 0, 0);
}

// 根据曲线调整某个值
function applyCurve(inputValue: number, curve: Curve): number {
    // 在曲线中查找与输入值对应的输出值
    for (let i = 0; i < curve.length - 1; i++) {
        const point1 = curve[i];
        const point2 = curve[i + 1];
        if (inputValue >= point1.input && inputValue <= point2.input) {
            // 使用线性插值法计算输出值
            const ratio = (inputValue - point1.input) / (point2.input - point1.input);
            return Math.round(point1.output + ratio * (point2.output - point1.output));
        }
    }
    return inputValue; // 默认返回原值
}
