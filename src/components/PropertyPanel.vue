<script setup lang="ts">
import { DrawingToolType } from '../module/toolType';
import {usePropertyStore} from "../store/propertyStore";
const propertyStore = usePropertyStore();




// 工具属性的计算
const toolProperties = computed(() => {
  switch (propertyStore.selectedTool) {
    case 'Brush':
      return `Brush Size: ${propertyStore.brushSize}px`;
    case 'Eraser':
      return `Eraser Size: ${propertyStore.eraserSize}px`;
    default:
      return 'No specific properties';
  }
});

// 更新 brushSize
const updateBrushSize = (event: Event) => {
  const newSize = Number((event.target as HTMLInputElement).value);
  propertyStore.updateBrushSize(newSize);
};

// 更新 eraserSize
const updateEraserSize = (event: Event) => {
  const newSize = Number((event.target as HTMLInputElement).value);
  propertyStore.updateEraserSize(newSize);
};
</script>

<template>
  <div class="property-panel">
    <h3>Properties</h3>
    <p>Selected Tool: {{ propertyStore.selectedTool }}</p>
    <p>{{ toolProperties }}</p>

    <!-- 画笔大小滑动条 -->
    <template v-if="propertyStore.selectedTool === DrawingToolType.Brush">
      <label for="brush-size">Brush Size:</label>
      <input
          type="range"
          id="brush-size"
          min="1"
          max="50"
          :value="propertyStore.brushSize"
          @input="updateBrushSize"
      />
      <p>Current size: {{ propertyStore.brushSize }}px</p>
    </template>

    <!-- 橡皮擦大小滑动条 -->
    <template v-if="propertyStore.selectedTool === DrawingToolType.Eraser">
      <label for="eraser-size">Eraser Size:</label>
      <input
          type="range"
          id="eraser-size"
          min="1"
          max="50"
          :value="propertyStore.eraserSize"
          @input="updateEraserSize"
      />
      <p>Current size: {{ propertyStore.eraserSize }}px</p>
    </template>
  </div>
</template>

<style scoped>
.property-panel {
  width: 200px;
  padding: 10px;
  background-color: #f9f9f9;
  border-left: 1px solid #ccc;
}
</style>
