<script setup lang="ts">
import ToolBar from './components/ToolBar.vue';
import CanvasArea from './components/CanvasArea.vue';
import PropertyPanel from './components/PropertyPanel.vue';
import { usePropertyStore } from './store/propertyStore';
import { DrawingToolType,OneClickActionToolType } from './module/toolType'; // 引入 ToolType 枚举
const propertyStore = usePropertyStore();

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



// 工具选择处理
const handleSelectTool = (tool: DrawingToolType) => {
  propertyStore.updateTool(tool);
  console.log(`Current tool: ${propertyStore.selectedTool}`);
};

// 颜色更新处理
const updateColor = (color: string) => {
  propertyStore.updateColor(color);
  console.log(`Selected color: ${propertyStore.selectedColor}`);
};

// 画笔和橡皮擦大小更新
const updateBrushSize = (newSize: number) => {
  propertyStore.updateBrushSize(newSize);
  console.log(`Updated brush size: ${propertyStore.brushSize}`);
};

const updateEraserSize = (newSize: number) => {
  propertyStore.updateEraserSize(newSize);
  console.log(`Updated eraser size: ${propertyStore.eraserSize}`);
};

// 亮度调节处理
const handleAdjustBrightness = (brightnessValue: number) => {
  propertyStore.adjustBrightness(brightnessValue);
  console.log(`Brightness value received in parent: ${propertyStore.brightnessValue}`);
};

// 一键式效果处理
const handleApplyEffect = (effect: OneClickActionToolType) => {
  propertyStore.applyEffect(effect);
  console.log(`Applying one-click effect: ${propertyStore.effect}`);
};
</script>

<template>
  <div id="app">
    <ToolBar
        :selectedTool="propertyStore.selectedTool"
        :selectedColor="propertyStore.selectedColor"
        :appliedEffect="propertyStore.appliedEffect"
        @selectTool="handleSelectTool"
        @updateColor="updateColor"
        @adjustBrightness="handleAdjustBrightness"
        @applyEffect="handleApplyEffect"
    />

    <div class="main-container">
      <CanvasArea
          :selectedTool="propertyStore.selectedTool"
          :selectedColor="propertyStore.selectedColor"
          :brushSize="propertyStore.brushSize"
          :eraserSize="propertyStore.eraserSize"
          :brightness="propertyStore.brightness"
          :appliedEffect="propertyStore.appliedEffect"
          @startDrawing="handleStartDrawing"
          @draw="handleDraw"
          @stopDrawing="handleStopDrawing"
          @selectArea="handleSelectArea"
          @rotate="handleRotate"
      />

      <PropertyPanel/>
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
