import { Group, List } from "@mirei/ts-collections";
import { ListItem } from "./ListItem";

export interface DataReadyEvent {
    data: List<Group<string, ListItem>>;
}
