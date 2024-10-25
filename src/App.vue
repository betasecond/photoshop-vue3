<script setup lang="ts">
import ToolBar from './components/ToolBar.vue';
import CanvasArea from './components/CanvasArea.vue';
import PropertyPanel from './components/PropertyPanel.vue';
import { ToolType } from './components/canvasDrawing'; // 引入 ToolType 枚举

// 共享状态：选中的工具和颜色
const selectedTool = ref<ToolType>(ToolType.Brush);  // 默认选中画笔，使用枚举类型
const selectedColor = ref('#000000');  // 默认颜色为黑色
const brushSize = ref(10);  // 默认画笔大小
const eraserSize = ref(10);  // 默认橡皮擦大小
const brightness = ref(0);  // 亮度值
// 工具栏选择工具的处理函数
const handleSelectTool = (tool: ToolType) => {
  selectedTool.value = tool;
  console.log(`Current tool: ${selectedTool.value}`);
};

// 更新颜色
const updateColor = (color: string) => {
  selectedColor.value = color;
  console.log(`Selected color: ${selectedColor.value}`);
};

// 更新画笔大小
const updateBrushSize = (newSize: number) => {
  brushSize.value = newSize;
  console.log(`Updated brush size: ${brushSize.value}`);
};

// 更新橡皮擦大小
const updateEraserSize = (newSize: number) => {
  eraserSize.value = newSize;
  console.log(`Updated eraser size: ${eraserSize.value}`);
};

// 处理亮度调节
const handleAdjustBrightness = (brightnessValue) => {
  brightness.value = brightnessValue;
  console.log(`Brightness value received in parent: ${brightnessValue}`);
  // 将亮度调节值传递给 CanvasArea 进行处理

};
</script>

<template>
  <div id="app">
    <!-- 工具栏 -->
    <ToolBar
        :selectedTool="selectedTool"
        :selectedColor="selectedColor"
        @selectTool="handleSelectTool"
        @updateColor="updateColor"
        @adjustBrightness="handleAdjustBrightness"

    />

    <div class="main-container">
      <!-- 画布区域 -->
      <CanvasArea
          :selectedTool="selectedTool"
          :selectedColor="selectedColor"
          :brushSize="brushSize"
          :eraserSize="eraserSize"
          :brightness="brightness"
      />

      <!-- 属性面板 -->
      <PropertyPanel
          :selectedTool="selectedTool"
          :brushSize="brushSize"
          :eraserSize="eraserSize"
          @update:brushSize="updateBrushSize"
          @update:eraserSize="updateEraserSize"
      />
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
