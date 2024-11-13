<script setup lang="ts">
import {initializeCanvas} from '../module/canvasInitialize';
import {loadImage} from "../module/imageIO/imageLoad";
import {saveImage} from "../module/imageIO/imageSave";
import {draw, startDrawing, stopDrawing} from "../module/drawing";
import {AdjustmentToolType, EditToolType, OneClickActionToolType, ToolType} from "../types/toolType";
import {adjustBrightness} from "../module/brightness";
import {useUndoRedoStore} from "../store/undoRedoStore";
import {applyWatermark} from "../module/watermark";
import {adjustContrast} from "../module/contrast";
import {adjustRotation} from "../module/rotation";
import {cropCanvas} from "../module/crop";
import {WatermarkOptions} from "../types/watermarkType";
import {adjustSaturation} from "../module/saturation";
import {adjustExposure} from "../module/exposure";
import {adjustHSL} from "../module/hsl";
import {HSL} from "../types/HSLType";
import {applySharpen} from "../module/sharpen";
import {histogramEqualization} from "../module/histogramEqualization";
import {adjustCurve} from "../module/curve";
import {smoothing} from "../module/smoothing";
import {ToneMappingConfig} from "../types/toneMappingConfigType";
import {applyToneMapping} from "../module/toneMapping";
import {adjustColorTemperature} from "../module/colorTemperature"
import {adjustDehaze} from "../module/dehaze";
import {detectFaceInCanvas, detectFaceInCanvasForBeautify} from "../module/face/detectFaceInCanvas";
import {loadModels} from "../module/face/faceDetection";
import {applyBeautifyFilter} from "../module/beautify/beautifyFilter";
import {BeautifyParams} from "../types/beautifyType";
import {CanvasContext} from "../types/contextType"
import {CurveAdjustmentState} from "../types/curveType";
import '@varlet/ui/es/button/style/index'
import '@varlet/ui/es/input/style/index'
import {VarletStyle} from "../types/varletStyleType";
import {StyleProvider} from "@varlet/ui";
// 引入并初始化状态管理
const undoRedoStore = useUndoRedoStore();

// 引用和状态

const canvasRef: CanvasContext = {
  canvas: ref(null),
  ctx: ref(null),
  getContext(){
    return this.ctx;
  },
  getCanvas(){
    return this.canvas;
  },
  // 检查 canvas 和 ctx 是否都有效
  isValid() {
    return this.canvas.value !== null && this.ctx.value !== null;
  },

  // 检查 canvas 是否有效
  isCanvasValid() {
    return this.canvas.value !== null;
  },

  // 检查 ctx 是否有效
  isContextValid() {
    return this.ctx.value !== null;
  },


};

let isDrawing = false;

// 属性定义
const props = defineProps<{
  selectedTool: ToolType;       // 当前选中的工具类型
  selectedColor: string;        // 绘图颜色（用于 Brush 和 Line 工具）
  brushSize: number;            // 画笔大小（仅在 Brush 工具下使用）
  eraserSize: number;           // 橡皮擦大小（仅在 Eraser 工具下使用）
  brightness: number;           // 亮度调整值（用于亮度调整）
  varletStyle:VarletStyle;      // Varlet 样式库 类型
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

const canvasELementRef = ref<HTMLCanvasElement | null>(null);
const ctxElementRef = ref<CanvasRenderingContext2D | null>(null);
// 挂载后的 Canvas 初始化
onMounted(() => {

  // 更新 canvasRef 中的 canvas 和 ctx
  canvasRef.canvas.value = canvasELementRef.value;
  canvasRef.ctx.value = canvasELementRef.value.getContext('2d');
  initializeCanvas(canvasRef);
  if (canvasRef.isValid()) {
    undoRedoStore.initializeCanvasState(canvasRef.getCanvas().value, canvasRef.getContext().value);
  } else {
    console.error('Failed to initialize canvas or context');
  }
  // 人脸模型
  loadModels();
});

// 亮度调整监听
watch(() => props.brightness, (newBrightness) => {
  if (newBrightness !== 0) {
    adjustBrightness(canvasRef, newBrightness);
  }
});

// 图片加载处理
const handleImageLoad = (event: Event) => {
  if (canvasRef.isCanvasValid()) {
    loadImage(event, canvasRef);
  } else {
    console.log('Canvas is not ready for loading images.');
  }
};
// 定义具体的一键效果逻辑
const applyEffectLogic = (effect: OneClickActionToolType) => {
  switch (effect) {
    case OneClickActionToolType.Watermark:
      console.log("Applying Watermark effect on canvas");
      if (canvasRef.isValid()) {
        applyWatermark(canvasRef, props.watermarkOptions);
      }
      break;
    case OneClickActionToolType.FaceDetection:
      console.log("Applying Face Detection effect on canvas");
      // 调用人脸检测逻辑
      if (canvasRef.isCanvasValid()) {
        // 调用人脸检测逻辑并绘制框
        detectFaceInCanvas(canvasRef.getCanvas(),true)  // true表示绘制红框
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
      adjustDehaze(canvasRef,props.dehazeStrength);
      break;
    case OneClickActionToolType.FaceBeautify:
      const beautifyParams:BeautifyParams = {
        smoothStrength: 5,
        brightness: 10,
        contrast: 1.2, // 适当的对比度调整
        skinTone:'warm'
      };
      console.log("Applying Face Beautify effect on canvas");

      // 调用人脸检测获取所有人脸框
      detectFaceInCanvasForBeautify(canvasRef.getCanvas()).then(faceDetections => {
        if (faceDetections.length > 0) {
          // 调用美颜滤镜应用函数，传入检测到的人脸框和美颜参数
          applyBeautifyFilter(
              canvasRef,
              faceDetections,
              beautifyParams,
          );
        } else {
          console.log("No faces detected, skipping beautify.");
        }
      }).catch(error => {
        console.error("Error during face detection:", error);
      });

      break;
    case OneClickActionToolType.VarletStyle:
      const style:VarletStyle = props.varletStyle;
      StyleProvider(style)
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
      if (canvasRef.isValid()) {
        adjustContrast(canvasRef,props.contrast);
      }
      break;
    case AdjustmentToolType.Brightness:
      console.log("Applying Bright Adjustment on canvas");
      if(canvasRef.isValid()){
        adjustBrightness(canvasRef,props.brightness);
      }
      break;
    case AdjustmentToolType.Exposure:
      console.log("Applying Exposure Adjustment on canvas");
      if (canvasRef.isValid()) {
        adjustExposure(canvasRef, props.exposure);
      }
      break;
    case AdjustmentToolType.Saturation:
      console.log("Applying Saturation Adjustment on canvas");
      if (canvasRef.isValid()) {
        adjustSaturation(canvasRef, props.saturation);
      }
      break;
    case AdjustmentToolType.HSL:
      console.log("Applying HSL Adjustment on canvas");
      if (canvasRef.isValid()) {
        adjustHSL(canvasRef, props.hsl);
      }
      break;
    case AdjustmentToolType.HistogramEqualization:
      console.log("Applying HistogramEqualization Adjustment on canvas");
      if (canvasRef.isValid()) {
        histogramEqualization(canvasRef);
      }
      break;
    case AdjustmentToolType.Sharpen:
      console.log("Applying Sharpend Adjustment on canvas");
      if (canvasRef.isValid()) {
        applySharpen(canvasRef,props.intensity);
      }
      break;
    case AdjustmentToolType.Smoothing:
      console.log("Applying Smoothing Adjustment on canvas");
      if(canvasRef.isValid()){
        smoothing(canvasRef,props.smoothRadius);
      }
      break;
    case AdjustmentToolType.CurveAdjustment:
      console.log("Applying Curve Adjustment on canvas");
      if (canvasRef.isValid()) {
        let channel = props.channel;
        //  TODO:用法太自由 后续改成switch
        let key:string = `${channel}Curve`;
        let curve = props.curveAdjustmentState[key];
        if(!curve){
          console.log("curve is missing. content key:"+key);
          return;
        }
        adjustCurve(canvasRef, curve, channel);
      }
      break;
    case AdjustmentToolType.ToneMapping:
      console.log("Applying Tone Mapping Adjustment on canvas");
      if(canvasRef.isValid()) {
        applyToneMapping(canvasRef,props.toneMappingConfig.type,props.toneMappingConfig.params);
      }else{
        console.log("Unmatched toneMap")
      }
      break;
    case AdjustmentToolType.ColorTemperature:
      console.log("Applying ColorTemperature on canvas");
      if(canvasRef.isValid()) {
        adjustColorTemperature(canvasRef,props.colorTemperature);
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
      if (canvasRef.isValid()) {
        adjustRotation(canvasRef,props.rotation);
      }
      break;
    case EditToolType.Crop:
      console.log("Applying Crop EditTool on canvas");
      if(canvasRef.isValid()){
        cropCanvas(canvasRef,props.selectionBounds);
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
  if (canvasRef.isCanvasValid()) saveImage(canvas);
};

// 绘制相关事件
const handleMouseDown = (event: MouseEvent) => {
  isDrawing = startDrawing(props.selectedTool, isDrawing);
};

const handleMouseUp = () => {
  stopDrawing(canvasRef.getContext());
  isDrawing = false;
};

const handleMouseMove = (event: MouseEvent) => {
  draw(event, canvasRef, props.selectedTool, {
    color: props.selectedColor,
    brushSize: props.brushSize,
    eraserSize: props.eraserSize
  }, isDrawing);
};

</script>

<template>
  <div class="canvas-container">
    <input type="file" accept="image/*" @change="(event) => handleImageLoad(event, canvasRef)" />

    <canvas
        ref="canvasELementRef"
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
  width: 300px; /* 根据需要调整宽度 */
}
</style>