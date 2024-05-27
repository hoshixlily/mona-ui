import { ListItem } from "./ListItem";

export interface SelectionChangeEvent<T> {
    item: ListItem<T>;
    source: SelectionSource;
}

export type SelectionSource = { source: "mouse" } | { source: "keyboard"; key: string };
