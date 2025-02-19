import { Themes } from '@varlet/ui';

/**
 * 表示不同 Varlet 样式的枚举
 */
export enum VarletStyle {
    Dark = Themes.dark,
    md3Light = Themes.md3Light,
    md3Dark = Themes.md3Dark,
}

/**
 * Varlet 样式与其显示名称的映射
 */
const varletStyleDisplayMap: Record<VarletStyle, string> = {
    [VarletStyle.Dark]: '暗黑主题',
    [VarletStyle.md3Light]: 'MD3 明亮主题',
    [VarletStyle.md3Dark]: 'MD3 暗黑主题',
};

/**
 * 根据枚举值获取其键
 * @param enumObj - 枚举对象
 * @param value - 要查找键的值
 * @returns {string | undefined} 枚举键，如果未找到则返回 undefined
 */
export function getEnumKeyByValue(enumObj: any, value: any): string | undefined {
    const entry = Object.entries(enumObj).find(([key, val]) => val === value);
    return entry ? entry[0] : undefined; // 返回找到的枚举键
}

/**
 * 获取 Varlet 样式的显示名称
 * @param value - Varlet 样式值
 * @returns {string} Varlet 样式的显示名称
 */
export function getVarletStyleDisplay(value: VarletStyle): string {
    const stringifiedValue = JSON.stringify(value);

    const varletStyleDisplayMap = {
        [JSON.stringify(VarletStyle.Dark)]: '暗黑主题',
        [JSON.stringify(VarletStyle.md3Light)]: 'MD3 明亮主题',
        [JSON.stringify(VarletStyle.md3Dark)]: 'MD3 暗黑主题',
    };

    return varletStyleDisplayMap[stringifiedValue] || '未知样式';
}