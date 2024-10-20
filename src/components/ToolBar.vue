

<template>
  <div class="toolbar">
    <button @click="selectTool('brush')" :class="{ active: selectedTool === 'brush' }">Brush</button>
    <button @click="selectTool('eraser')" :class="{ active: selectedTool === 'eraser' }">Eraser</button>
    <label for="colorPicker">Color:</label>
    <input type="color" id="colorPicker" :value="selectedColor" @input="updateColor" />
  </div>
</template>

<script  setup lang="ts">
const props = defineProps({
  selectedTool: String,  // 接收父组件传递的选中工具
  selectedColor: String, // 接收当前的画笔颜色
});
const emit = defineEmits(['selectTool', 'updateColor']);
const selectTool = (tool) => {
  console.log(`Tool selected: ${tool}`);  // 添加 console log
  emit('selectTool', tool);  // 通过事件通知父组件
};

// 更新颜色
const updateColor = (event) => {
  emit('updateColor', event.target.value);  // 传递新的颜色
};



</script>

<style>
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
