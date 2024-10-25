<script setup lang="ts">
import { ToolType } from '../module/toolType';

const props = defineProps({
  selectedTool: ToolType,  // 接收当前选中的工具
  brushSize: Number,       // 接收画笔大小
  eraserSize: Number       // 接收橡皮擦大小
});
const emit = defineEmits(['update:brushSize', 'update:eraserSize']);

// 动态显示工具属性
const toolProperties = computed(() => {
  switch (props.selectedTool) {
    case ToolType.Brush:
      return `Brush Size: ${props.brushSize}px`;
    case ToolType.Eraser:
      return `Eraser Size: ${props.eraserSize}px`;
    default:
      return 'No specific properties';
  }
});

const updateBrushSize = (event) => {
  emit('update:brushSize', Number((event.target as HTMLInputElement).value));  // 通知父组件更新 brushSize
};
const updateEraserSize = (event) => {
  emit('update:eraserSize', Number((event.target as HTMLInputElement).value));  // 通知父组件更新 eraserSize
};
</script>

<template>
  <div class="property-panel">
    <h3>Properties</h3>
    <p>Selected Tool: {{ selectedTool }}</p>
    <p>{{ toolProperties }}</p>

    <!-- 画笔大小滑动条 -->
    <template v-if="selectedTool === ToolType.Brush">
      <label for="brush-size">Brush Size:</label>
      <input type="range" id="brush-size" min="1" max="50" :value="brushSize" @input="updateBrushSize" />
      <p>Current size: {{ brushSize }}px</p>
    </template>

    <!-- 橡皮擦大小滑动条 -->
    <template v-if="selectedTool === ToolType.Eraser">
      <label for="eraser-size">Eraser Size:</label>
      <input type="range" id="eraser-size" min="1" max="50" :value="eraserSize" @input="updateEraserSize" />
      <p>Current size: {{ eraserSize }}px</p>
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
