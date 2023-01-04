export interface StepOptions<T = any> {
    data?: T;
    label: string;
}

export class Step<T = any> {
    public active: boolean = false;
    public data?: T;
    public index: number = 0;
    public label: string = "";

    public constructor(public readonly options: StepOptions<T>) {
        this.data = options.data;
        this.label = options.label;
    }
}
