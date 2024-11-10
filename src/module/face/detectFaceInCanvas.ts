import * as faceapi from 'face-api.js';
import {useUndoRedoStore} from "../../store/undoRedoStore";

export const detectFaceInCanvas = async (
    canvas: Ref<HTMLCanvasElement | null>,
    drawBox: boolean = true
) => {
    const undoRedoStore = useUndoRedoStore();

    // 检查 canvas 是否有效
    if (!canvas.value) {
        console.error('Canvas is not available.');
        return;
    }

    console.log('Canvas is available, proceeding with face detection...');

    // 保存 canvas 状态
    undoRedoStore.saveCanvasState();
    console.log('Canvas state saved.');

    try {
        // 执行人脸检测
        console.log('Detecting faces on canvas...');
        const detections = await faceapi.detectAllFaces(canvas.value, new faceapi.SsdMobilenetv1Options({
            minConfidence: 0.5, // 调整检测的置信度
            maxResults: 10 // 限制最大检测面部数
        })).withFaceLandmarks().withFaceDescriptors();

        // 输出检测结果
        console.log('Face detection complete.');
        console.log('Detected faces:', detections.length);

        // 如果需要绘制框，调用绘制框的函数
        if (drawBox) {
            console.log('Drawing face boxes on canvas...');
            drawFaceBoxes(canvas.value, detections);
            console.log('Face boxes drawn.');
        }

        // 输出检测到的人脸信息
        console.log('Face detection results:', detections);
        return detections;  // 返回检测到的面部信息

    } catch (error) {
        console.error('Error during face detection:', error);
    }
};

// 绘制红色框
const drawFaceBoxes = (canvas: HTMLCanvasElement, detections: any) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Failed to get canvas context.');
        return;
    }

    console.log('Starting to draw face boxes...');

    // 遍历检测到的人脸并绘制红色框
    detections.forEach((d: any, index: number) => {
        const { x, y, width, height } = d.detection.box;
        console.log(`Drawing box for face ${index + 1}: x=${x}, y=${y}, width=${width}, height=${height}`);

        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.stroke();
    });

    console.log('Face boxes drawn successfully.');
};
