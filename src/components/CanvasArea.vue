<script setup lang="ts">
import {watch, ref, onMounted, reactive, nextTick} from 'vue';
import {initializeCanvas, loadImage, saveImage, startDrawing, stopDrawing, draw, cropCanvas,ToolType} from './canvasDrawing';
import {useUndoRedoStore} from "../store/undoRedoStore";
import * as events from "node:events";

const undoRedoStore = useUndoRedoStore();
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
let isDrawing = false;

// 裁剪
let isCropping = false;  // 标志是否正在裁剪
const cropStart = reactive({ x: 0, y: 0 });  // 裁剪起始位置
const cropEnd = reactive({ x: 0, y: 0 });    // 裁剪结束位置





const props = defineProps({
  selectedTool: ToolType,  // 接收父组件传递的选中工具
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



  if (canvas.value && ctx.value) {
    console.log('Canvas and context are ready in onMounted.');
    undoRedoStore.initializeCanvasState(canvas.value, ctx.value);  // 直接在 onMounted 中传递
  } else {
    console.error('Canvas or context are undefined in onMounted.');
  }
});


// 开始裁剪
const startCrop = (event: MouseEvent) => {
  if (props.selectedTool === ToolType.Crop) {
    isCropping = true;
    const rect = canvas.value!.getBoundingClientRect();
    cropStart.x = event.clientX - rect.left;
    cropStart.y = event.clientY - rect.top;
  }
};

// 绘制裁剪区域 目前裁剪会清除所有绘制 需要考虑
const drawCropArea = (event: MouseEvent) => {
  if (!isCropping || !ctx.value) return;
  const rect = canvas.value!.getBoundingClientRect();
  cropEnd.x = event.clientX - rect.left;
  cropEnd.y = event.clientY - rect.top;

  // 清空之前绘制的裁剪框
  ctx.value.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
  undoRedoStore.undoStack.length > 0 && ctx.value.putImageData(undoRedoStore.undoStack[undoRedoStore.undoStack.length - 1].imageData, 0, 0); // 恢复上一次状态

  // 绘制裁剪区域
  ctx.value.strokeStyle = '#ff0000';
  ctx.value.lineWidth = 1;
  ctx.value.strokeRect(cropStart.x, cropStart.y, cropEnd.x - cropStart.x, cropEnd.y - cropStart.y);
};

// 完成裁剪
const endCrop = () => {
  if (!isCropping) return;
  isCropping = false;

  // 计算裁剪区域的宽高
  const cropWidth = Math.abs(cropEnd.x - cropStart.x);
  const cropHeight = Math.abs(cropEnd.y - cropStart.y);

  // 确定左上角坐标
  const x = Math.min(cropStart.x, cropEnd.x);
  const y = Math.min(cropStart.y, cropEnd.y);

  // 调用裁剪函数
  cropCanvas(canvas, ctx, { x, y, width: cropWidth, height: cropHeight });
};

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
  if(props.selectedTool === ToolType.Crop) {
    startCrop(event)
  }else {
    isDrawing = startDrawing(props.selectedTool, isDrawing);
  }

};



// 停止绘制
const handleMouseUp = () => {
  if(props.selectedTool === ToolType.Crop) {
    endCrop()
  }else{
    stopDrawing(ctx);
    isDrawing = false;
  }




};


// 绘制事件
const handleMouseMove = (event: MouseEvent) => {
  if (props.selectedTool === ToolType.Crop && isCropping) {
    // 如果是裁剪状态，绘制裁剪框
    drawCropArea(event);
     } else{
    draw(event, canvas, ctx, props.selectedTool, {
      color: props.selectedColor,
      brushSize: props.brushSize,
      eraserSize: props.eraserSize
    }, isDrawing);
  }

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