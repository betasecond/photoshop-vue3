import { defineStore } from 'pinia';
import {DrawingToolType, OneClickActionToolType} from "../module/toolType";

export const usePropertyStore = defineStore('propertyStore', {
    state: () => ({
        selectedTool: DrawingToolType.Brush,
        selectedColor: '#000000',
        brushSize: 10,
        eraserSize: 10,
        brightness: 50,
        contrast: 0,
        saturation: 0,
        exposure: 0,
        hsl: {
            hue: 0,
            saturation: 0,
            lightness: 0,
        },
        appliedEffect: null as OneClickActionToolType | null,
    }),
    actions: {
        // 更新当前选中的工具
        updateTool(tool: DrawingToolType) {
            this.selectedTool = tool;
        },
        // 更新画笔颜色
        updateColor(color: string) {
            this.selectedColor = color;
        },
        // 更新画笔大小
        updateBrushSize(size: number) {
            this.brushSize = size;
        },
        // 更新橡皮擦大小
        updateEraserSize(size: number) {
            this.eraserSize = size;
        },
        // 调整亮度
        adjustBrightness(value: number) {
            this.brightness = value;
        },
        // 调整对比度
        adjustContrast(value: number) {
            this.contrast = value;
        },
        // 调整饱和度
        adjustSaturation(value: number) {
            this.saturation = value;
        },
        // 调整曝光度
        adjustExposure(value: number) {
            this.exposure = value;
        },
        // 调整 HSL 值
        adjustHSL(hue: number, saturation: number, lightness: number) {
            this.hsl = { hue, saturation, lightness };
        },
        // 应用一键式效果
        applyEffect(effect: OneClickActionToolType) {
            this.appliedEffect = effect;
        },
        // 重置一键式效果（在工具切换或特定操作后调用）
        resetEffect() {
            this.appliedEffect = null;
        },
    },});
