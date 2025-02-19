<script setup lang="ts">
import {usePropertyStore} from "../store/propertyStore";
import {CropArea} from "../types/cropAreaType";
import {Button as VarButton,} from '@varlet/ui'
import '@varlet/ui/es/button/style/index'
import '@varlet/ui/es/snackbar/style/index'
import '@varlet/ui/es/ripple/style/index'
import '@varlet/ui/es/paper/style/index'
import '@varlet/ui/es/switch/style/index'
import '@varlet/ui/es/cell/style/index'
import '@varlet/ui/es/input/style/index'
import '@varlet/ui/es/slider/style/index'
import '@varlet/ui/es/chip/style/index'
import '@varlet/ui/es/select/style/index'
import '@varlet/ui/es/option/style/index'
import {ToneMappingType} from "../types/toneMappingConfigType";
import {getEnumKeyByValue, getVarletStyleDisplay, VarletStyle} from "../types/varletStyleType";

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
  { name: 'LE',icon: 'arrow_left', enabled: false },
]);
const parameterState = ref({})  // 用来存储每个参数的状态
// 更新 brushSize
const updateBrushSize = (event: Event) => {
  const newSize = Number((event.target as HTMLInputElement).value);
  propertyStore.updateBrushSize(newSize);
};
const resetExposure = () => {
  // 这里可以添加重置曝光的逻辑
  let exposure = 0  // 重置为默认值
  propertyStore.adjustExposure(exposure)
}
// 重置水印设置
const resetWatermarkOptions = () => {
  // 重置为默认值
  propertyStore.watermarkOption = {
    text: 'Watermark',
    fontSize: 30,
    color: '#000000',
    opacity: 0.5,
    position: { x: 100, y: 100 }
  }
}
const resetColorTemperature = () => {
  // 重置色温为默认值
  let colorTemperature = 0  // 默认值为 0
  propertyStore.adjustColorTemperature(colorTemperature)
}
const resetSaturation = () => {
  // 重置为默认值 0
  let saturation = 0;
  // 你可以根据需要调用调整函数，像调整曝光那样
  propertyStore.adjustSaturation(saturation);
}
// 更新光照效果的方法
const updateLightingEffect = () => {
  // 你已经在 store 中定义了相关方法
  propertyStore.setLightingEffect({
    x: propertyStore.lightX,
    y: propertyStore.lightY,
    strength: propertyStore.lightStrength,
  });
};
// 更新 eraserSize
const updateEraserSize = (event: Event) => {
  const newSize = Number((event.target as HTMLInputElement).value);
  propertyStore.updateEraserSize(newSize);
};
const setEraserToFullScreen = () =>{
  propertyStore.eraserSize = Math.max(window.innerWidth, window.innerHeight);
}
const resetSharpen = () =>{
  let intensity = 1;
  propertyStore.adjustIntensity(intensity);
}
// 更新 selectedParameter
const setParameter = (parameter) => {
  propertyStore.setSelectedParameter(parameter.name);

};
const resetBrightness = () => {
  // 这里可以添加重置亮度的逻辑
  let brightness = 50  // 重置为默认值
  propertyStore.adjustBrightness(brightness)
}

const resetContrast = () => {
  // 这里可以添加重置对比度的逻辑
  let contrast = 0  // 重置为默认值
  propertyStore.adjustContrast(contrast)
}
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
const resetHSL = () => {
  // 重置为默认的 HSL 值
  let hsl = { hue: 0, saturation: 0, lightness: 0 }
  propertyStore.adjustHSL(hsl)
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
const updateBrushColor = (event:Event) => {
  const newBrushColor = String((event.target as HTMLInputElement).value);
  propertyStore.updateColor(newBrushColor);

}
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
  console.log("开始调整曲线"+channel+index+value);
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
const handleToneMappingChange = () => {
  const selectedType = propertyStore.toneMappingConfig.type
  switch (selectedType) {
    case 'Reinhard':
      propertyStore.setToneMappingType('Reinhard')
      break
    case 'ACES':
      propertyStore.setToneMappingType('ACES')
      break
    case 'Filmic':
      propertyStore.setToneMappingType('Filmic')
      break
  }
}
</script>

<template>

  <div class="property-panel">

  <var-paper>


    <!-- 画笔大小滑动条 -->
    <template v-if="propertyStore.checkSelectedParameter('Brush')">
      <h3>画笔大小：</h3>
      <var-slider
          track-height="8" thumb-size="8"
          v-model="propertyStore.brushSize"
          min="1"
          max="50"
          step="1"
          @input="updateBrushSize"
      />

      <var-chip type="primary">画笔大小: {{ propertyStore.brushSize }}px</var-chip>
      <!-- 颜色 -->
      <div>
        <h4>颜色：</h4>
        <var-input
            v-model="propertyStore.selectedColor"
            type="color"
        />
      </div>
    </template>

    <!-- 橡皮擦大小滑动条 -->
    <template v-if="propertyStore.checkSelectedParameter('Eraser')">
      <h3>橡皮擦大小：</h3>
      <!-- 使用 var-slider 替代原生 input -->
      <var-slider
          track-height="8"
          thumb-size="8"
          v-model="propertyStore.eraserSize"
          min="1"
          max="50"
          step="1"
          @input="updateEraserSize"
      />
      <var-chip type="primary">橡皮擦大小: {{ propertyStore.eraserSize }}px</var-chip>

      <!-- 使用 var-button 替代原生 button -->
      <var-button @click="setEraserToFullScreen" type="primary">
        设置橡皮擦为全屏
      </var-button>
    </template>

    <!-- 亮度滑动条 -->
    <template v-if="propertyStore.checkSelectedParameter('Brightness')">
      <h3>亮度：</h3>
      <!-- 使用 var-slider 替代原生 input -->
      <var-slider
          track-height="8"
          thumb-size="8"
          v-model="propertyStore.brightness"
          min="0"
          max="100"
          step="1"
          @input="updateBrightness"
      />
      <var-chip type="primary">当前亮度: {{ propertyStore.brightness }}%</var-chip>

      <!-- 使用 var-button 替代原生 button -->
      <var-button @click="resetBrightness" type="primary">
        重置亮度
      </var-button>
    </template>

    <!-- 对比度滑动条 -->
    <template v-if="propertyStore.checkSelectedParameter('Contrast')">
      <h3>对比度：</h3>
      <!-- 使用 var-slider 替代原生 input -->
      <var-slider
          track-height="8"
          thumb-size="8"
          v-model="propertyStore.contrast"
          min="-100"
          max="100"
          step="1"
          @input="updateContrast"
      />
      <var-chip type="primary">当前对比度: {{ propertyStore.contrast }}%</var-chip>

      <!-- 使用 var-button 替代原生 button (可选，视需求决定是否有重置按钮) -->
      <var-button @click="resetContrast" type="primary">
        重置对比度
      </var-button>
    </template>

    <!-- 曝光滑动条 -->
    <template v-if="propertyStore.checkSelectedParameter('Exposure')">
      <h3>曝光：</h3>
      <!-- 使用 var-slider 替代原生 input -->
      <var-slider
          track-height="8"
          thumb-size="8"
          v-model="propertyStore.exposure"
          min="-100"
          max="100"
          step="1"
          @input="updateExposure"
      />
      <var-chip type="primary">当前曝光: {{ propertyStore.exposure }}%</var-chip>

      <!-- 使用 var-button 替代原生 button (可选，视需求决定是否有重置按钮) -->
      <var-button @click="resetExposure" type="primary">
        重置曝光
      </var-button>
    </template>


    <!-- 饱和度滑动条 -->
    <template v-if="propertyStore.checkSelectedParameter('Saturation')">
      <h3>饱和度：</h3>

      <!-- 使用 var-slider 组件 -->
      <var-slider
          v-model="propertyStore.saturation"
          :min="-100"
          :max="100"
          :step="1"
          track-height="8"
          thumb-size="10"
          @input="updateSaturation"
      />
      <var-chip type="primary">当前饱和度: {{ propertyStore.saturation }}%</var-chip>

      <!-- 重置按钮 -->
      <var-button @click="resetSaturation" type="primary">重置</var-button>
    </template>


    <!-- 色温滑动条 -->
    <template v-if="propertyStore.checkSelectedParameter('ColorTemperature')">
      <h3>色温调整：</h3>

      <!-- 色温调整 -->
      <h4>色温：</h4>
      <var-slider
          track-height="8"
          thumb-size="8"
          v-model="propertyStore.colorTemperature"
          min="-100"
          max="100"
          step="1"
          @input="updateColorTemperature"
      />
      <var-chip type="primary">当前色温: {{ propertyStore.colorTemperature }}</var-chip>

      <!-- 色调预览条 -->
      <div class="color-preview">
        <div
            class="color-sample"
            :style="{ backgroundColor: getColorPreview(propertyStore.colorTemperature) }">
        </div>
      </div>

      <!-- 重置按钮 -->
      <var-button @click="resetColorTemperature" type="primary">
        重置色温
      </var-button>
    </template>

    <!-- HSL 调整 -->
    <template v-if="propertyStore.checkSelectedParameter('HSL')">
      <h3>HSL 调整：</h3>

      <!-- 色相调整 -->
      <h4>色相：</h4>
      <var-slider
          track-height="8"
          thumb-size="8"
          v-model="propertyStore.hsl.hue"
          min="0"
          max="360"
          step="1"
          @input="updateHue"
      />
      <var-chip type="primary">当前色相: {{ propertyStore.hsl.hue }}°</var-chip>

      <!-- 饱和度调整 -->
      <h4>饱和度：</h4>
      <var-slider
          track-height="8"
          thumb-size="8"
          v-model="propertyStore.hsl.saturation"
          min="-100"
          max="100"
          step="1"
          @input="updateSaturation"
      />
      <var-chip type="primary">当前饱和度: {{ propertyStore.hsl.saturation }}%</var-chip>

      <!-- 亮度调整 -->
      <h4>亮度：</h4>
      <var-slider
          track-height="8"
          thumb-size="8"
          v-model="propertyStore.hsl.lightness"
          min="-100"
          max="100"
          step="1"
          @input="updateLightness"
      />
      <var-chip type="primary">当前亮度: {{ propertyStore.hsl.lightness }}%</var-chip>

      <!-- HSL 预览三角形 -->
      <div class="hsl-preview">
        <svg width="50" height="50">
          <polygon points="25,0 0,50 50,50" :fill="hslPreviewColor" />
        </svg>
      </div>

      <!-- 重置按钮 -->
      <var-button @click="resetHSL" type="primary">
        重置 HSL
      </var-button>
    </template>

    <!-- 旋转角度滑动条 -->
    <template v-if="propertyStore.checkSelectedParameter('Rotate')">
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
    <template v-if="propertyStore.checkSelectedParameter('Crop')">
      <h3>裁剪：</h3>
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
              placeholder="Y坐标"
          />
        </label>
        <label>
          <var-input
              v-model.number="propertyStore.cropArea.width"
              type="number"
              @input="updateCropArea"
              placeholder="宽度"
          />
        </label>
        <label>
          <var-input
              v-model.number="propertyStore.cropArea.height"
              type="number"
              @input="updateCropArea"
              placeholder="高度"
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
    <template v-if="propertyStore.checkSelectedParameter('Watermark')">
      <div class="watermark-control">
        <h3>水印：</h3>

        <!-- 水印文本 -->
        <div>
          <var-input
              v-model="propertyStore.watermarkOption.text"
              type="text"
              placeholder="请输入水印文本"
              @input="handleUpdateWatermarkOptions({ text: propertyStore.watermarkOption.text })"
          />
        </div>

        <!-- X 坐标 -->
        <div>
          <label for="position-x">X 坐标：</label>
          <var-input
              v-model.number="propertyStore.watermarkOption.position.x"
              type="number"
              :rules="[value => value >= 0 && value <= 1000 || 'X坐标必须在 0 到 1000 之间']"
              placeholder="输入 X 坐标"
          />
        </div>

        <!-- Y 坐标 -->
        <div>
          <label for="position-y">Y 坐标：</label>
          <var-input
              v-model.number="propertyStore.watermarkOption.position.y"
              type="number"
              :rules="[value => value >= 0 && value <= 1000 || 'Y坐标必须在 0 到 1000 之间']"
              placeholder="输入 Y 坐标"
          />
        </div>

        <!-- 字体大小 -->
        <div>
          <label for="font-size">字体大小：</label>
          <var-input
              v-model.number="propertyStore.watermarkOption.fontSize"
              type="number"
              :rules="[value => value >= 10 && value <= 100 || '字体大小必须在 10 到 100 之间']"
              placeholder="输入字体大小"
          />
        </div>

        <!-- 颜色 -->
        <div>
          <h4>颜色：</h4>
          <var-input
              v-model="propertyStore.watermarkOption.color"
              type="color"
              @input="handleUpdateWatermarkOptions({ color: propertyStore.watermarkOption.color })"
          />
        </div>

        <!-- 水印透明度滑动条 -->
        <div>
          <h4>透明度：</h4>
          <var-slider
              track-height="8"
              thumb-size="8"
              v-model="propertyStore.watermarkOption.opacity"
              min="0"
              max="1"
              step="0.1"
              @input="event => handleUpdateWatermarkOptions({ opacity: Number(event) })"
          />
          <var-chip type="primary">当前透明度: {{ propertyStore.watermarkOption.opacity }}</var-chip>
        </div>

      </div>

      <!-- 重置按钮 -->
      <var-button @click="resetWatermarkOptions" type="primary">
        重置水印
      </var-button>

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
    <template v-if="propertyStore.checkSelectedParameter('Sharpen')">
      <h3>锐化强度：</h3>

      <var-slider
          track-height="8"
          thumb-size="8"
          v-model="propertyStore.intensity"
          min="0"
          max="10"
          step="0.1"
          @input="updateSharpen"
      />

      <var-chip type="primary">当前锐化强度: {{ propertyStore.intensity }}</var-chip>

      <!-- 重置按钮 -->
      <var-button @click="resetSharpen" type="primary">
        重置锐化强度
      </var-button>
    </template>



    <!-- 平滑半径滑动条 -->
    <template v-if="propertyStore.checkSelectedParameter('Smooth')">
      <h3>平滑半径：</h3>

      <var-slider
          track-height="8"
          thumb-size="8"
          v-model="propertyStore.smoothingRadius"
          min="1"
          max="20"
          step="1"
          @input="updateSmoothingRadius"
      />

      <var-chip type="primary">当前平滑半径: {{ propertyStore.smoothingRadius }}</var-chip>
    </template>


    <!-- 去雾强度滑动条 -->
    <template v-if="propertyStore.checkSelectedParameter('Dehaze')">
      <h3>去雾强度：</h3>

      <var-slider
          track-height="8"
          thumb-size="8"
          v-model="propertyStore.dehazeStrength"
          min="0"
          max="100"
          step="1"
          @input="updateDehazeStrength"
      />

      <var-chip type="primary">当前去雾强度: {{ propertyStore.dehazeStrength }}</var-chip>
    </template>


    <!-- 曲线调整控制面板 -->
    <template v-if="propertyStore.checkSelectedParameter('Curve')">
      <div class="curve-adjustment-control">
        <!-- 红色通道曲线 -->
        <div>
          <h3>红色通道曲线：</h3>
          <input
              type="range"
              v-for="(point, index) in propertyStore.curveAdjustment.redCurve"
              :key="'red-' + index"
              v-model="point.output"
              min="0"
              max="255"
              step="1"
              @input="event => handleUpdateCurve('red', index, event.target.value)"
          />
        </div>

        <!-- 绿色通道曲线 -->
        <div>
          <h3>绿色通道曲线：</h3>
          <input
              type="range"
              v-for="(point, index) in propertyStore.curveAdjustment.greenCurve"
              :key="'green-' + index"
              v-model="point.output"
              min="0"
              max="255"
              step="1"
              @input="event => handleUpdateCurve('green', index, event.target.value)"
          />
        </div>

        <!-- 蓝色通道曲线 -->
        <div>
          <h3>蓝色通道曲线：</h3>
          <input
              type="range"
              v-for="(point, index) in propertyStore.curveAdjustment.blueCurve"
              :key="'blue-' + index"
              v-model="point.output"
              min="0"
              max="255"
              step="1"
              @input="event => handleUpdateCurve('blue', index, event.target.value)"
          />
        </div>
      </div>

      <!-- 曲线预览 -->
      <svg width="300" height="300" viewBox="0 0 300 300" class="curve-preview">
        <g transform="translate(10, 10)">
          <!-- X 轴 (输入色阶) -->
          <line x1="0" y1="250" x2="280" y2="250" stroke="black" />
          <text x="140" y="270" text-anchor="middle">输入色阶</text>

          <!-- Y 轴 (输出色阶) -->
          <line x1="0" y1="0" x2="0" y2="250" stroke="black" />
          <text x="-10" y="125" text-anchor="middle" transform="rotate(-90)">输出色阶</text>

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
        <var-chip type="primary">当前选择的曲线：{{ propertyStore.selectedChannel }} 通道</var-chip>
      </template>
    </template>



    <!-- 色调映射类型选择 -->
    <template v-if="propertyStore.checkSelectedParameter('ToneMapping')">
      <h3>色调映射类型：</h3>

      <!-- 使用 var-select 来替换原有的 <select> -->
      <var-select v-model="propertyStore.toneMappingConfig.type" placeholder="选择色调映射类型" @change="handleToneMappingChange">

        <template #default>
          <var-option label="Reinhard">
            <var-icon class="selected-icon" name="image-filter" />
            <span>Reinhard</span>
          </var-option>
          <var-option label="ACES">
            <var-icon class="selected-icon" name="image-filter" />
            <span>ACES</span>
          </var-option>
          <var-option label="Filmic">
            <var-icon class="selected-icon" name="image-filter" />
            <span>Filmic</span>
          </var-option>
        </template>

        <!-- 当前选中的类型展示 -->
        <template #selected>
          <var-icon class="selected-icon" :name="propertyStore.toneMappingConfig.type" />
          <span>{{ propertyStore.toneMappingConfig.type }}</span>
        </template>

      </var-select>

      <var-chip type="primary">当前色调映射类型：{{ propertyStore.toneMappingConfig.type }}</var-chip>
    </template>


    <!-- 样式类型选择 -->
    <template v-if="propertyStore.checkSelectedParameter('Style')">
      <h3>样式类型：</h3>

      <var-select v-model="propertyStore.selectVarletStyle" placeholder="选择样式类型">

        <template #default>
          <var-option :label="getEnumKeyByValue(VarletStyle, VarletStyle.Dark)" :value="VarletStyle.Dark">
            <var-icon class="selected-icon" name="image-filter" />
            <span>{{ getEnumKeyByValue(VarletStyle, VarletStyle.Dark) }}</span>
          </var-option>
          <var-option :label="getEnumKeyByValue(VarletStyle, VarletStyle.md3Light)" :value="VarletStyle.md3Light">
            <var-icon class="selected-icon" name="image-filter" />
            <span>{{ getEnumKeyByValue(VarletStyle, VarletStyle.md3Light) }}</span>
          </var-option>
          <var-option :label="getEnumKeyByValue(VarletStyle, VarletStyle.md3Dark)" :value="VarletStyle.md3Dark">
            <var-icon class="selected-icon" name="image-filter" />
            <span>{{ getEnumKeyByValue(VarletStyle, VarletStyle.md3Dark) }}</span>
          </var-option>
        </template>

        <template #selected>
          <var-icon class="selected-icon" :name="getEnumKeyByValue(VarletStyle, propertyStore.selectVarletStyle)" />
          <span>{{ getVarletStyleDisplay(propertyStore.selectVarletStyle) }}</span>
        </template>

      </var-select>

      <var-chip type="primary">当前样式：{{ getVarletStyleDisplay(propertyStore.selectVarletStyle) }}</var-chip>
    </template>

    <template v-if="propertyStore.checkSelectedParameter('LE')">
      <h3>光照效果：</h3>

      <!-- 光源 X 坐标输入框 -->
      <div>
        <label for="light-x">光源 X 坐标：</label>
        <var-input
            v-model.number="propertyStore.lightX"
            type="number"
            :rules="[value => value >= 0 && value <= 1000 || 'X坐标必须在 0 到 1000 之间']"
            placeholder="输入X坐标"
            id="light-x"
        />
      </div>
      <var-chip type="primary">当前光源 X 坐标：{{ propertyStore.lightX }}</var-chip>

      <!-- 光源 Y 坐标输入框 -->
      <div>
        <label for="light-y">光源 Y 坐标：</label>
        <var-input
            v-model.number="propertyStore.lightY"
            type="number"
            :rules="[value => value >= 0 && value <= 1000 || 'Y坐标必须在 0 到 1000 之间']"
            placeholder="输入Y坐标"
            id="light-y"
        />
      </div>
      <var-chip type="primary">当前光源 Y 坐标：{{ propertyStore.lightY }}</var-chip>

      <!-- 光照强度滑动条 -->
      <h4>光照强度：</h4>
      <var-slider
          track-height="8"
          thumb-size="8"
          v-model="propertyStore.lightStrength"
          min="0"
          max="200"
          step="1"
          @input="updateLightingEffect"
      />
      <var-chip type="primary">当前光照强度：{{ propertyStore.lightStrength }}</var-chip>

      <!-- SVG指示光源位置 -->
      <h4>光源预览：</h4>
      <svg width="200" height="200" viewBox="0 0 200 200" class="lighting-preview">
        <!-- 背景 -->
        <rect x="0" y="0" width="200" height="200" fill="#f0f0f0" stroke="#ccc" />
        <!-- 光源位置 -->
        <circle
            :cx="propertyStore.lightX/5"
            :cy="propertyStore.lightY/5"
            r="5"
            fill="red"
        />
        <!-- 光照强度对应的圆圈 -->
        <circle
            :cx="propertyStore.lightX/5"
            :cy="propertyStore.lightY/5"
            :r="propertyStore.lightStrength / 10"
            fill="rgba(255, 0, 0, 0.2)"
        />
      </svg>
    </template>


  </var-paper>
  </div>
</template>

<style scoped>
.property-panel {
  width: 400px;
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
