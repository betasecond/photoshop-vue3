import { defineStore } from 'pinia';
import { Ref } from 'vue';

// 定义撤销重做的 Store
export const useUndoRedoStore = defineStore('undoRedo', {
    state: () => ({
        undoStack: [] as { imageData: ImageData; width: number; height: number }[], // 保存 ImageData 和尺寸
        redoStack: [] as { imageData: ImageData; width: number; height: number }[], // 保存 ImageData 和尺寸
        canvas: null as HTMLCanvasElement | null,  // Canvas 引用
        ctx: null as CanvasRenderingContext2D | null  // Canvas 上下文
    }),
    actions: {
        // 存储 Canvas 和 Context 的引用
        initializeCanvasState(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
            console.log('Received canvas in initializeCanvasState:', canvas);
            console.log('Received context in initializeCanvasState:', ctx);

            if (canvas && ctx) {
                this.canvas = canvas;
                this.ctx = ctx;
                console.log('Canvas and context references successfully stored in store.');
            } else {
                console.error('Failed to store canvas or context in store.');
            }
        },
        // 保存当前画布状态
        saveCanvasState() {
            if (this.canvas && this.ctx) {
                try {
                    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                    this.undoStack.push({
                        imageData,
                        width: this.canvas.width,
                        height: this.canvas.height
                    });
                    this.redoStack = [];  // 清空重做栈
                    console.log('Canvas state saved. Undo stack length:', this.undoStack.length);
                } catch (error) {
                    console.error('Error while saving canvas state:', error);
                }
            } else {
                console.error('Cannot save canvas state: canvas or context is not initialized.');
            }
        },
        // 撤销操作
        undo() {
            if (this.undoStack.length > 0 && this.canvas && this.ctx) {
                const lastState = this.undoStack.pop();
                if (lastState) {
                    this.redoStack.push({
                        imageData: this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
                        width: this.canvas.width,
                        height: this.canvas.height
                    });

                    // 恢复画布尺寸
                    this.canvas.width = lastState.width;
                    this.canvas.height = lastState.height;

                    // 恢复图像数据
                    this.ctx.putImageData(lastState.imageData, 0, 0);  // 从 lastState 中提取 imageData
                    console.log('Undo performed. Undo stack length:', this.undoStack.length, 'Redo stack length:', this.redoStack.length);
                }
            } else {
                console.log('No more actions to undo or canvas/context not initialized.');
            }
        },

        // 重做操作
        redo() {
            if (this.redoStack.length > 0 && this.canvas && this.ctx) {
                const lastState = this.redoStack.pop();
                if (lastState) {
                    this.undoStack.push({
                        imageData: this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
                        width: this.canvas.width,
                        height: this.canvas.height
                    });

                    // 恢复画布尺寸
                    this.canvas.width = lastState.width;
                    this.canvas.height = lastState.height;

                    // 恢复图像数据
                    this.ctx.putImageData(lastState.imageData, 0, 0);  // 从 lastState 中提取 imageData
                    console.log('Redo performed. Undo stack length:', this.undoStack.length, 'Redo stack length:', this.redoStack.length);
                }
            } else {
                console.log('No more actions to redo or canvas/context not initialized.');
            }
        }
    }
});
