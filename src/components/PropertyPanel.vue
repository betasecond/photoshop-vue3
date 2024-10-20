<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  selectedTool: String,  // 接收当前选中的工具
  brushSize: Number,  // 接收画笔大小
  eraserSize: Number     // 接收橡皮擦大小
});
const emit = defineEmits(['update:brushSize', 'update:eraserSize']);
// 动态显示工具属性
const toolProperties = computed(() => {
  if (props.selectedTool === 'brush') {
    return `Brush Size: ${props.brushSize}px`;
  } else if (props.selectedTool === 'eraser') {
    return `Eraser Size: ${props.eraserSize}px`;
  } else {
    return 'No specific properties';
  }
});

const updateBrushSize = (event) => {
  // 通知父组件更新 brushSize
  emit('update:brushSize', event.target.value);
};
const updateEraserSize = (event) => {
  // 通知父组件更新 eraseSize
  emit('update:eraserSize', event.target.value);
};
</script>

<template>
  <div class="property-panel">
    <h3>Properties</h3>
    <p>Selected Tool: {{ selectedTool }}</p>
    <p>{{ toolProperties }}</p>
    <!-- 画笔大小滑动条 -->
    <label v-if="selectedTool === 'brush'" for="brush-size">Brush Size:</label>
    <input v-if="selectedTool === 'brush'" type="range" id="brush-size" min="1" max="50" :value="brushSize" @input="updateBrushSize" />
    <p v-if="selectedTool === 'brush'">Current size: {{ brushSize }}px</p>
    <!-- 橡皮擦大小滑动条 -->
    <label v-if="selectedTool === 'eraser'" for="eraser-size">Eraser Size:</label>
    <input v-if="selectedTool === 'eraser'" type="range" id="eraser-size" min="1" max="50" :value="eraserSize" @input="updateEraserSize" />
    <p v-if="selectedTool === 'eraser'">Current size: {{ eraserSize }}px</p>
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
