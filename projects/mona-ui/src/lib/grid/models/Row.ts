import { Dictionary } from "@mirei/ts-collections";
import { FormGroup } from "@angular/forms";
import { v4 } from "uuid";

export class Row {
    readonly #editFromDictionary: Dictionary<string, FormGroup> = new Dictionary<string, FormGroup>();
    public readonly uid: string = v4();
    public data: Record<string, any> = {};
    public selected: boolean = false;
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
