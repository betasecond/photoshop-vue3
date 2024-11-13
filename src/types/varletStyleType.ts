import {Themes} from '@varlet/ui'

export enum VarletStyle {
    Dark = Themes.dark,
    md3Light = Themes.md3Light,
    md3Dark = Themes.md3Dark,
}
export function getEnumKeyByValue(enumObj: any, value: any): string | undefined {
    const entry = Object.entries(enumObj).find(([key, val]) => val === value);
    return entry ? entry[0] : undefined;  // 返回找到的枚举键
}