<script setup lang="ts">
import {onMounted, ref} from 'vue';
import ToolBar from './components/ToolBar.vue';
import CanvasArea from './components/CanvasArea.vue';
import PropertyPanel from './components/PropertyPanel.vue';
import vue from "@vitejs/plugin-vue";



// 共享状态：选中的工具和颜色
const selectedTool = ref('brush');  // 默认选中画笔
const selectedColor = ref('#000000');  // 默认颜色为黑色
const brushSize = ref(10);  // 默认画笔大小
const eraserSize = ref(10);  // 默认橡皮擦大小


// 工具栏选择工具的处理函数
const handleSelectTool = (tool) => {
  selectedTool.value = tool;
  console.log(`Current tool: ${selectedTool.value}`);
};

// 更新颜色
const updateColor = (color) => {
  selectedColor.value = color;
  console.log(`Selected color: ${selectedColor.value}`);
};

// 更新画笔大小
const updateBrushSize = (newSize) => {
  brushSize.value = newSize;
  console.log(`Updated brush size: ${brushSize.value}`);
};

// 更新橡皮擦大小
const updateEraserSize = (newSize) => {
  eraserSize.value = newSize;
  console.log(`Updated eraser size: ${eraserSize.value}`);
};


</script>

<template>
  <div id="app">
    <!-- 工具栏 -->
    <ToolBar :selectedTool="selectedTool" :selectedColor="selectedColor"
             @selectTool="handleSelectTool" @updateColor="updateColor" />

    <div class="main-container">
      <!-- 图层面板 -->

      <!-- 画布区域 -->
      <CanvasArea :selectedTool="selectedTool"
                  :selectedColor="selectedColor"
                  :brushSize="brushSize"
                  :eraserSize="eraserSize" />

      <!-- 属性面板 -->
      <PropertyPanel :selectedTool="selectedTool"
                     :brushSize="brushSize"
                     :eraserSize="eraserSize"
                     @update:brushSize="updateBrushSize"
                     @update:eraserSize="updateEraserSize" />
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
