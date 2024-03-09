import { WritableSignal } from "@angular/core";

export interface SplitterPane {
    panelUid: string;
    size: WritableSignal<string>;
}
