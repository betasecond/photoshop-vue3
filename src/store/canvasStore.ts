import { defineStore } from 'pinia';
import {Ref, ref} from 'vue';

export const useCanvasStore = defineStore('canvas', () => {
    // 创建 canvasRef 对象
    const canvasRef = {
        canvas: null as ref<HTMLCanvasElement | null>,
        ctx: null as ref<CanvasRenderingContext2D | null>,
        getContext() {
            return this.ctx;
        },

        getCanvas() {
            return this.canvas;
        },

        isValid() {
            return this.canvas !== null && this.ctx !== null;
        },
        isCanvasValid() {
            return this.canvas !== null;
        },
        isContextValid() {
            return this.ctx !== null;
        },
    }

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
