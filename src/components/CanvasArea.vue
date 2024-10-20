<script setup lang="ts">
import {watch, ref, onMounted, reactive} from 'vue';
import {initializeCanvas, loadImage, saveImage, startDrawing, stopDrawing, draw, ToolType} from './canvasDrawing';


const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
let isDrawing = false;






const props = defineProps({
  selectedTool: String,  // 接收父组件传递的选中工具
  selectedColor: String,  // 接收当前的画笔颜色
  brushSize: Number,       // 接收当前的画笔大小

  eraserSize: Number      // 接收当前的橡皮擦大小
});
// 初始化 Canvas
onMounted(() => {
  // debug
  console.log('onMounted triggered');
  initializeCanvas(canvas, ctx);
  console.log('Canvas ref:', canvas.value);
  console.log('Context ref:', ctx.value);
});


// 观察 canvas 是否已经初始化
watch(canvas, (newCanvas, oldCanvas) => {
  if (newCanvas) {
    console.log('Canvas is now initialized and ready.');
  } else {
    console.log('Canvas is not yet initialized.');
  }
});


// 处理图片加载
// 由于vue的dom和ref是异步处理，需要套一层，避免直接在模板中操作 ref
const handleImageLoad = (event: Event) => {
  if (!canvas.value) {
    console.log('Canvas is not ready yet.');
    return;
  }
  loadImage(event, canvas, ctx);  // 传入 canvas 和 context
};

// 保存图片
const saveImage = () => {
  const dataURL = canvas.value.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'image.png';
  link.click(); // 自动触发下载
};




// 开始绘制
const handleMouseDown = (event: MouseEvent) => {
  isDrawing = startDrawing(props.selectedTool, isDrawing);
};



// 停止绘制
const handleMouseUp = () => {
  stopDrawing(ctx);
  isDrawing = false;
};


// 绘制事件
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