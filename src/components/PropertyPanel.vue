<script setup lang="ts">
import { DrawingToolType } from '../module/toolType';
import {usePropertyStore} from "../store/propertyStore";
const propertyStore = usePropertyStore();

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

// 更新 selectedParameter
const setParameter = (parameter: string) => {
  propertyStore.setSelectedParameter(parameter);
};
</script>

<template>
  <div class="property-panel">
    <h3>Properties</h3>
    <!-- 改进后的参数选择器 -->
    <div class="parameter-selector">
      <button
          v-for="parameter in ['Brush', 'Eraser', 'Brightness']"
          :key="parameter"
          :class="{ active: propertyStore.selectedParameter === parameter }"
          @click="setParameter(parameter)"
      >
        {{ parameter }}
      </button>
    </div>
    <!-- 画笔大小滑动条 -->
    <template v-if="propertyStore.selectedParameter === 'Brush'">
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
    <template v-if="propertyStore.selectedParameter === 'Eraser'">
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
    <!-- 亮度滑动条 -->
    <template v-if="propertyStore.selectedParameter === 'Brightness'">
      <label for="brightness">Brightness:</label>
      <input
          type="range"
          id="brightness"
          min="0"
          max="100"
          :value="propertyStore.brightness"
          @input="event => propertyStore.adjustBrightness(Number(event.target.value))"
      />
      <p>Current brightness: {{ propertyStore.brightness }}%</p>
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
