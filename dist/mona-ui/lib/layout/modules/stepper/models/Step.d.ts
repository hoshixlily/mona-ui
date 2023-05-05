export interface StepOptions<T = any> {
    data?: T;
    label: string;
}
export declare class Step<T = any> {
    readonly options: StepOptions<T>;
    active: boolean;
    index: number;
    constructor(options: StepOptions<T>);
}
