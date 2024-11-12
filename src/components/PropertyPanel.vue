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
const hslPreviewColor = computed(() => {
  const { hue, saturation, lightness } = propertyStore.hsl;
  return `hsl(${hue}, ${saturation + 100}%, ${lightness + 50}%)`; // 中心色以更明显的颜色来预览
});
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
const parameterState = ref({})  // 用来存储每个参数的状态
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
const setEraserToFullScreen = () =>{
  propertyStore.eraserSize = Math.max(window.innerWidth, window.innerHeight);
}
// 更新 selectedParameter
const setParameter = (parameter) => {
  propertyStore.setSelectedParameter(parameter.name);

};
const handleSwitchChange = (parameter) => {
  // 可以根据需要处理启用状态变化
  setParameter(parameter);
  parameters.value.forEach(p => {
    if (p !== parameter) {
      p.enabled = false;
    }
  });
  parameter.enabled = !parameter.enabled;
  console.log(`${parameter.name} is now ${parameter.enabled ? 'enabled' : 'disabled'}`);
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

// 更新曝光
const updateExposure = (event: Event) => {
  const newExposure = Number((event.target as HTMLInputElement).value);
  propertyStore.adjustExposure(newExposure);
};

// 更新饱和度
const updateSaturation = (event: Event) => {
  const newSaturation = Number((event.target as HTMLInputElement).value);
  propertyStore.adjustSaturation(newSaturation);
};

const updateHue = (event: Event) => {
  const newHue = Number((event.target as HTMLInputElement).value);
  propertyStore.adjustHue(newHue);
};

const updateSharpen = (event: Event) => {
  const newUpdateSharpen = Number((event.target as HTMLInputElement).value);
  propertyStore.adjustIntensity(newUpdateSharpen);
}
const updateLightness = (event: Event) => {
  const newLightness = Number((event.target as HTMLInputElement).value);
  propertyStore.adjustLightness(newLightness);
};
const updateColorTemperature= (event: Event)  =>{
  const value = (event.target as HTMLInputElement).valueAsNumber;
  propertyStore.updateColorTemperature(value);

};

// 根据色温值生成色调预览
const getColorPreview = (colorTemperature: number) =>{
  // 生成色温预览色，根据 colorTemperature 值调整背景颜色
  // -100 -> 蓝色, 0 -> 白色, 100 -> 红色
  let r = 255;
  let g = 255;
  let b = 255;

  if (colorTemperature < 0) {
    b = Math.min(255, Math.max(0, 255 + colorTemperature * 1.5));  // 偏蓝
  } else {
    r = Math.min(255, Math.max(0, 255 - colorTemperature * 1.5));  // 偏红
  }

  return `rgb(${r}, ${g}, ${b})`;
};
// 更新曲线控制点
const handleUpdateCurve = (channel: 'red' | 'green' | 'blue', index: number, value: string) => {
  const newValue = Number(value);
  propertyStore.updateCurve(channel, index, newValue);
};

const updateDehazeStrength = (event:Event) =>{
  const newUpdateDehazeStrength = Number((event.target as HTMLInputElement).value);
  propertyStore.adjustDehazeStrength(newUpdateDehazeStrength);
};

// 生成曲线路径 (SVG Path)
const getCurvePath = (curve: Curve) => {
  let pathData = `M 0 ${250 - curve[0].output}`;
  for (let i = 1; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 280; // X 轴位置
    const y = 250 - curve[i].output; // Y 轴位置
    pathData += ` L ${x} ${y}`;
  }
  return pathData;
};
const updateCropArea = () => {
  propertyStore.updateCropArea({
    x: propertyStore.cropArea.x,
    y: propertyStore.cropArea.y,
    width: propertyStore.cropArea.width,
    height: propertyStore.cropArea.height,
  } as CropArea);
};
const updateSmoothingRadius = (event:Event) =>{
  const newSmoothingRadius = Number((event.target as HTMLInputElement).value);
  propertyStore.adjustSmoothingRadius(newSmoothingRadius);
}
// 更新水印选项
const handleUpdateWatermarkOptions = (option: Partial<typeof propertyStore.watermarkOption>) => {
  propertyStore.adjustWatermarkOption(option);
};

// 中间方法：处理色调映射选择
function handleToneMappingChange(event) {
  const selectedType = event.target.value;
  // 调用store中的更新方法来设置选择的色调映射算法
  propertyStore.setToneMappingType(selectedType);
}
</script>

<template>

  <div class="property-panel">
    <h3>Properties</h3>
  <var-paper>


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
      <!-- 按钮 -->
      <button @click="setEraserToFullScreen">Set Eraser to Full Screen</button>
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
    <!-- 曝光滑动条 -->
    <template v-if="propertyStore.selectedParameter === 'Exposure'">
      <label for="exposure">Exposure:</label>
      <input
          type="range"
          id="exposure"
          min="-100"
          max="100"
          :value="propertyStore.exposure"
          @input="updateExposure"
      />
      <p>Current exposure: {{ propertyStore.exposure }}%</p>
    </template>

    <!-- 饱和度滑动条 -->
    <template v-if="propertyStore.selectedParameter === 'Saturation'">
      <label for="saturation">Saturation:</label>
      <input
          type="range"
          id="saturation"
          min="-100"
          max="100"
          :value="propertyStore.saturation"
          @input="updateSaturation"
      />
      <p>Current saturation: {{ propertyStore.saturation }}%</p>
    </template>
    <!-- 色温滑动条 -->
    <template v-if="propertyStore.selectedParameter === 'ColorTemperature'">
      <label for="colorTemperature">Color Temperature:</label>
      <input
          type="range"
          id="colorTemperature"
          min="-100"
          max="100"
          :value="propertyStore.colorTemperature"
          @input="updateColorTemperature"
      />
      <p>Current color temperature: {{ propertyStore.colorTemperature }}</p>

      <!-- 色调预览条 -->
      <div class="color-preview">
        <div
            class="color-sample"
            :style="{ backgroundColor: getColorPreview(propertyStore.colorTemperature) }">
        </div>
        <p>Color preview</p>
      </div>
    </template>
    <!-- HSL 调整 -->
    <template v-if="propertyStore.selectedParameter === 'HSL'">
      <label for="hue">Hue:</label>
      <input
          type="range"
          id="hue"
          min="0"
          max="360"
          :value="propertyStore.hsl.hue"
          @input="updateHue"
      />
      <p>Current hue: {{ propertyStore.hsl.hue }}°</p>

      <label for="saturation">Saturation:</label>
      <input
          type="range"
          id="saturation"
          min="-100"
          max="100"
          :value="propertyStore.hsl.saturation"
          @input="updateSaturation"
      />
      <p>Current saturation: {{ propertyStore.hsl.saturation }}%</p>

      <label for="lightness">Lightness:</label>
      <input
          type="range"
          id="lightness"
          min="-100"
          max="100"
          :value="propertyStore.hsl.lightness"
          @input="updateLightness"
      />
      <p>Current lightness: {{ propertyStore.hsl.lightness }}%</p>


      <!-- HSL 预览三角形 -->
      <div class="hsl-preview">
        <svg width="50" height="50">
          <polygon points="25,0 0,50 50,50" :fill="hslPreviewColor" />
        </svg>
      </div>
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
    <template v-if="propertyStore.selectedParameter === 'Crop'">
      <label for="crop">Crop:</label>
      <div class="crop-controls">
        <label>
          <var-input
              v-model.number="propertyStore.cropArea.x"
              type="number"
              @input="updateCropArea"
              placeholder="X坐标"
          />
        </label>
        <label>
          <var-input
              v-model.number="propertyStore.cropArea.y"
              type="number"
              @input="updateCropArea"
              placeholder="输入Y坐标"
          />
        </label>
        <label>
          <var-input
              v-model.number="propertyStore.cropArea.width"
              type="number"
              @input="updateCropArea"
              placeholder="输入宽度"
          />
        </label>
        <label>
          <var-input
              v-model.number="propertyStore.cropArea.height"
              type="number"
              @input="updateCropArea"
              placeholder="输入高度"
          />
        </label>
      </div>

      <!-- SVG 指示图 -->
      <svg width="200" height="200" viewBox="0 0 1000 1000" class="crop-indicator">
        <rect x="0" y="0" width="1000" height="1000" fill="#f0f0f0" stroke="#ccc" />
        <rect
            :x="propertyStore.cropArea.x"
            :y="propertyStore.cropArea.y"
            :width="propertyStore.cropArea.width"
            :height="propertyStore.cropArea.height"
            fill="rgba(0, 123, 255, 0.3)"
            stroke="#007bff"
        />
      </svg>
    </template>

    <!-- 水印选项控制和预览 -->
    <template v-if="propertyStore.selectedParameter === 'Watermark'">
      <div class="watermark-control">
        <div>
          <label for="watermark-text">Text:</label>
          <input
              type="text"
              id="watermark-text"
              :value="propertyStore.watermarkOption.text"
              @input="event => handleUpdateWatermarkOptions({ text: event.target.value })"
          />
        </div>

        <div>
          <label for="font-size">Font Size:</label>
          <input
              type="number"
              id="font-size"
              min="10"
              max="100"
              :value="propertyStore.watermarkOption.fontSize"
              @input="event => handleUpdateWatermarkOptions({ fontSize: Number(event.target.value) })"
          />
        </div>

        <div>
          <label for="color">Color:</label>
          <input
              type="color"
              id="color"
              :value="propertyStore.watermarkOption.color"
              @input="event => handleUpdateWatermarkOptions({ color: event.target.value })"
          />
        </div>

        <div>
          <label for="opacity">Opacity:</label>
          <input
              type="range"
              id="opacity"
              min="0"
              max="1"
              step="0.1"
              :value="propertyStore.watermarkOption.opacity"
              @input="event => handleUpdateWatermarkOptions({ opacity: Number(event.target.value) })"
          />
        </div>

        <div>
          <label for="position-x">Position X:</label>
          <input
              type="number"
              id="position-x"
              :value="propertyStore.watermarkOption.position.x"
              @input="event => handleUpdateWatermarkOptions({ position: { ...propertyStore.watermarkOption.position, x: Number(event.target.value) } })"
          />
        </div>

        <div>
          <label for="position-y">Position Y:</label>
          <input
              type="number"
              id="position-y"
              :value="propertyStore.watermarkOption.position.y"
              @input="event => handleUpdateWatermarkOptions({ position: { ...propertyStore.watermarkOption.position, y: Number(event.target.value) } })"
          />
        </div>
      </div>

      <!-- 水印预览 -->
      <svg width="200" height="200" viewBox="0 0 1000 1000" class="watermark-preview">
        <rect x="0" y="0" width="1000" height="1000" fill="#f0f0f0" stroke="#ccc" />
        <text
            :x="propertyStore.watermarkOption.position.x"
            :y="propertyStore.watermarkOption.position.y"
            :font-size="propertyStore.watermarkOption.fontSize"
            :fill="propertyStore.watermarkOption.color"
            :opacity="propertyStore.watermarkOption.opacity"
            font-family="Arial, sans-serif"
        >
          {{ propertyStore.watermarkOption.text }}
        </text>
      </svg>
    </template>
    <!-- 锐化滑动条 -->
    <template v-if="propertyStore.selectedParameter === 'Sharpen'">
      <label for="sharpen">Sharpen Intensity:</label>
      <input
          type="range"
          id="sharpen"
          min="0"
          max="10"
          step="0.1"
          :value="propertyStore.intensity"
          @input="updateSharpen"
      />
      <p>Current sharpen intensity: {{ propertyStore.intensity }}</p>
    </template>
    <!-- 平滑半径滑动条 -->
    <template v-if="propertyStore.selectedParameter === 'Smooth'">
      <label for="smoothing-radius">Smoothing Radius:</label>
      <input
          type="range"
          id="smoothing-radius"
          min="1"
          max="20"
          :value="propertyStore.smoothingRadius"
          @input="updateSmoothingRadius"
      />
      <p>Current smoothing radius: {{ propertyStore.smoothingRadius }}</p>
    </template>
    <!-- 去雾强度滑动条 -->
    <template v-if="propertyStore.selectedParameter === 'Dehaze'">
      <label for="dehaze-strength">Dehaze Strength:</label>
      <input
          type="range"
          id="dehaze-strength"
          min="0"
          max="100"
          :value="propertyStore.dehazeStrength"
          @input="updateDehazeStrength"
      />
      <p>Current dehaze strength: {{ propertyStore.dehazeStrength }}</p>
    </template>
    <!-- 曲线调整控制面板 -->
    <template v-if="propertyStore.selectedParameter === 'Curve'">
      <div class="curve-adjustment-control">
        <!-- 红色通道曲线 -->
        <div>
          <label for="red-curve">Red Curve:</label>
          <input
              type="range"
              id="red-curve"
              min="0"
              max="255"
              step="1"
              v-for="(point, index) in propertyStore.curveAdjustment.redCurve"
              :key="index"
              :value="point.output"
              @input="event => handleUpdateCurve('red', index, event.target.value)"
          />
        </div>

        <!-- 绿色通道曲线 -->
        <div>
          <label for="green-curve">Green Curve:</label>
          <input
              type="range"
              id="green-curve"
              min="0"
              max="255"
              step="1"
              v-for="(point, index) in propertyStore.curveAdjustment.greenCurve"
              :key="index"
              :value="point.output"
              @input="event => handleUpdateCurve('green', index, event.target.value)"
          />
        </div>

        <!-- 蓝色通道曲线 -->
        <div>
          <label for="blue-curve">Blue Curve:</label>
          <input
              type="range"
              id="blue-curve"
              min="0"
              max="255"
              step="1"
              v-for="(point, index) in propertyStore.curveAdjustment.blueCurve"
              :key="index"
              :value="point.output"
              @input="event => handleUpdateCurve('blue', index, event.target.value)"
          />
        </div>
      </div>

      <!-- 曲线预览 -->
      <svg width="300" height="300" viewBox="0 0 300 300" class="curve-preview">
        <g transform="translate(10, 10)">
          <!-- X 轴 (输入色阶) -->
          <line x1="0" y1="250" x2="280" y2="250" stroke="black" />
          <text x="140" y="270" text-anchor="middle">Input Levels</text>

          <!-- Y 轴 (输出色阶) -->
          <line x1="0" y1="0" x2="0" y2="250" stroke="black" />
          <text x="-10" y="125" text-anchor="middle" transform="rotate(-90)">Output Levels</text>

          <!-- 曲线 -->
          <path
              :d="getCurvePath(propertyStore.curveAdjustment.redCurve)"
              fill="transparent"
              stroke="red"
              stroke-width="2"
          />
          <path
              :d="getCurvePath(propertyStore.curveAdjustment.greenCurve)"
              fill="transparent"
              stroke="green"
              stroke-width="2"
          />
          <path
              :d="getCurvePath(propertyStore.curveAdjustment.blueCurve)"
              fill="transparent"
              stroke="blue"
              stroke-width="2"
          />
        </g>
      </svg>
      <!-- 展示当前选择的曲线通道 -->
      <template v-if="propertyStore.selectedChannel !== undefined">
        <p>Selected Curve: {{ propertyStore.selectedChannel }} Channel</p>
      </template>
    </template>
    <!-- 色调映射类型选择 -->
    <template v-if="propertyStore.selectedParameter === 'ToneMapping'">
      <label for="toneMappingType">Tone Mapping Type:</label>
      <select id="toneMappingType" :value="propertyStore.toneMappingConfig.type" @change="handleToneMappingChange">
        <option value="Reinhard">Reinhard</option>
        <option value="ACES">ACES</option>
        <option value="Filmic">Filmic</option>
      </select>
      <p>Current tone mapping type: {{ propertyStore.toneMappingConfig.type }}</p>
    </template>
  </var-paper>
  </div>
</template>

<style scoped>
.property-panel {
  width: 400px;
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
