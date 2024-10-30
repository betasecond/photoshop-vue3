import { defineStore } from 'pinia';
import {AdjustmentToolType, DrawingToolType, EditToolType, OneClickActionToolType} from "../types/toolType";
import {WatermarkOptions} from "../types/watermarkType";
import {HSL} from "../types/HSLType";
import {CropArea} from "../types/CropAreaType";

export const usePropertyStore = defineStore('propertyStore', {
    state: () => ({
        selectedTool: DrawingToolType.Brush,
        selectedColor: '#000000',
        selectedParameter: 'Brush',
        brushSize: 10,
        eraserSize: 10,
        brightness: 50,
        contrast: 0,
        saturation: 0,
        exposure: 0,
        rotation: 0,
        hsl: {
            hue: 0,
            saturation: 0,
            lightness: 0,
        } as HSL,
        // 裁剪区域
        cropArea: {
            x: 0,
            y: 0,
            width: 1000,
            height: 1000,
        } as CropArea,
        // 水印
        watermarkOption:{
            text: "watermark" as string,             // 水印内容
            fontSize:20 as number,       // 字体大小，默认 20
            color:'#000000' as string,           // 字体颜色，默认黑色
            opacity: 0.5 as number,        // 透明度，默认 0.5
            position:{x:100,y:100} as { x: number; y: number },// 水印位置，默认右下角
        } as WatermarkOptions,
        appliedEffect: null as { type:OneClickActionToolType,id:number } | null,
        appliedAdjustment: null as {type:AdjustmentToolType,id:number} | null,
        appliedEditTool:null as {type:EditToolType,id:number} | null,
    }),
    actions: {
        // 设置当前选择的参数类型
        setSelectedParameter(parameter: string) {
            this.selectedParameter = parameter;
        },
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
        // 更新裁剪区域
        updateCropArea(newCropArea:CropArea) {
            this.cropArea = newCropArea;
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
            this.hsl.saturation = value;
        },
        // 调整曝光度
        adjustExposure(value: number) {
            this.exposure = value;
        },
        // 调整 HSL 值
        adjustHSL(hue: number, saturation: number, lightness: number) {
            this.hsl = { hue, saturation, lightness };
        },
        adjustHue(hue: number) {
            this.hsl.hue = hue;
        },
        adjustLightness(lightness: number) {
            this.hsl.lightness = lightness;
        },
        applyAdjustment(adjustment: AdjustmentToolType) {
            this.appliedAdjustment = { type: adjustment, id: Date.now() };

        },
        // 调整旋转角度
        adjustRotation(angle: number) {
            this.rotation = angle;
        },
        adjustWatermarkOption(watermarkOption: Partial<WatermarkOptions>) {
            // 部分更新
            this.watermarkOption = { ...this.watermarkOption, ...watermarkOption };
        },

        // 应用一键式效果
        applyEffect(effect: OneClickActionToolType) {
            this.appliedEffect = {type:effect,id: Date.now() };
        },
        // 重置一键式效果（在工具切换或特定操作后调用）
        resetEffect() {
            this.appliedEffect = null;
        },
        // 应用编辑工具效果
        applyEditTool(editTool: EditToolType) {
            this.appliedEditTool = {type: editTool,id:Date.now() };
        }
    },});
