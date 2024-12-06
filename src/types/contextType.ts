import {Ref} from "vue";

export interface CanvasContext {
    canvas: Ref<HTMLCanvasElement | null>;
    ctx: Ref<CanvasRenderingContext2D | null>;

    // 检查 canvas 和 ctx 是否有效
    isValid(): boolean;

    // 检查 canvas 是否有效（为 null 表示无效）
    isCanvasValid(): boolean;

    // 检查 ctx 是否有效（为 null 表示无效）
    isContextValid(): boolean;

    getContext(): Ref<CanvasRenderingContext2D | null>;

    getCanvas():Ref<HTMLCanvasElement | null>;
}