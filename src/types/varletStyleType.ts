import {Themes} from '@varlet/ui'

export enum VarletStyle {
    Dark = Themes.dark,
    md3Light = Themes.md3Light,
    md3Dark = Themes.md3Dark,
}

const varletStyleDisplayMap: Record<VarletStyle, string> = {
    [VarletStyle.Dark]: '暗黑主题',
    [VarletStyle.md3Light]: 'MD3 明亮主题',
    [VarletStyle.md3Dark]: 'MD3 暗黑主题',
};
export function getEnumKeyByValue(enumObj: any, value: any): string | undefined {
    const entry = Object.entries(enumObj).find(([key, val]) => val === value);
    return entry ? entry[0] : undefined;  // 返回找到的枚举键
}

export function getVarletStyleDisplay(value: VarletStyle): string {
    const stringifiedValue = JSON.stringify(value);

    const varletStyleDisplayMap = {
        [JSON.stringify(VarletStyle.Dark)]: '暗黑主题',
        [JSON.stringify(VarletStyle.md3Light)]: 'MD3 明亮主题',
        [JSON.stringify(VarletStyle.md3Dark)]: 'MD3 暗黑主题',
    };

    return varletStyleDisplayMap[stringifiedValue] || '未知样式';
}
