import { Ref } from "vue";

/**
 * 表示画布上下文的接口
 */
export interface CanvasContext {
    canvas: Ref<HTMLCanvasElement | null>; // HTML 画布元素的引用
    ctx: Ref<CanvasRenderingContext2D | null>; // 2D 渲染上下文的引用

    /**
     * 检查 canvas 和 ctx 是否有效
     * @returns {boolean} 如果两者都有效则返回 true，否则返回 false
     */
    isValid(): boolean;

    /**
     * 检查 canvas 是否有效
     * @returns {boolean} 如果 canvas 不为 null 则返回 true，否则返回 false
     */
    isCanvasValid(): boolean;

    /**
     * 检查 ctx 是否有效
     * @returns {boolean} 如果 ctx 不为 null 则返回 true，否则返回 false
     */
    isContextValid(): boolean;

    /**
     * 获取 2D 渲染上下文
     * @returns {Ref<CanvasRenderingContext2D | null>} 2D 渲染上下文
     */
    getContext(): Ref<CanvasRenderingContext2D | null>;

    /**
     * 获取 HTML 画布元素
     * @returns {Ref<HTMLCanvasElement | null>} HTML 画布元素
     */
    getCanvas(): Ref<HTMLCanvasElement | null>;
}