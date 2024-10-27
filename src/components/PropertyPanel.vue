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

// 更新对比度
const updateContrast = (event: Event) => {
  const newContrast = Number((event.target as HTMLInputElement).value);
  propertyStore.adjustContrast(newContrast);
};

const updateRotation = (event: Event) => {
  const newRotation = Number((event.target as HTMLInputElement).value);
  propertyStore.adjustRotation(newRotation);
}
const updateCropArea = () => {
  propertyStore.updateCropArea({
    x: propertyStore.cropArea.x,
    y: propertyStore.cropArea.y,
    width: propertyStore.cropArea.width,
    height: propertyStore.cropArea.height,
  });
};
</script>

<template>
  <div class="property-panel">
    <h3>Properties</h3>
    <!-- 参数选择器 -->
    <div class="parameter-selector">
      <button
          v-for="parameter in ['Brush', 'Eraser', 'Brightness', 'Contrast','Crop']"
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
    <!-- 对比度滑动条 -->
    <template v-if="propertyStore.selectedParameter === 'Contrast'">
      <label for="contrast">Contrast:</label>
      <input
          type="range"
          id="contrast"
          min="-100"
          max="100"
          :value="propertyStore.contrast"
          @input="updateContrast"
      />
      <p>Current contrast: {{ propertyStore.contrast }}%</p>
    </template>
    <!-- 旋转角度滑动条 -->
    <template v-if="propertyStore.selectedParameter === 'Rotate'">
      <label for="rotation">Rotation:</label>
      <input
          type="range"
          id="rotation"
          min="-100"
          max="100"
          :value="propertyStore.rotation"
          @input="updateRotation"
      />
      <p>Current rotation: {{ propertyStore.rotation }}</p>
    </template>
    <!-- 裁剪区域选择 -->
    <template v-if="propertyStore.selectedParameter === 'Crop'">
      <label for="crop">Crop:</label>
      <div class="crop-controls">
        <label>
          X:
          <input type="number" v-model.number="propertyStore.cropArea.x" @input="updateCropArea" />
        </label>
        <label>
          Y:
          <input type="number" v-model.number="propertyStore.cropArea.y" @input="updateCropArea" />
        </label>
        <label>
          Width:
          <input type="number" v-model.number="propertyStore.cropArea.width" @input="updateCropArea" />
        </label>
        <label>
          Height:
          <input type="number" v-model.number="propertyStore.cropArea.height" @input="updateCropArea" />
        </label>

      </div>
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
