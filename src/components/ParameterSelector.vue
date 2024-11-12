<script setup lang="ts">

import {usePropertyStore} from "../store/propertyStore";
import {CropArea} from "../types/CropAreaType";
import { Button as VarButton,Snackbar, } from '@varlet/ui'
import '@varlet/ui/es/button/style/index'
import '@varlet/ui/es/snackbar/style/index'
import '@varlet/ui/es/ripple/style/index'
import '@varlet/ui/es/paper/style/index'
import '@varlet/ui/es/switch/style/index'
import '@varlet/ui/es/cell/style/index'
import '@varlet/ui/es/input/style/index'
const propertyStore = usePropertyStore();

const parameters = ref([
  { name: 'Brush', icon: 'brush', enabled: false },
  { name: 'Eraser', icon: 'eraser', enabled: false },
  { name: 'Brightness', icon: 'brightness-6', enabled: false },
  { name: 'Contrast', icon: 'contrast', enabled: false },
  { name: 'Exposure', icon: 'exposure', enabled: false },
  { name: 'Saturation', icon: 'invert_colors', enabled: false },
  { name: 'HSL', icon: 'color-lens', enabled: false },
  { name: 'Crop', icon: 'crop', enabled: false },
  { name: 'Watermark', icon: 'watermark', enabled: false },
  { name: 'Smooth', icon: 'smooth', enabled: false },
  { name: 'Curve', icon: 'curve', enabled: false },
  { name: 'Sharpen', icon: 'sharpen', enabled: false },
  { name: 'ToneMapping', icon: 'photo-filter', enabled: false },
  { name: 'ColorTemperature', icon: 'wb_sunny', enabled: false },
  { name: 'Dehaze', icon: 'blur_circular', enabled: false },
]);


// 更新 selectedParameter
const setParameter = (parameter) => {
  propertyStore.setSelectedParameter(parameter.name);

};
const handleSwitchChange = (parameter) => {
  // 切换当前参数的启用状态
  parameter.enabled = !parameter.enabled;

  // 更新选中的参数列表
  setParameter(parameter);

  console.log(`${parameter.name} is now ${parameter.enabled ? 'enabled' : 'disabled'}`);
};


</script>



<template>
  <div class="parameter-selector">
  <h3>Properties</h3>
  <!-- 参数选择器 -->
  <template v-if="true">
    <var-paper :elevation="2">
      <var-cell
          v-for="(parameter, index) in parameters"
          :key="parameter.name"
          :ripple=true
          :icon="parameter.icon"
          :border=true
          :border-offset=0

      >
        {{ parameter.name }}

        <template #extra>
          <!-- 右边的开关，控制每个参数是否启用 -->
          <var-switch v-model="parameter.enabled" @click.stop="handleSwitchChange(parameter)" />
        </template>
      </var-cell>
    </var-paper>
  </template>
  </div>
</template>

<style scoped>
.parameter-selector {
  width: 175px;
  padding: 10px;
  background-color: #f9f9f9;
  border-left: 1px solid #ccc;
}
.color-preview {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.color-sample {
  width: 100px;
  height: 20px;
  border: 1px solid #000;
}
#dehaze-strength {
  width: 100%;
  margin: 10px 0;
}

p {
  font-size: 14px;
  color: #666;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  cursor: pointer;
  width: 300px; /* 根据需要调整宽度 */
}


/* 设置固定高度和宽度 */
.carousel-item {
  width: 200px;  /* 可以根据需求调整 */
  height: 150px; /* 可以根据需求调整 */
  margin: 10px;
}
</style>
