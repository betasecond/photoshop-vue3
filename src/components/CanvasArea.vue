<script setup lang="ts">
import { ref, onMounted } from 'vue';


const canvas = ref(null);
const ctx = ref(null);
const selectedColor = ref('#000000');  // 默认画笔颜色为黑色
let isDrawing = false;

const props = defineProps({
  selectedTool: String,  // 接收父组件传递的选中工具
  selectedColor: String,  // 接收当前的画笔颜色
  brushSize: Number,       // 接收当前的画笔大小

  eraserSize: Number      // 接收当前的橡皮擦大小
});
// 初始化 Canvas
onMounted(() => {
  ctx.value = canvas.value.getContext('2d');
  console.log('Canvas initialized');  // 初始化日志
  ctx.value.fillStyle = '#ffffff';
  ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
});



// 读取图片
const loadImage = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height); // 清空画布
      ctx.value.drawImage(img, 0, 0, canvas.value.width, canvas.value.height); // 绘制图片到画布
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
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
const startDrawing = (event) => {
  if (props.selectedTool === 'brush' || props.selectedTool === 'eraser') {
    isDrawing = true;
    console.log(`Start drawing with tool: ${props.selectedTool}`);
  }
};

// 停止绘制
const stopDrawing = () => {
  isDrawing = false;
  ctx.value.beginPath();  // 结束当前路径
};



// 根据工具绘制
const draw = (event) => {
  if (!isDrawing) return;

  const rect = canvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (props.selectedTool === 'brush') {
    ctx.value.lineWidth = props.brushSize;  // 设置画笔大小
    ctx.value.lineCap = 'round';
    ctx.value.strokeStyle = props.selectedColor;  // 设置画笔颜色

    ctx.value.lineTo(x, y);
    ctx.value.stroke();
    ctx.value.beginPath();
    ctx.value.moveTo(x, y);
    console.log(`Drawing at (${x}, ${y}) with brush size ${props.brushSize} and color ${props.selectedColor}`);
  } else if (props.selectedTool === 'eraser') {
    ctx.value.clearRect(x - props.eraserSize / 2, y - props.eraserSize / 2, props.eraserSize, props.eraserSize);  // 使用橡皮擦大小
    console.log(`Erasing at (${x}, ${y})`);
  }
};







</script>

<template>
  <div class="canvas-container">
    <input type="file" accept="image/*" @change="loadImage" />
    <canvas
        ref="canvas"
        width="800"
        height="600"
        @mousedown="startDrawing"
        @mouseup="stopDrawing"
        @mousemove="draw"
    ></canvas>
    <button @click="saveImage">Save Image</button>
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