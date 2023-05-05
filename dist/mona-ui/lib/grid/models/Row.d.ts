import { FormGroup } from "@angular/forms";
export declare class Row {
    #private;
    readonly uid: string;
    data: Record<string, any>;
    selected: boolean;
    constructor(data: Record<string, any>);
    getEditForm(key: string): FormGroup;
    setEditForm(key: string, form: FormGroup): void;
}
