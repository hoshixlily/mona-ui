export type StyleToken =
    | "*"
    | {
          [key: string]: string | number;
      }
    | Array<
          | "*"
          | {
                [key: string]: string | number;
            }
      >;

export interface AnimationOptions {
    duration: number;
    delay?: number;
    element: HTMLElement;
    endStyles: StyleToken;
    startStyles: StyleToken;
    timingFunction: string;
}
