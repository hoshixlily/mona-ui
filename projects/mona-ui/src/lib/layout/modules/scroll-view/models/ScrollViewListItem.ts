import { Signal } from "@angular/core";

export interface ScrollViewListItem {
    data: any;
    position: Signal<string>;
}
