import { defineStore } from 'pinia';
import { AdjustmentToolType, DrawingToolType, EditToolType, OneClickActionToolType } from "../types/toolType";
import { WatermarkOptions } from "../types/watermarkType";
import { HSL } from "../types/HSLType";
import { CropArea } from "../types/cropAreaType";
import { CurveAdjustmentState } from "../types/curveType";
import { ACESParams, FilmicParams, ReinhardParams, ToneMappingConfig, ToneMappingType } from "../types/toneMappingConfigType";
import { VarletStyle } from "../types/varletStyleType";

/**
 * 定义一个 Pinia store，用于管理各种属性的状态
 */
export const usePropertyStore = defineStore('propertyStore', {
    state: () => ({
        selectedTool: DrawingToolType.Brush, // 当前选中的绘图工具
        selectedColor: '#000000', // 当前选中的颜色
        selectedParameter: 'Brush', // 当前选中的参数
        selectVarletStyle: VarletStyle.md3Light as VarletStyle, // 当前选中的 Varlet 样式
        selectedParameterList: [], // 选中的参数列表
        brushSize: 10, // 画笔大小
        eraserSize: 10, // 橡皮擦大小
        brightness: 50, // 亮度
        contrast: 0, // 对比度
        saturation: 0, // 饱和度
        exposure: 0, // 曝光度
        rotation: 0, // 旋转角度
        intensity: 1, // 强度
        smoothingRadius: 5, // 平滑半径
        dehazeStrength: 0, // 去雾强度
        hsl: {
            hue: 0,
            saturation: 0,
            lightness: 0,
        } as HSL, // HSL 颜色模型
        cropArea: {
            x: 0,
            y: 0,
            width: 1000,
            height: 1000,
        } as CropArea, // 裁剪区域
        lightX: 0, // 光源 X 坐标
        lightY: 0, // 光源 Y 坐标
        lightStrength: 100, // 光照强度
        colorTemperature: 0 as number, // 色温，范围从-100到100
        watermarkOption: {
            text: "watermark" as string, // 水印内容
            fontSize: 20 as number, // 字体大小，默认 20
            color: '#000000' as string, // 字体颜色，默认黑色
            opacity: 0.5 as number, // 透明度，默认 0.5
            position: { x: 100, y: 100 } as { x: number; y: number }, // 水印位置，默认右下角
        } as WatermarkOptions, // 水印选项
        curveAdjustment: {
            redCurve: [{ input: 0, output: 0 }, { input: 128, output: 128 }, { input: 255, output: 255 }],
            greenCurve: [{ input: 0, output: 0 }, { input: 128, output: 128 }, { input: 255, output: 255 }],
            blueCurve: [{ input: 0, output: 0 }, { input: 128, output: 128 }, { input: 255, output: 255 }],
        } as CurveAdjustmentState, // 曲线调整状态
        toneMappingConfig: {
            type: ToneMappingType.Reinhard, // 默认选择 Reinhard 算法
            params: {
                a: 0.18, // Reinhard 算法的默认暗区亮度调整
                maxLuminance: 1.0, // 最大亮度
            } as ReinhardParams, // 默认使用 Reinhard 算法的参数
        } as ToneMappingConfig, // 色调映射配置
        selectedChannel: 'red' | 'green' | 'blue', // 当前选中的通道
        appliedEffect: null as { type: OneClickActionToolType, id: number } | null, // 应用的一键式效果
        appliedAdjustment: null as { type: AdjustmentToolType, id: number } | null, // 应用的调整工具效果
        appliedEditTool: null as { type: EditToolType, id: number } | null, // 应用的编辑工具效果
    }),
    actions: {
        /**
         * 设置当前选择的参数类型
         * @param {string} parameter - 参数类型
         */
        setSelectedParameter(parameter: string) {
            const index = this.selectedParameterList.indexOf(parameter);
            if (index === -1) {
                // 如果没有选中，则添加
                this.selectedParameterList.push(parameter);
            } else {
                // 如果已选中，则移除
                this.selectedParameterList.splice(index, 1);
            }
        },

        /**
         * 检查当前参数是否已选中
         * @param {string} parameter - 参数类型
         * @returns {boolean} 如果参数已选中则返回 true，否则返回 false
         */
        checkSelectedParameter(parameter: string): boolean {
            return this.selectedParameterList.includes(parameter);
        },

        /**
         * 更新当前选中的工具
         * @param {DrawingToolType} tool - 绘图工具类型
         */
        updateTool(tool: DrawingToolType) {
            this.selectedTool = tool;
        },

        /**
         * 更新画笔颜色
         * @param {string} color - 颜色值
         */
        updateColor(color: string) {
            this.selectedColor = color;
        },

        /**
         * 更新画笔大小
         * @param {number} size - 画笔大小
         */
        updateBrushSize(size: number) {
            this.brushSize = size;
        },

        /**
         * 更新橡皮擦大小
         * @param {number} size - 橡皮擦大小
         */
        updateEraserSize(size: number) {
            this.eraserSize = size;
        },

        /**
         * 更新裁剪区域
         * @param {CropArea} newCropArea - 新的裁剪区域
         */
        updateCropArea(newCropArea: CropArea) {
            this.cropArea = newCropArea;
        },

        /**
         * 调整亮度
         * @param {number} value - 亮度值
         */
        adjustBrightness(value: number) {
            this.brightness = value;
        },

        /**
         * 调整对比度
         * @param {number} value - 对比度值
         */
        adjustContrast(value: number) {
            this.contrast = value;
        },

        /**
         * 调整饱和度
         * @param {number} value - 饱和度值
         */
        adjustSaturation(value: number) {
            this.saturation = value;
            this.hsl.saturation = value;
        },

        /**
         * 调整曝光度
         * @param {number} value - 曝光度值
         */
        adjustExposure(value: number) {
            this.exposure = value;
        },

        /**
         * 调整 HSL 值
         * @param {number} hue - 色相值
         * @param {number} saturation - 饱和度值
         * @param {number} lightness - 亮度值
         */
        adjustHSL(hue: number, saturation: number, lightness: number) {
            this.hsl = { hue, saturation, lightness };
        },

        /**
         * 调整色相
         * @param {number} hue - 色相值
         */
        adjustHue(hue: number) {
            this.hsl.hue = hue;
        },

        /**
         * 调整亮度
         * @param {number} lightness - 亮度值
         */
        adjustLightness(lightness: number) {
            this.hsl.lightness = lightness;
        },

        /**
         * 调整去雾强度
         * @param {number} dehazeStrength - 去雾强度值
         */
        adjustDehazeStrength(dehazeStrength: number) {
            this.dehazeStrength = dehazeStrength;
        },

        /**
         * 更新锐化强度
         * @param {number} intensity - 锐化强度值
         */
        adjustIntensity(intensity: number) {
            this.intensity = intensity;
        },

        /**
         * 应用调整工具效果
         * @param {AdjustmentToolType} adjustment - 调整工具类型
         */
        applyAdjustment(adjustment: AdjustmentToolType) {
            this.appliedAdjustment = { type: adjustment, id: Date.now() };
        },

        /**
         * 统一设置光照效果
         * @param {{x: number, y: number, strength: number}} param0 - 光照效果参数
         */
        setLightingEffect({ x, y, strength }: { x: number, y: number, strength: number }) {
            this.lightX = x;
            this.lightY = y;
            this.lightStrength = strength;
        },

        /**
         * 调整平滑半径
         * @param {number} radius - 平滑半径值
         */
        adjustSmoothingRadius(radius: number) {
            this.smoothingRadius = radius;
        },

        /**
         * 调整旋转角度
         * @param {number} angle - 旋转角度值
         */
        adjustRotation(angle: number) {
            this.rotation = angle;
        },

        /**
         * 更新水印选项
         * @param {Partial<WatermarkOptions>} watermarkOption - 部分水印选项
         */
        adjustWatermarkOption(watermarkOption: Partial<WatermarkOptions>) {
            this.watermarkOption = { ...this.watermarkOption, ...watermarkOption };
        },

        /**
         * 更新曲线调整
         * @param {'red' | 'green' | 'blue'} channel - 颜色通道
         */
        updateCurveAdjustment(channel: 'red' | 'green' | 'blue') {
            this.selectedChannel = channel;
        },

        /**
         * 更新曲线控制点
         * @param {'red' | 'green' | 'blue'} channel - 颜色通道
         * @param {number} index - 控制点索引
         * @param {number} value - 控制点值
         */
        updateCurve(channel: 'red' | 'green' | 'blue', index: number, value: number) {
            const curve = this.curveAdjustment[channel + 'Curve'];
            curve[index].output = value;
            this.curveAdjustment[channel + 'Curve'] = [...curve]; // 强制视图更新
            this.updateCurveAdjustment(channel);
        },

        /**
         * 更新色温
         * @param {number} colorTemperature - 色温值
         */
        updateColorTemperature(colorTemperature: number) {
            this.colorTemperature = colorTemperature;
        },

        /**
         * 更新选择样式
         * @param {VarletStyle} varletStyle - Varlet 样式
         */
        updateVarletStyle(varletStyle: VarletStyle) {
            this.varletStyle = varletStyle;
        },

        /**
         * 设置色调映射类型
         * @param {ToneMappingType} type - 色调映射类型
         */
        setToneMappingType(type: ToneMappingType) {
            this.toneMappingConfig.type = type;
            // 根据类型更新参数
            switch (type) {
                case ToneMappingType.Reinhard:
                    this.toneMappingConfig.params = { a: 0.05, maxLuminance: 2 } as ReinhardParams;
                    break;
                case ToneMappingType.ACES:
                    this.toneMappingConfig.params = { exposure: 2, whitePoint: 1.2 } as ACESParams;
                    break;
                case ToneMappingType.Filmic:
                    this.toneMappingConfig.params = { exposure: 3, contrast: 1.2, saturation: 1.2 } as FilmicParams;
                    break;
            }
        },

        /**
         * 设置色调映射参数
         * @param {ReinhardParams | ACESParams | FilmicParams} params - 色调映射参数
         */
        setToneMappingParams(params: ReinhardParams | ACESParams | FilmicParams) {
            this.toneMappingConfig.params = params;
        },

        /**
         * 应用一键式效果
         * @param {OneClickActionToolType} effect - 一键式效果类型
         */
        applyEffect(effect: OneClickActionToolType) {
            this.appliedEffect = { type: effect, id: Date.now() };
        },

        /**
         * 重置一键式效果
         */
        resetEffect() {
            this.appliedEffect = null;
        },

        /**
         * 应用编辑工具效果
         * @param {EditToolType} editTool - 编辑工具类型
         */
        applyEditTool(editTool: EditToolType) {
            this.appliedEditTool = { type: editTool, id: Date.now() };
        }
    },
});