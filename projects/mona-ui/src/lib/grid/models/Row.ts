import { signal, WritableSignal } from "@angular/core";
import { Dictionary } from "@mirei/ts-collections";
import { FormGroup } from "@angular/forms";
import { v4 } from "uuid";

export class Row {
    readonly #editFromDictionary = new Dictionary<string, FormGroup>();
    public readonly uid = v4();
    public data: Record<string, any> = {};
    public detailVisible = signal(false);
    public selected = signal(false);
    public constructor(data: Record<string, any>) {
        this.data = data;
    }

    public getEditForm(key: string): FormGroup | null {
        return this.#editFromDictionary.get(key);
    }

    public setEditForm(key: string, form: FormGroup): void {
        this.#editFromDictionary.put(key, form);
    }
}

export class VirtualGroupRow {
    public readonly text: string;
    public constructor(text: string) {
        this.text = text;
    }
}
