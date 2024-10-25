<script setup lang="ts">
import { initializeCanvas } from '../module/canvasInitialize';
import { loadImage } from "../module/imageLoad";
import { saveImage } from "../module/imageSave";
import { startDrawing, stopDrawing, draw } from "../module/drawing";
import { ToolType } from "../module/toolType";
import { adjustBrightness } from "../module/brightnessAdjust";
import { useUndoRedoStore } from "../store/undoRedoStore";


// 引入并初始化状态管理
const undoRedoStore = useUndoRedoStore();

// 引用和状态
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
let isDrawing = false;

// 属性定义
const props = defineProps({
  selectedTool: ToolType,
  selectedColor: String,
  brushSize: Number,
  brightness: Number,
  eraserSize: Number
});

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