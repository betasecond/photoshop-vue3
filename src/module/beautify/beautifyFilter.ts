import { useUndoRedoStore } from "../../store/undoRedoStore";
import { FaceDetectionResult, FaceDetectionHistory } from "../../types/faceDetectionType";
import { BeautifyParams } from "../../types/beautifyType";
import { applyBrightnessAdjustment } from "./brightness";
import { applyContrastAdjustment } from "./contrast";
import { applySkinToneAdjustment } from "./skinTone";
import { applySmoothingToFace } from "./smooth";
import {CanvasContext} from "../../types/contextType";

// 应用美颜滤镜
/**
 * 应用美颜滤镜到检测到的人脸区域
 * @param {CanvasContext} context - 画布上下文
 * @param {FaceDetectionResult[]} faceDetections - 人脸检测结果数组
 * @param {BeautifyParams} beautifyParams - 美颜参数
 */
export function applyBeautifyFilter(
    { canvas, ctx }: CanvasContext,
    faceDetections: FaceDetectionResult[],
    beautifyParams: BeautifyParams,
) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }

    // 保存当前 canvas 状态
    const currentCanvasState = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);

    // 保存到历史记录
    const newHistory: FaceDetectionHistory = {
        faces: faceDetections,
        canvasState: currentCanvasState
    };

    undoRedoStore.saveCanvasState();  // 保存到撤销/重做状态

    // 遍历每个检测到的人脸
    faceDetections.forEach(face => {
        const faceImageData = ctx.value.getImageData(face.x, face.y, face.width, face.height);
        const faceData = faceImageData.data;

        // 1. 平滑处理
        applySmoothingToFace({ canvas, ctx }, [face], beautifyParams.smoothStrength);

        // 2. 亮度调整
        applyBrightnessAdjustment(faceData, beautifyParams.brightness);

        // 3. 对比度调整
        applyContrastAdjustment(faceData, beautifyParams.contrast);

        // 4. 皮肤色调调整
        applySkinToneAdjustment(faceData, beautifyParams.skinTone);

        // 更新图像数据
        ctx.value.putImageData(faceImageData, face.x, face.y);
    });
}