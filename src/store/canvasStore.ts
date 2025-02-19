import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

/**
 * 定义一个 Pinia store，用于管理画布的状态
 */
export const useCanvasStore = defineStore('canvas', () => {
    /**
     * 创建 canvasRef 对象，包含画布元素和 2D 渲染上下文的引用
     * @type {{canvas: Ref<HTMLCanvasElement | null>, ctx: Ref<CanvasRenderingContext2D | null>, getContext: function(): Ref<CanvasRenderingContext2D | null>, getCanvas: function(): Ref<HTMLCanvasElement | null>, isValid: function(): boolean, isCanvasValid: function(): boolean, isContextValid: function(): boolean}}
     */
    const canvasRef = {
        canvas: null as Ref<HTMLCanvasElement | null>, // HTML 画布元素的引用
        ctx: null as Ref<CanvasRenderingContext2D | null>, // 2D 渲染上下文的引用

        /**
         * 获取 2D 渲染上下文的方法
         * @returns {Ref<CanvasRenderingContext2D | null>} 2D 渲染上下文
         */
        getContext() {
            return this.ctx;
        },

        /**
         * 获取 HTML 画布元素的方法
         * @returns {Ref<HTMLCanvasElement | null>} HTML 画布元素
         */
        getCanvas() {
            return this.canvas;
        },

        /**
         * 检查 canvas 和 ctx 是否有效
         * @returns {boolean} 如果两者都有效则返回 true，否则返回 false
         */
        isValid() {
            return this.canvas !== null && this.ctx !== null;
        },

        /**
         * 检查 canvas 是否有效
         * @returns {boolean} 如果 canvas 不为 null 则返回 true，否则返回 false
         */
        isCanvasValid() {
            return this.canvas !== null;
        },

        /**
         * 检查 ctx 是否有效
         * @returns {boolean} 如果 ctx 不为 null 则返回 true，否则返回 false
         */
        isContextValid() {
            return this.ctx !== null;
        },
    }

    /**
     * 初始化画布的方法，接收一个 HTMLCanvasElement 作为参数
     * @param {HTMLCanvasElement | null} canvasElement - HTML 画布元素
     */
    const initializeCanvas = (canvasElement: HTMLCanvasElement | null) => {
        if (canvasElement) {
            canvasRef.value.canvas = canvasElement;
            canvasRef.value.ctx = canvasElement.getContext('2d');
        }
    };

    // 返回需要共享的状态和方法
    return {
        canvasRef,
        initializeCanvas,
    };
});