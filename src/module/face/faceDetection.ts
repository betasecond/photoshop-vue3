import * as faceapi from 'face-api.js';

export const loadModels = async () => {
    try {
        console.log('Starting to load models...');

        // 加载人脸检测模型
        console.log('Loading SSD MobilenetV1 model...');
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models/');
        console.log('SSD MobilenetV1 model loaded successfully.');

        // 加载面部关键点模型
        console.log('Loading Face Landmark 68 model...');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models/');
        console.log('Face Landmark 68 model loaded successfully.');

        // 如果需要加载人脸识别模型（可选）
        console.log('Loading Face Recognition model...');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models/');
        console.log('Face Recognition model loaded successfully.');

        console.log('All models loaded successfully');
    } catch (error) {
        console.error('Error loading models:', error);
    }
};

// 调用此函数来加载所有模型
// loadModels();
