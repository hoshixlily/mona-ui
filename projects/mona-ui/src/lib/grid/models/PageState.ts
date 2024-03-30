import { WritableSignal } from "@angular/core";

export interface PageState {
    page: WritableSignal<number>;
    skip: WritableSignal<number>;
    take: WritableSignal<number>;
}
