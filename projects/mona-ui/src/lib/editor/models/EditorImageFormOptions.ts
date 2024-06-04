import { FormControl } from "@angular/forms";

export interface EditorImageFormOptions {
    altText: FormControl<string | null>;
    height: FormControl<number | null>;
    link: FormControl<string>;
    width: FormControl<number | null>;
}
