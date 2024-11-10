<script setup lang="ts">
import {usePropertyStore} from "../store/propertyStore";
import {CropArea} from "../types/CropAreaType";

const propertyStore = usePropertyStore();
const hslPreviewColor = computed(() => {
  const { hue, saturation, lightness } = propertyStore.hsl;
  return `hsl(${hue}, ${saturation + 100}%, ${lightness + 50}%)`; // 中心色以更明显的颜色来预览
});
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

// 更新 selectedParameter
const setParameter = (parameter: string) => {
  propertyStore.setSelectedParameter(parameter);
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

// 更新曲线控制点
const handleUpdateCurve = (channel: 'red' | 'green' | 'blue', index: number, value: string) => {
  const newValue = Number(value);
  propertyStore.updateCurve(channel, index, newValue);
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
// 更新水印选项
const handleUpdateWatermarkOptions = (option: Partial<typeof propertyStore.watermarkOptions>) => {
  propertyStore.adjustWatermarkOption(option);
};
</script>

<template>
  <div class="property-panel">
    <h3>Properties</h3>
    <!-- 参数选择器 -->
    <div class="parameter-selector">
      <button
          v-for="parameter in [
              'Brush',
              'Eraser',
              'Brightness',
              'Contrast',
              'Exposure',
              'Saturation',
              'HSL',
              'Crop',
              'Watermark',
              'Curve',
              'Sharpen'
              ]"
          :key="parameter"
          :class="{ active: propertyStore.selectedParameter === parameter }"
          @click="setParameter(parameter)"
      >
        {{ parameter }}
      </button>
    </div>
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
    <!-- 裁剪区域选择 -->
    <template v-if="propertyStore.selectedParameter === 'Crop'">
      <label for="crop">Crop:</label>
      <div class="crop-controls">
        <label>
          X:
          <input type="number" v-model.number="propertyStore.cropArea.x" @input="updateCropArea" />
        </label>
        <label>
          Y:
          <input type="number" v-model.number="propertyStore.cropArea.y" @input="updateCropArea" />
        </label>
        <label>
          Width:
          <input type="number" v-model.number="propertyStore.cropArea.width" @input="updateCropArea" />
        </label>
        <label>
          Height:
          <input type="number" v-model.number="propertyStore.cropArea.height" @input="updateCropArea" />
        </label>

      </div>
      <!-- SVG 指示图 -->
      <svg width="200" height="200" viewBox="0 0 1000 1000" class="crop-indicator">
        <!-- 画布背景 -->
        <rect x="0" y="0" width="1000" height="1000" fill="#f0f0f0" stroke="#ccc" />
        <!-- 裁剪区域 -->
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
  </div>
</template>

<style scoped>
.property-panel {
  width: 300px;
  padding: 10px;
  background-color: #f9f9f9;
  border-left: 1px solid #ccc;
}
</style>
