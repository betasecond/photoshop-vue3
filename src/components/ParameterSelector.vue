<script setup lang="ts">

import {usePropertyStore} from "../store/propertyStore";
import {CropArea} from "../types/cropAreaType";
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
  { name: 'Brush', localName: '画笔', icon: 'brush', enabled: false },
  { name: 'Eraser', localName: '橡皮擦', icon: 'eraser', enabled: false },
  { name: 'Brightness', localName: '亮度', icon: 'brightness-6', enabled: false },
  { name: 'Contrast', localName: '对比度', icon: 'contrast', enabled: false },
  { name: 'Exposure', localName: '曝光', icon: 'exposure', enabled: false },
  { name: 'Saturation', localName: '饱和度', icon: 'invert_colors', enabled: false },
  { name: 'HSL', localName: 'HSL', icon: 'color-lens', enabled: false },
  { name: 'Crop', localName: '裁剪', icon: 'crop', enabled: false },
  { name: 'Watermark', localName: '水印', icon: 'watermark', enabled: false },
  { name: 'Smooth', localName: '平滑', icon: 'smooth', enabled: false },
  { name: 'Curve', localName: '曲线调整', icon: 'curve', enabled: false },
  { name: 'Sharpen', localName: '锐化', icon: 'sharpen', enabled: false },
  { name: 'ToneMapping', localName: '色调映射', icon: 'photo-filter', enabled: false },
  { name: 'ColorTemperature', localName: '色温', icon: 'wb_sunny', enabled: false },
  { name: 'Dehaze', localName: '去雾', icon: 'blur_circular', enabled: false },
  { name: 'Style', localName: '风格', icon: 'blur_circular', enabled: false },
  { name: 'LE', localName: '局部亮度曝光', icon: 'arrow_left', enabled: false },
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
  <var-paper :elevation="8" :width="'175px'" :height="'100%'" ripple  >
  <div class="parameter-selector">
  <!-- 参数选择器 -->
  <template v-if="true">
    <var-paper :elevation="12">
      <var-cell
          v-for="(parameter, index) in parameters"
          :key="parameter.name"
          :ripple=true
          :icon="parameter.icon"
          :border=true
          :border-offset=0

      >
        {{ parameter.localName }}

        <template #extra>
          <!-- 右边的开关，控制每个参数是否启用 -->
          <var-switch v-model="parameter.enabled" @click.stop="handleSwitchChange(parameter)" />
        </template>
      </var-cell>
    </var-paper>
  </template>
  </div>
  </var-paper>
</template>

<style scoped>
.parameter-selector {
  width: 175px;
  padding: 10px;

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
