// 色调映射算法类型
export enum ToneMappingType {
    Reinhard = 'Reinhard',
    ACES = 'ACES',
    Filmic = 'Filmic',
    // 可以添加更多的算法
}

// Reinhard 算法的参数结构
export interface ReinhardParams {
    a: number; // 暗区亮度调整（a值）
    maxLuminance: number; // 最大亮度
}

// ACES 算法的参数结构
export interface ACESParams {
    exposure: number; // 曝光值
    whitePoint: number; // 白点调整
}

// Filmic 算法的参数结构
export interface FilmicParams {
    exposure: number; // 曝光值
    contrast: number; // 对比度
    saturation: number; // 饱和度
}

// 色调映射配置结构
export interface ToneMappingConfig {
    type: ToneMappingType; // 当前选择的色调映射类型
    params: ReinhardParams | ACESParams | FilmicParams; // 对应算法的参数
}
