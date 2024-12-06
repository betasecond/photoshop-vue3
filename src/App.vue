<script setup lang="ts">
import ToolBar from './components/ToolBar.vue';
import CanvasArea from './components/CanvasArea.vue';
import PropertyPanel from './components/PropertyPanel.vue';
import { usePropertyStore } from './store/propertyStore';
import {AdjustmentToolType, DrawingToolType, EditToolType, OneClickActionToolType} from './types/toolType';
import {WatermarkOptions} from "./types/watermarkType";
import ParameterSelector from "./components/ParameterSelector.vue"; // 引入 ToolType 枚举
const propertyStore = usePropertyStore();
// 新增：对比度调整处理
const handleAdjustContrast = (contrastValue: number) => {
  propertyStore.adjustContrast(contrastValue);
  console.log(`Contrast value received in parent: ${propertyStore.contrast}`);
};
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
// 处理水印
const handleUpdateWatermarkOption = (newWatermarkOptions:WatermarkOptions) =>{
  propertyStore.adjustWatermarkOption(newWatermarkOptions);
  console.log(`Update watermark options: ${propertyStore.watermarkOptions}`);
}
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

// 参数调整工具处理
const handleApplyAdjust = (adjust:AdjustmentToolType)=>{
  propertyStore.applyAdjustment(adjust);
  console.log(`Adjusting adjust: ${adjust}`);
}

// 编辑工具处理
const handleApplyEditTool = (editTool:EditToolType)=>{
  propertyStore.applyEditTool(editTool);
  console.log(`Edit tool: ${editTool}`);
}


</script>

<template>
  <div id="app">


    <div class="main-container">
<!--      <parameter-selector/>-->
      <CanvasArea
          :selectedTool="propertyStore.selectedTool"
          :selectedColor="propertyStore.selectedColor"
          :brushSize="propertyStore.brushSize"
          :eraserSize="propertyStore.eraserSize"
          :brightness="propertyStore.brightness"
          :appliedEffect="propertyStore.appliedEffect"
          :appliedAdjustment="propertyStore.appliedAdjustment"
          :appliedEditTool="propertyStore.appliedEditTool"
          :contrast="propertyStore.contrast"
          :saturation="propertyStore.saturation"
          :exposure="propertyStore.exposure"
          :rotation="propertyStore.rotation"
          :selectionBounds="propertyStore.cropArea"
          :watermark-options="propertyStore.watermarkOption"
          :hsl="propertyStore.hsl"
          :dehazeStrength="propertyStore.dehazeStrength"
          :intensity="propertyStore.intensity"
          :colorTemperature="propertyStore.colorTemperature"
          :curveAdjustmentState="propertyStore.curveAdjustment"
          :channel="propertyStore.selectedChannel"
          :smoothRadius="propertyStore.smoothingRadius"
          :toneMappingConfig="propertyStore.toneMappingConfig"
          @startDrawing="handleStartDrawing"
          @draw="handleDraw"
          @stopDrawing="handleStopDrawing"
          @selectArea="handleSelectArea"
          @rotate="handleRotate"
          />

<!--      <PropertyPanel/>-->
    </div>
    <ToolBar
        :selectedTool="propertyStore.selectedTool"
        :selectedColor="propertyStore.selectedColor"
        :appliedEffect="propertyStore.appliedEffect"
        @selectTool="handleSelectTool"
        @updateColor="updateColor"
        @adjustBrightness="handleAdjustBrightness"
        @applyEffect="handleApplyEffect"
        @applyAdjust="handleApplyAdjust"
        @applyEditTool="handleApplyEditTool"
    />
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
  flex-direction: column;
  height: calc(100vh - 60px); /* 自动填满屏幕高度 */
  overflow: hidden;
}

canvas {
  border: 1px solid #ccc;
  background-color: white;
  width: 100%; /* 让画布适应可用宽度 */
  height: 100%; /* 高度自动调整 */
}

button {
  cursor: pointer;
}

/* 响应式设计 - 针对手机屏幕进行调整 */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column; /* 在手机上垂直排列 */
    height: auto; /* 在移动端上自动调整高度 */
  }

  /* 使工具栏、画布区域和属性面板在手机上更加紧凑 */
  ToolBar, CanvasArea, PropertyPanel {
    width: 100%; /* 让每个组件占满屏幕宽度 */
    margin-bottom: 10px; /* 各组件之间添加间距 */
  }

  /* 在手机上压缩和调整 ToolBar 的大小 */
  ToolBar {
    padding: 10px;
    font-size: 14px; /* 缩小字体 */
  }

  /* 在手机上压缩画布区域 */
  CanvasArea {
    height: 300px; /* 画布的高度可以适当缩小 */
  }

  /* PropertyPanel 调整大小 */
  PropertyPanel {
    padding: 10px;
    font-size: 14px; /* 缩小字体 */
    display: none; /* 可选：在手机上隐藏属性面板，节省空间 */
  }
}

/* 更小屏幕（如手机竖屏）上的进一步调整 */
@media (max-width: 480px) {
  /* 进一步压缩工具栏 */
  ToolBar {
    font-size: 12px;
    padding: 8px;
  }

  /* 画布区域高度适配小屏幕 */
  CanvasArea {
    height: 250px; /* 更小的画布区域 */
  }

  /* 小屏幕上隐藏属性面板，或者将其放到滚动区域 */
  PropertyPanel {
    display: none;
  }
}

</style>
