import { signal, WritableSignal } from "@angular/core";

export interface StepOptions<T = any> {
    data?: T;
    label: string;
}

export class Step<T = any> {
    public active: WritableSignal<boolean> = signal(false);
    public index: number = 0;

    public constructor(public readonly options: StepOptions<T>) {}
}
