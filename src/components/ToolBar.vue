<script setup lang="ts">
import {AdjustmentToolType, DrawingToolType, EditToolType, OneClickActionToolType} from '../types/toolType';
import {useUndoRedoStore} from "../store/undoRedoStore";
import {adjustBrightness} from '../module/brightness'; // 引入亮度调节逻辑
import { Button as VarButton, Snackbar } from '@varlet/ui'
import '@varlet/ui/es/button/style/index'
import '@varlet/ui/es/snackbar/style/index'


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
  <var-paper :elevation="8" :width="'100%'" :height="'100%'" ripple  >
    <div class="toolbar">
      <div class ="common-group">
        <!-- 绘图工具组 -->

        <var-button type="success" @click="selectTool(DrawingToolType.Brush)" :class="{ active: selectedTool === DrawingToolType.Brush }">画笔</var-button>
        <var-button type="success" @click="selectTool(DrawingToolType.Eraser)" :class="{ active: selectedTool === DrawingToolType.Eraser }">橡皮擦</var-button>

        <!-- 一键式效果组 -->

        <var-button type="success" @click="applyEffect(OneClickActionToolType.Watermark)">水印</var-button>
        <var-button type="success" @click="applyEffect(OneClickActionToolType.Dehaze)">去雾</var-button>
        <var-button type="success" @click="applyEffect(OneClickActionToolType.FaceDetection)">人脸检测</var-button>
        <var-button type="success" @click="applyEffect(OneClickActionToolType.FaceBeautify)">人脸美化</var-button>
        <var-button type="success" @click="applyEffect(OneClickActionToolType.VarletStyle)">风格</var-button>
        <var-button type="success" @click="applyEffect(OneClickActionToolType.LocalBrightnessExposure)">局部亮度曝光</var-button>

        <!-- 编辑工具组 -->

        <var-button type="success" @click="applyEditTool(EditToolType.Rotate)">旋转</var-button>
        <var-button type="success" @click="applyEditTool(EditToolType.Crop)">裁剪</var-button>

        <!-- 撤销和重做按钮 -->

        <var-button type="success" @click="undo" :disabled="!canUndo">撤销</var-button>
        <var-button type="success" @click="redo" :disabled="!canRedo">重做</var-button>

      </div>
      <!-- 参数调整组 -->
      <div class="adjustment-group">
        <var-button type="success" @click="applyAdjust(AdjustmentToolType.Contrast)">对比度</var-button>
        <var-button type="success" @click="applyAdjust(AdjustmentToolType.Exposure)">曝光</var-button>
        <var-button type="success" @click="applyAdjust(AdjustmentToolType.Saturation)">饱和度</var-button>
        <var-button type="success" @click="applyAdjust(AdjustmentToolType.HSL)">HSL</var-button>
        <var-button type="success" @click="applyAdjust(AdjustmentToolType.Brightness)">亮度</var-button>
        <var-button type="success" @click="applyAdjust(AdjustmentToolType.Sharpen)">锐化</var-button>
        <var-button type="success" @click="applyAdjust(AdjustmentToolType.HistogramEqualization)">直方图均衡化</var-button>
        <var-button type="success" @click="applyAdjust(AdjustmentToolType.Smoothing)">平滑</var-button>
        <var-button type="success" @click="applyAdjust(AdjustmentToolType.CurveAdjustment)">曲线调整</var-button>
        <var-button type="success" @click="applyAdjust(AdjustmentToolType.ToneMapping)">色调映射</var-button>
        <var-button type="success" @click="applyAdjust(AdjustmentToolType.ColorTemperature)">色温</var-button>
      </div>

    </div>
  </var-paper>
</template>

<style scoped>
.toolbar {
  display: flex;
  padding: 10px;

  border-bottom: 1px solid #ccc;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  cursor: pointer;
  width: 150px; /* 根据需要调整宽度 */
}

button.active {
  background-color: #007bff;
  color: white;
}



.toolbar {
  display: flex;
  flex-direction: column;
  gap: 10px; /* 控制每行之间的间距 */
}

.tool-group, .effect-group, .adjustment-group, .edit-group, .undo-redo,.common-group {
  display: flex;
  gap: 10px;
}

.color-picker {
  display: flex;
  align-items: center;
}



input[type="color"] {
  padding: 0;
  width: 40px;
}

</style>
