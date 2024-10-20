<script setup lang="ts">
import {watch, ref, onMounted, reactive, nextTick} from 'vue';
import {
  initializeCanvas,
  loadImage,
  saveImage,
  startDrawing,
  stopDrawing,
  draw,
  ToolType,
  adjustBrightness
} from './canvasDrawing';
import {useUndoRedoStore} from "../store/undoRedoStore";

const undoRedoStore = useUndoRedoStore();
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
let isDrawing = false;





const props = defineProps({
  selectedTool: ToolType,  // 接收父组件传递的选中工具
  selectedColor: String,  // 接收当前的画笔颜色
  brushSize: Number,       // 接收当前的画笔大小
  brightness: Number,    // 接收父组件传递的亮度值
  eraserSize: Number      // 接收当前的橡皮擦大小

});
// 初始化 Canvas
onMounted(() => {
  // debug
  console.log('onMounted triggered');
  initializeCanvas(canvas, ctx);
  console.log('Canvas ref:', canvas.value);
  console.log('Context ref:', ctx.value);



  if (canvas.value && ctx.value) {
    console.log('Canvas and context are ready in onMounted.');
    undoRedoStore.initializeCanvasState(canvas.value, ctx.value);  // 直接在 onMounted 中传递
  } else {
    console.error('Canvas or context are undefined in onMounted.');
  }
});
// 监听亮度值变化
watch(() => props.brightness, (newBrightness) => {
  if (newBrightness !== 0) {
    adjustBrightness(canvas, ctx, newBrightness);
  }
});

// 观察 canvas 和 ctx 是否已经初始化
// watch([canvas, ctx], async ([newCanvas, newCtx], [oldCanvas, oldCtx]) => {
//   if (newCanvas && newCtx) {
//     // debug
//     console.log('Canvas and context are now initialized and ready.');
//     console.log('Canvas value:', newCanvas); // 检查传入的 canvas
//     console.log('Context value:', newCtx);   // 检查传入的 ctx
//     //  因为看不懂异步，只能nextTick堆屎山近似成同步
//     await nextTick();
//
//     const canvasValue = newCanvas?.value;
//     const ctxValue = newCtx?.value;
//
//     console.log('Extracted canvas value:', canvasValue);
//     console.log('Extracted context value:', ctxValue);
//     if (canvasValue && ctxValue) {
//       undoRedoStore.initializeCanvasState(canvasValue, ctxValue);  // 确保传递的是解包后的值
//     } else {
//       console.error('Unable to pass canvas or context as values are undefined after nextTick.');
//     }
//   }
//
//
// });

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