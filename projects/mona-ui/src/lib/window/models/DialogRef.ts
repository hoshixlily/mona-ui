import { Observable } from "rxjs";
import { DialogResult } from "./DialogResult";

export interface DialogRef {
    close: () => void;
    result: Observable<DialogResult>;
}
