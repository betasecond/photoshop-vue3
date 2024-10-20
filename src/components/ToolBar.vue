<template>
  <div class="toolbar">
    <button @click="selectTool(ToolType.Brush)" :class="{ active: selectedTool === ToolType.Brush }">Brush</button>
    <button @click="selectTool(ToolType.Eraser)" :class="{ active: selectedTool === ToolType.Eraser }">Eraser</button>
    <label for="colorPicker">Color:</label>
    <input type="color" id="colorPicker" :value="selectedColor" @input="updateColor" />
  </div>
</template>

<script setup lang="ts">
import { ToolType } from './canvasDrawing';  // 引入 ToolType 枚举

const props = defineProps({
  selectedTool: ToolType,   // 接收父组件传递的选中工具，类型为枚举
  selectedColor: String,    // 接收当前的画笔颜色
});
const emit = defineEmits(['selectTool', 'updateColor']);

const selectTool = (tool: ToolType) => {
  console.log(`Tool selected: ${tool}`);
  emit('selectTool', tool);  // 通过事件通知父组件选择的工具是枚举类型
};

// 更新颜色
const updateColor = (event: Event) => {
  emit('updateColor', (event.target as HTMLInputElement).value);  // 传递新的颜色值
};
</script>

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
