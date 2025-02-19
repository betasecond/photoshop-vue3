/**
 * 表示人脸检测结果的接口
 */
export interface FaceDetectionResult {
    id: string; // 人脸检测结果的唯一标识符
    x: number; // 人脸框的左上角 x 坐标
    y: number; // 人脸框的左上角 y 坐标
    width: number; // 人脸框的宽度
    height: number; // 人脸框的高度
}

/**
 * 表示人脸检测历史记录的接口
 */
export interface FaceDetectionHistory {
    faces: FaceDetectionResult[]; // 检测到的人脸框数组
    canvasState: ImageData; // 检测前的画布状态（图像数据）
}

/**
 * 表示应用中人脸检测状态的接口
 */
export interface FaceDetectionState {
    faceDetections: FaceDetectionResult[]; // 当前检测到的人脸数组
    detectionHistory: FaceDetectionHistory[]; // 人脸检测历史记录数组
}