import { defineStore } from 'pinia';
import { FaceDetectionResult, FaceDetectionHistory } from "../types/faceDetectionType"; // 引入类型定义

export const useFaceDetectionStore = defineStore('faceDetectionStore', {
    state: () => ({
        faceDetections: [] as FaceDetectionResult[],  // 当前检测到的所有人脸框
        detectionHistory: [] as FaceDetectionHistory[],  // 人脸检测历史记录
        isDetecting: false,  // 当前是否在进行人脸检测
    }),
    actions: {
        // 更新当前的人脸检测结果
        updateFaceDetections(faces: FaceDetectionResult[]) {
            this.faceDetections = faces;
        },
        // 添加一项人脸检测历史记录
        addDetectionHistory(faces: FaceDetectionResult[], canvasState: ImageData) {
            const history: FaceDetectionHistory = {
                faces,
                canvasState,
            };
            this.detectionHistory.unshift(history);  // 插入新的历史记录
        },
        // 清空当前的人脸检测结果
        resetFaceDetection() {
            this.faceDetections = [];
            this.detectionHistory = [];
        },
        // 设置检测状态
        setDetectingStatus(status: boolean) {
            this.isDetecting = status;
        },
    },
});
