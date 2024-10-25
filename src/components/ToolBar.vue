<script setup lang="ts">
import { ToolType } from '../module/toolType';
import {useUndoRedoStore} from "../store/undoRedoStore";
import { adjustBrightness } from '../module/brightnessAdjust';  // 引入亮度调节逻辑

// 定义接收的 props
const props = defineProps<{
  selectedTool: ToolType,
  selectedColor: string
}>();

// 定义 emit 事件
const emit = defineEmits(['selectTool', 'updateColor', 'adjustBrightness']);

// 工具选择逻辑
const selectTool = (tool: ToolType) => {
  emit('selectTool', tool);
};


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
    <button @click="selectTool(ToolType.Brush)" :class="{ active: selectedTool === ToolType.Brush }">Brush</button>
    <button @click="selectTool(ToolType.Eraser)" :class="{ active: selectedTool === ToolType.Eraser }">Eraser</button>

    <label for="colorPicker">Color:</label>
    <input type="color" id="colorPicker" :value="selectedColor" @input="updateColor" />

    <!-- 亮度调节滑块 -->
    <label for="brightnessSlider">Brightness:</label>
    <input type="range" id="brightnessSlider" min="-100" max="100" v-model="brightness" @input="emitBrightness" />

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
