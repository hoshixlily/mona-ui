import { signal, WritableSignal } from "@angular/core";

export class ListViewItem<T = any> {
    public data: T;
    public focused: WritableSignal<boolean> = signal(false);
    public selected: WritableSignal<boolean> = signal(false);

    public constructor(data: T) {
        this.data = data;
    }
}
