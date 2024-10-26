<script setup lang="ts">
import { DrawingToolType } from '../module/toolType';

// 接收的 props
const props = defineProps<{
  selectedTool: DrawingToolType;        // 当前选中的工具类型
  brushSize: number;             // 画笔大小，适用于 Brush 工具
  eraserSize: number;            // 橡皮擦大小，适用于 Eraser 工具
  brightness: number;            // 亮度调整，适用于调整亮度的工具
  contrast?: number;             // 对比度调整值（可选，适用于对比度工具）
  saturation?: number;           // 饱和度调整值（可选，适用于饱和度工具）
  exposure?: number;             // 曝光调整值（可选，适用于曝光工具）
  hsl?: {                        // HSL 调整值，包含色相、饱和度、亮度
    hue: number;
    saturation: number;
    lightness: number;
  };
}>();

// 发出事件的 emit 定义
const emit = defineEmits([
  'update:brushSize',
  'update:eraserSize',
  'adjustBrightness',
  'adjustContrast',
  'adjustSaturation',
  'adjustExposure',
  'adjustHSL'
]);


// 计算显示的工具属性
const toolProperties = computed(() => {
  switch (props.selectedTool) {
    case DrawingToolType.Brush:
      return `Brush Size: ${props.brushSize}px`;
    case DrawingToolType.Eraser:
      return `Eraser Size: ${props.eraserSize}px`;
    default:
      return 'No specific properties';
  }
});

// 更新 brushSize
const updateBrushSize = (event: Event) => {
  const newSize = Number((event.target as HTMLInputElement).value);
  emit('update:brushSize', newSize);
};

// 更新 eraserSize
const updateEraserSize = (event: Event) => {
  const newSize = Number((event.target as HTMLInputElement).value);
  emit('update:eraserSize', newSize);
};
</script>

<template>
  <div class="property-panel">
    <h3>Properties</h3>
    <p>Selected Tool: {{ props.selectedTool }}</p>
    <p>{{ toolProperties }}</p>

    <!-- 画笔大小滑动条 -->
    <template v-if="props.selectedTool === DrawingToolType.Brush">
      <label for="brush-size">Brush Size:</label>
      <input
          type="range"
          id="brush-size"
          min="1"
          max="50"
          :value="props.brushSize"
          @input="updateBrushSize"
      />
      <p>Current size: {{ props.brushSize }}px</p>
    </template>

    <!-- 橡皮擦大小滑动条 -->
    <template v-if="props.selectedTool === DrawingToolType.Eraser">
      <label for="eraser-size">Eraser Size:</label>
      <input
          type="range"
          id="eraser-size"
          min="1"
          max="50"
          :value="props.eraserSize"
          @input="updateEraserSize"
      />
      <p>Current size: {{ props.eraserSize }}px</p>
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
