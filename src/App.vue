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

    <var-paper  :elevation="2"     :width="'100%'" :height="'100%'" ripple  >

  <div id="app">
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

    <div class="main-container">
      <parameter-selector/>
      <CanvasArea
          :selectedTool="propertyStore.selectedTool"
          :selectedColor="propertyStore.selectedColor"
          :brushSize="propertyStore.brushSize"
          :eraserSize="propertyStore.eraserSize"
          :brightness="propertyStore.brightness"
          :varletStyle="propertyStore.selectVarletStyle"
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
          :lightX="propertyStore.lightX"
          :lightY="propertyStore.lightY"
          :lightStrength="propertyStore.lightStrength"
          @startDrawing="handleStartDrawing"
          @draw="handleDraw"
          @stopDrawing="handleStopDrawing"
          @selectArea="handleSelectArea"
          @rotate="handleRotate"
          />

      <PropertyPanel/>
    </div>
  </div>
    </var-paper>
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

}

button {
  cursor: pointer;
}
</style>
