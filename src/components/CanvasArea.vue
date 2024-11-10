<script setup lang="ts">
import {initializeCanvas} from '../module/canvasInitialize';
import {loadImage} from "../module/imageLoad";
import {saveImage} from "../module/imageSave";
import {draw, startDrawing, stopDrawing} from "../module/drawing";
import {AdjustmentToolType, EditToolType, OneClickActionToolType, ToolType} from "../types/toolType";
import {adjustBrightness} from "../module/brightnessAdjust";
import {useUndoRedoStore} from "../store/undoRedoStore";
import {applyWatermark} from "../module/watermark";
import {adjustContrast} from "../module/contrastAdjust";
import {adjustRotation} from "../module/rotation";
import {cropCanvas} from "../module/crop";
import {WatermarkOptions} from "../types/watermarkType";
import {adjustSaturation} from "../module/saturation";
import {adjustExposure} from "../module/exposure";
import {adjustHSL} from "../module/hsl";
import {HSL} from "../types/HSLType";
import {applySharpen} from "../module/applySharpen";
import {histogramEqualization} from "../module/histogramEqualization";
import {adjustCurve} from "../module/adjustCurve";
import {applySmoothing} from "../module/applySmoothing";
import {ToneMappingConfig} from "../types/ToneMappingConfigType";
import {applyToneMapping} from "../module/toneMapping";
import {adjustColorTemperature} from "../module/colorTemperature"
import {adjustDehaze} from "../module/dehaze";
import {detectFaceInCanvas} from "../module/face/detectFaceInCanvas";
import {loadModels} from "../module/face/faceDetection";


// 引入并初始化状态管理
const undoRedoStore = useUndoRedoStore();

// 引用和状态
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
let isDrawing = false;

// 属性定义
const props = defineProps<{
  selectedTool: ToolType;       // 当前选中的工具类型
  selectedColor: string;        // 绘图颜色（用于 Brush 和 Line 工具）
  brushSize: number;            // 画笔大小（仅在 Brush 工具下使用）
  eraserSize: number;           // 橡皮擦大小（仅在 Eraser 工具下使用）
  brightness: number;           // 亮度调整值（用于亮度调整）
  contrast: number;             // 新增对比度属性
  saturation:number;            // 饱和度
  exposure:number;              // 曝光
  rotation?: number;       // 旋转角度（用于 Rotate 工具）
  intensity:number;              // 锐化强度
  colorTemperature:number;
  selectionBounds?: {           // 裁剪选区（用于 Crop 工具）
    x: number;
    y: number;
    width: number;
    height: number;
  };
  channel: 'red' | 'green' | 'blue',
  smoothRadius:number,
  hsl:HSL,
  dehazeStrength:number,
  curveAdjustmentState:CurveAdjustmentState,
  toneMappingConfig:ToneMappingConfig,
  watermarkOptions: WatermarkOptions;
  appliedEffect: { type:OneClickActionToolType,id:number } | null;
  appliedAdjustment: {type: AdjustmentToolType,id:number }| null;
  appliedEditTool:{type:EditToolType,id:number } | null;
}>();

// 挂载后的 Canvas 初始化
onMounted(() => {
  initializeCanvas(canvas, ctx);
  if (canvas.value && ctx.value) {
    undoRedoStore.initializeCanvasState(canvas.value, ctx.value);
  } else {
    console.error('Failed to initialize canvas or context');
  }
  // 人脸模型
  loadModels();
});

// 亮度调整监听
watch(() => props.brightness, (newBrightness) => {
  if (newBrightness !== 0) {
    adjustBrightness(canvas, ctx, newBrightness);
  }
});

// 图片加载处理
const handleImageLoad = (event: Event) => {
  if (canvas.value) {
    loadImage(event, canvas, ctx);
  } else {
    console.log('Canvas is not ready for loading images.');
  }
};
// 定义具体的一键效果逻辑
const applyEffectLogic = (effect: OneClickActionToolType) => {
  switch (effect) {
    case OneClickActionToolType.Watermark:
      console.log("Applying Watermark effect on canvas");
      if (ctx.value && canvas.value) {
        applyWatermark(canvas, ctx, props.watermarkOptions);
      }
      break;
    case OneClickActionToolType.FaceDetection:
      console.log("Applying Face Detection effect on canvas");
      // 调用人脸检测逻辑
      if (canvas.value) {
        // 调用人脸检测逻辑并绘制框
        detectFaceInCanvas(canvas,true)  // true表示绘制红框
            .then((detections) => {
              console.log('Face Detection Results:', detections);
            })
            .catch((error) => {
              console.error('Error during face detection:', error);
            });
      }
      break;
    case OneClickActionToolType.Dehaze:
      console.log("Applying Dehaze effect on canvas");
      adjustDehaze(canvas,ctx,props.dehazeStrength);
      break;
    default:
      console.warn(`Effect ${effect} is not implemented.`);
      break;
  }
};
// 定义具体的一键效果逻辑
const applyAdjustmentLogic = (adjustmentToolType: AdjustmentToolType) => {
  switch (adjustmentToolType) {
    case AdjustmentToolType.Contrast:
      console.log("Applying Contrast Adjustment on canvas");
      if (ctx.value && canvas.value) {
        adjustContrast(canvas, ctx,props.contrast);
      }
      break;
    case AdjustmentToolType.Brightness:
      console.log("Applying Bright Adjustment on canvas");
      if(ctx.value && canvas.value){
        adjustBrightness(canvas,ctx,props.brightness);
      }
      break;
    case AdjustmentToolType.Exposure:
      console.log("Applying Exposure Adjustment on canvas");
      if (ctx.value && canvas.value) {
        adjustExposure(canvas, ctx, props.exposure);
      }
      break;
    case AdjustmentToolType.Saturation:
      console.log("Applying Saturation Adjustment on canvas");
      if (ctx.value && canvas.value) {
        adjustSaturation(canvas, ctx, props.saturation);
      }
      break;
    case AdjustmentToolType.HSL:
      console.log("Applying HSL Adjustment on canvas");
      if (ctx.value && canvas.value) {
        adjustHSL(canvas, ctx, props.hsl);
      }
      break;
    case AdjustmentToolType.HistogramEqualization:
      console.log("Applying HistogramEqualization Adjustment on canvas");
      if (ctx.value && canvas.value) {
        histogramEqualization(canvas,ctx);
      }
      break;
    case AdjustmentToolType.Sharpen:
      console.log("Applying Sharpend Adjustment on canvas");
      if (ctx.value && canvas.value) {
        applySharpen(canvas,ctx,props.intensity);
      }
      break;
    case AdjustmentToolType.Smoothing:
      console.log("Applying Smoothing Adjustment on canvas");
      if(ctx.value && canvas.value){
        applySmoothing(canvas,ctx,props.smoothRadius);
      }
      break;
    case AdjustmentToolType.CurveAdjustment:
      console.log("Applying Curve Adjustment on canvas");
      if (ctx.value && canvas.value) {
        let channel = props.channel;
        //  TODO:用法太自由 后续改成switch
        let key:string = `${channel}Curve`;
        let curve = props.curveAdjustmentState[key];
        if(!curve){
          console.log("curve is missing. content key:"+key);
          return;
        }
        adjustCurve(canvas, ctx, curve, channel);
      }
      break;
    case AdjustmentToolType.ToneMapping:
      console.log("Applying Tone Mapping Adjustment on canvas");
      if(ctx.value && canvas.value) {
        applyToneMapping(canvas,ctx,props.toneMappingConfig.type,props.toneMappingConfig.params);
      }
      break;
    case AdjustmentToolType.ColorTemperature:
      console.log("Applying ColorTemperature on canvas");
      if(ctx.value && canvas.value) {
        adjustColorTemperature(canvas,ctx,props.colorTemperature);
      }
      break;
    default:
      console.warn(`Adjustment ${adjustmentToolType} is not implemented.`);
      break;
  }
};
// 定义具体的编辑工具逻辑
const applyEditToolLogic = (editTooType: EditToolType) => {
  switch (editTooType) {
    case EditToolType.Rotate:
      console.log("Applying Rotate EditTool on canvas");
      if (ctx.value && canvas.value) {
        adjustRotation(canvas, ctx,props.rotation);
      }
      break;
    case EditToolType.Crop:
      console.log("Applying Crop EditTool on canvas");
      if(ctx.value && canvas.value){
        cropCanvas(canvas, ctx,props.selectionBounds);
      }
      break;
    default:
      console.warn(`EditToolType ${editTooType} is not implemented.`);
      break;
  }
};
// 一键式功能监听
watch(() => props.appliedEffect, (newEffect, oldEffect) => {
  if (newEffect && (!oldEffect || newEffect.id !== oldEffect.id)) {
    applyEffectLogic(newEffect.type);
  }
});

// 参数调整监听
watch(() => props.appliedAdjustment, (newAdjustment, oldAdjustment) => {
  if (newAdjustment && (!oldAdjustment || newAdjustment.id !== oldAdjustment.id)) {
    applyAdjustmentLogic(newAdjustment.type);
  }
});

watch(() => props.appliedEditTool,(newEditTool,oldEditTool) => {
  if(newEditTool &&( !oldEditTool ||  newEditTool.id !== oldEditTool.id) ){
    applyEditToolLogic(newEditTool.type);
  }
})
// 保存图片
const handleSaveImage = () => {
  if (canvas.value) saveImage(canvas);
};

// 绘制相关事件
const handleMouseDown = (event: MouseEvent) => {
  isDrawing = startDrawing(props.selectedTool, isDrawing);
};

const handleMouseUp = () => {
  stopDrawing(ctx);
  isDrawing = false;
};

const handleMouseMove = (event: MouseEvent) => {
  draw(event, canvas, ctx, props.selectedTool, {
    color: props.selectedColor,
    brushSize: props.brushSize,
    eraserSize: props.eraserSize
  }, isDrawing);
};

</script>

<template>
  <div class="canvas-container">
    <input type="file" accept="image/*" @change="(event) => handleImageLoad(event, canvas, ctx)" />

    <canvas
        ref="canvas"
        width="1000"
        height="1000"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mousemove="handleMouseMove"
    ></canvas>
    <button @click="handleSaveImage">Save Image</button>
  </div>
</template>
<style scoped>
.canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
}

canvas {
  border: 1px solid #ccc;
  margin-top: 10px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  cursor: pointer;
}
</style>