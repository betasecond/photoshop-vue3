import { defineStore } from 'pinia';
import { Ref } from 'vue';

// 定义撤销重做的 Store
export const useUndoRedoStore = defineStore('undoRedo', {
    state: () => ({
        undoStack: [] as ImageData[], // 撤销堆栈
        redoStack: [] as ImageData[], // 重做堆栈
        canvas: null as HTMLCanvasElement | null,  // Canvas 引用
        ctx: null as CanvasRenderingContext2D | null  // Canvas 上下文
    }),
    actions: {
// 仅存储 Canvas 和 Context 的引用
        // 存储 Canvas 和 Context 的引用
        initializeCanvasState(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
            // 添加更多日志，检查传入的 canvas 和 ctx 是否有值
            console.log('Received canvas in initializeCanvasState:', canvas);
            console.log('Received context in initializeCanvasState:', ctx);

            if (canvas && ctx) {
                this.canvas = canvas;
                this.ctx = ctx;
                console.log('Canvas and context references successfully stored in store.');
                console.log('Stored Canvas value in store:', this.canvas);
                console.log('Stored Context value in store:', this.ctx);
            } else {
                console.error('Failed to store canvas or context in store.');
                console.log('Canvas value in store:', this.canvas); // 检查 store 中的 canvas
                console.log('Context value in store:', this.ctx);   // 检查 store 中的 ctx
            }
        },
        // 保存当前画布状态
        saveCanvasState() {
            if (this.canvas && this.ctx) {
                try {
                    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                    this.undoStack.push(imageData);
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
                const imageData = this.undoStack.pop();
                if (imageData) {
                    this.redoStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
                    this.ctx.putImageData(imageData, 0, 0);
                    console.log('Undo performed. Undo stack length:', this.undoStack.length, 'Redo stack length:', this.redoStack.length);
                }
            } else {
                console.log('No more actions to undo or canvas/context not initialized.');
            }
        },

        // 重做操作
        redo() {
            if (this.redoStack.length > 0 && this.canvas && this.ctx) {
                const imageData = this.redoStack.pop();
                if (imageData) {
                    this.undoStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
                    this.ctx.putImageData(imageData, 0, 0);
                    console.log('Redo performed. Undo stack length:', this.undoStack.length, 'Redo stack length:', this.redoStack.length);
                }
            } else {
                console.log('No more actions to redo or canvas/context not initialized.');
            }
        }
    }
});
