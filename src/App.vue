<script setup lang="ts">
import ToolBar from './components/ToolBar.vue';
import CanvasArea from './components/CanvasArea.vue';
import PropertyPanel from './components/PropertyPanel.vue';
import { DrawingToolType } from './module/toolType'; // 引入 ToolType 枚举

// 共享状态：选中的工具和颜色
const selectedTool = ref<DrawingToolType>(DrawingToolType.Brush);  // 默认选中画笔，使用枚举类型
const selectedColor = ref('#000000');  // 默认颜色为黑色
const brushSize = ref(10);  // 默认画笔大小
const eraserSize = ref(10);  // 默认橡皮擦大小
const brightness = ref(0);  // 亮度值
// 处理绘图信号
const handleStartDrawing = (toolType: DrawingToolType, startPosition: { x: number; y: number }) => {
  console.log(`Start drawing with ${toolType} at`, startPosition);
};

const handleDraw = (currentPosition: { x: number; y: number }, attributes: { color: string; size: number }) => {
  console.log(`Drawing at ${currentPosition} with attributes`, attributes);
};

const handleStopDrawing = (endPosition: { x: number; y: number }) => {
  console.log(`Stop drawing at`, endPosition);
};

// 处理选择工具信号
const handleSelectArea = (selectionBounds: { x: number; y: number; width: number; height: number }) => {
  console.log('Selected area:', selectionBounds);
};

const handleRotate = (rotationAngle: number) => {
  console.log(`Rotate image by ${rotationAngle} degrees`);
};

// 处理参数调整信号
const handleAdjustParameter = (parameterType: string, value: number) => {
  console.log(`Adjust ${parameterType} to ${value}`);
};

// 处理一键式效果信号
const handleApplyEffect = (effectType: string) => {
  console.log(`Apply effect: ${effectType}`);
};

// 工具选择处理
const handleSelectTool = (tool: DrawingToolType) => {
  selectedTool.value = tool;
  console.log(`Current tool: ${selectedTool.value}`);
};

// 颜色更新处理
const updateColor = (color: string) => {
  selectedColor.value = color;
  console.log(`Selected color: ${selectedColor.value}`);
};

// 画笔和橡皮擦大小更新
const updateBrushSize = (newSize: number) => {
  brushSize.value = newSize;
  console.log(`Updated brush size: ${brushSize.value}`);
};

const updateEraserSize = (newSize: number) => {
  eraserSize.value = newSize;
  console.log(`Updated eraser size: ${eraserSize.value}`);
};

// 亮度调节处理
const handleAdjustBrightness = (brightnessValue: number) => {
  brightness.value = brightnessValue;
  console.log(`Brightness value received in parent: ${brightnessValue}`);
};
</script>

<template>
  <div id="app">
    <ToolBar
        :selectedTool="selectedTool"
        :selectedColor="selectedColor"
        @selectTool="handleSelectTool"
        @updateColor="updateColor"
        @adjustBrightness="handleAdjustBrightness"
        @applyEffect="handleApplyEffect"
    />

    <div class="main-container">
      <CanvasArea
          :selectedTool="selectedTool"
          :selectedColor="selectedColor"
          :brushSize="brushSize"
          :eraserSize="eraserSize"
          :brightness="brightness"
          @startDrawing="handleStartDrawing"
          @draw="handleDraw"
          @stopDrawing="handleStopDrawing"
          @selectArea="handleSelectArea"
          @rotate="handleRotate"
      />

      <PropertyPanel
          :selectedTool="selectedTool"
          :brushSize="brushSize"
          :eraserSize="eraserSize"
          @update:brushSize="updateBrushSize"
          @update:eraserSize="updateEraserSize"
          @adjustParameter="handleAdjustParameter"
       brightness=""/>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main-container {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 60px); /* 自动填满屏幕高度 */
  overflow: hidden;
}

/* 确保 canvas 和图层管理同时显示 */
canvas {
  border: 1px solid #ccc;
  background-color: white;
}

button {
  cursor: pointer;
}
</style>
