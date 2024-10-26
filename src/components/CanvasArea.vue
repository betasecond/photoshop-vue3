<script setup lang="ts">
import { initializeCanvas } from '../module/canvasInitialize';
import { loadImage } from "../module/imageLoad";
import { saveImage } from "../module/imageSave";
import { startDrawing, stopDrawing, draw } from "../module/drawing";
import {OneClickActionToolType, ToolType} from "../module/toolType";
import { adjustBrightness } from "../module/brightnessAdjust";
import { useUndoRedoStore } from "../store/undoRedoStore";
import {applyWatermark,WatermarkOptions, defaultOptions} from "../module/watermark";


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
  rotationAngle?: number;       // 旋转角度（用于 Rotate 工具）
  selectionBounds?: {           // 裁剪选区（用于 Crop 工具）
    x: number;
    y: number;
    width: number;
    height: number;
  };
  appliedEffect: OneClickActionToolType | null;
}>();

// 挂载后的 Canvas 初始化
onMounted(() => {
  initializeCanvas(canvas, ctx);
  if (canvas.value && ctx.value) {
    undoRedoStore.initializeCanvasState(canvas.value, ctx.value);
  } else {
    console.error('Failed to initialize canvas or context');
  }
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
        applyWatermark(canvas, ctx, defaultOptions); // TODO:后续改成不使用默认值
      }
      break;
    case OneClickActionToolType.FaceDetection:
      console.log("Applying Face Detection effect on canvas");
      // 调用人脸检测逻辑
      break;
    default:
      console.warn(`Effect ${effect} is not implemented.`);
      break;
  }
};

// 监听 appliedEffect 的变化
watch(
    () => props.appliedEffect,
    (newEffect, oldEffect) => {
      if (newEffect && newEffect !== oldEffect) {
        applyEffectLogic(newEffect);
      }
    }
);
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
        width="800"
        height="600"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mousemove="handleMouseMove"
    ></canvas>
    <button @click="saveImage(canvas)">Save Image</button>
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