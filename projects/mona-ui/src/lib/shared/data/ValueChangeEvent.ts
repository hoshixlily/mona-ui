import { ListItem } from "./ListItem";

export interface ValueChangeEvent {
    value: ListItem[];
    via?: "navigation" | "selection";
}
