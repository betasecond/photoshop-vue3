<script setup lang="ts">
import {AdjustmentToolType, DrawingToolType, EditToolType, OneClickActionToolType} from '../types/toolType';
import {useUndoRedoStore} from "../store/undoRedoStore";
import {adjustBrightness} from '../module/brightnessAdjust'; // 引入亮度调节逻辑

// 定义接收的 props
const props = defineProps<{
  selectedTool: DrawingToolType;      // 当前选中的工具类型
  selectedColor: string;       // 当前选中的颜色
  appliedEffect: OneClickActionToolType;
}>();

// 定义 emit 事件
const emit = defineEmits([
  'selectTool',               // 工具选择
  'updateColor',              // 颜色更新
  'adjustBrightness',         // 亮度调整
  'adjustContrast',           // 对比度调整
  'adjustSaturation',         // 饱和度调整
  'applyEffect',               // 一键式效果应用
  'applyAdjust',              // 调整
  'applyEditTool',          // 编辑工具
]);


// 工具选择逻辑
const selectTool = (tool: DrawingToolType) => {
  emit('selectTool', tool);
};
const applyEffect = (tool: OneClickActionToolType) => {
  emit('applyEffect', tool);
}
const applyAdjust = (tool: AdjustmentToolType) => {
  emit('applyAdjust', tool);
}
const applyEditTool = (tool: EditToolType) => {
  emit('applyEditTool', tool);
}


// 颜色更新逻辑
const updateColor = (event: Event) => {
  const newColor = (event.target as HTMLInputElement).value;
  emit('updateColor', newColor);
};

// 撤销和重做相关逻辑
const store = useUndoRedoStore();
const undo = () => store.undo();
const redo = () => store.redo();
const canUndo = computed(() => store.undoStack.length > 0);
const canRedo = computed(() => store.redoStack.length > 0);

// 亮度调节逻辑
const brightness = ref(0);
const emitBrightness = () => emit('adjustBrightness', brightness.value);
</script>
<template>
  <div class="toolbar">
    <button @click="selectTool(DrawingToolType.Brush)" :class="{ active: selectedTool === DrawingToolType.Brush }">Brush</button>
    <button @click="selectTool(DrawingToolType.Eraser)" :class="{ active: selectedTool === DrawingToolType.Eraser }">Eraser</button>
    <button @click="applyEffect(OneClickActionToolType.Watermark)" >Watermark</button>
    <button @click="applyAdjust(AdjustmentToolType.Contrast)" >Contrast</button>
    <button @click="applyAdjust(AdjustmentToolType.Exposure)" >Exposure</button>
    <button @click="applyAdjust(AdjustmentToolType.Saturation)" >Saturation</button>
    <button @click="applyAdjust(AdjustmentToolType.HSL)" >HSL</button>
    <button @click="applyAdjust(AdjustmentToolType.Brightness)" >Bright</button>
    <button @click="applyAdjust(AdjustmentToolType.Sharpen)" >Sharpen</button>
    <button @click="applyAdjust(AdjustmentToolType.HistogramEqualization)" >HE</button>
    <button @click="applyAdjust(AdjustmentToolType.Smoothing)" >Smooth</button>
    <button @click="applyEditTool(EditToolType.Rotate)">Rotate</button>
    <button @click="applyEditTool(EditToolType.Crop)">Crop</button>
    <label for="colorPicker">Color:</label>
    <input type="color" id="colorPicker" :value="selectedColor" @input="updateColor" />

    <!-- 撤销和重做按钮 -->
    <button @click="undo" :disabled="!canUndo">Undo</button>
    <button @click="redo" :disabled="!canRedo">Redo</button>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  padding: 10px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

button {
  margin-right: 10px;
  padding: 5px 10px;
  cursor: pointer;
}

button.active {
  background-color: #007bff;
  color: white;
}

input[type="color"] {
  margin-left: 10px;
}
</style>
