// 人脸检测结果的数据结构
export interface FaceDetectionResult {
    id: string;        // 唯一标识符
    x: number;         // 人脸框的左上角x坐标
    y: number;         // 人脸框的左上角y坐标
    width: number;     // 人脸框的宽度
    height: number;    // 人脸框的高度
}

// 人脸检测的历史记录
export interface FaceDetectionHistory {
    faces: FaceDetectionResult[];  // 当前检测到的人脸框数组
    canvasState: ImageData;        // 检测前的Canvas状态（图像数据）
}

// 当前应用的状态
export interface FaceDetectionState {
    faceDetections: FaceDetectionResult[];  // 当前已检测到的人脸
    detectionHistory: FaceDetectionHistory[];  // 历史记录
}
