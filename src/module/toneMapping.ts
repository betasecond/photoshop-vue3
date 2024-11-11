import { useUndoRedoStore } from "../store/undoRedoStore";
import {ACESParams, FilmicParams, ReinhardParams, ToneMappingType} from "../types/ToneMappingConfigType";
import {applyReinhard} from  "./toneMappingFunction/reinhard"
import {applyACES} from "./toneMappingFunction/ACES";
import {applyFilmic} from "./toneMappingFunction/filmic";
import {CanvasContext} from "../types/ContextType";
export function applyToneMapping(
{ canvas, ctx }: CanvasContext,
    type: ToneMappingType, params: ReinhardParams | ACESParams | FilmicParams
) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }
    undoRedoStore.saveCanvasState();
    // 获取当前图像数据
    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;


    // 根据选择的色调映射类型应用不同的算法
    const toneMappingFunction = (r: number, g: number, b: number) => {
        switch (type) {
            case 'Reinhard':
                // 判断 params 是否符合 ReinhardParams 类型
                if ('a' in params && 'maxLuminance' in params) {
                    return applyReinhard(r, g, b, params);
                }
                // 如果不符合 ReinhardParams 类型，返回原色
                return [r, g, b];

            case 'ACES':
                // 判断 params 是否符合 ACESParams 类型
                if ('exposure' in params && 'whitePoint' in params) {
                    return applyACES(r, g, b, params);
                }
                return [r, g, b];

            case 'Filmic':
                // 判断 params 是否符合 FilmicParams 类型
                if ('exposure' in params && 'contrast' in params && 'saturation' in params) {
                    return applyFilmic(r, g, b, params);
                }
                return [r, g, b];

            default:
                return [r, g, b]; // 默认返回原色
        }
    };

    // 遍历像素数据并应用色调映射
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i] / 255; // Red channel (归一化到[0, 1])
        let g = data[i + 1] / 255; // Green channel
        let b = data[i + 2] / 255; // Blue channel

        // 应用色调映射算法
        [r, g, b] = toneMappingFunction(r, g, b);

        // 恢复到[0, 255]并更新像素数据
        data[i] = Math.min(255, Math.max(0, r * 255));
        data[i + 1] = Math.min(255, Math.max(0, g * 255));
        data[i + 2] = Math.min(255, Math.max(0, b * 255));
    }

    // 更新画布数据
    ctx.value.putImageData(imageData, 0, 0);

}
