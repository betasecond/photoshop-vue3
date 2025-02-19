/**
 * 表示不同色调映射算法的枚举
 */
export enum ToneMappingType {
    Reinhard = 'Reinhard',
    ACES = 'ACES',
    Filmic = 'Filmic',
    // 可以在此处添加更多算法
}

/**
 * 表示 Reinhard 色调映射算法参数的接口
 */
export interface ReinhardParams {
    a: number; // 暗区亮度调整（a 值）
    maxLuminance: number; // 最大亮度
}

/**
 * 表示 ACES 色调映射算法参数的接口
 */
export interface ACESParams {
    exposure: number; // 曝光值
    whitePoint: number; // 白点调整
}

/**
 * 表示 Filmic 色调映射算法参数的接口
 */
export interface FilmicParams {
    exposure: number; // 曝光值
    contrast: number; // 对比度调整
    saturation: number; // 饱和度调整
}

/**
 * 表示色调映射配置的接口
 */
export interface ToneMappingConfig {
    type: ToneMappingType; // 当前选择的色调映射类型
    params: ReinhardParams | ACESParams | FilmicParams; // 对应算法的参数
}