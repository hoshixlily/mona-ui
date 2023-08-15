import { signal, WritableSignal } from "@angular/core";

export class ListViewItem<T = any> {
    public data: T;
    public focused: WritableSignal<boolean> = signal(false);
    public selected: WritableSignal<boolean> = signal(false);

    public constructor(data: T) {
        this.data = data;
    }

    public equals(other: ListViewItem<T>, viaField?: string | number | symbol): boolean {
        if (viaField) {
            return (this.data as any)[viaField] === (other.data as any)[viaField];
        }
        return this.data === other.data;
    }
}
