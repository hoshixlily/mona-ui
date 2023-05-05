import { PopupListItem } from "./PopupListItem";
export interface PopupListValueChangeEvent {
    value: PopupListItem[];
    via: "selection" | "navigation";
}
