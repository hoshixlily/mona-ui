export type StyleToken = "*" | Record<string, string | number> | Array<"*" | Record<string, string | number>>;

export interface AnimationOptions {
    duration?: number;
    delay?: number;
    element: Element;
    endStyles: StyleToken;
    startStyles: StyleToken;
    timingFunction?: string;
}
