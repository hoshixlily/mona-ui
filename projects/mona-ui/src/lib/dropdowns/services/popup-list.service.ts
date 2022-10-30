import { Injectable } from "@angular/core";
import { Group, List } from "@mirei/ts-collections";
import { PopupListItem } from "../data/PopupListItem";

@Injectable()
export class PopupListService {
    public constructor() {}

    public static findNextSelectableItem(
        items: List<Group<string, PopupListItem>>,
        item: PopupListItem
    ): PopupListItem | null {
        return (
            items
                .selectMany(g => g.source)
                .skipWhile(i => !i.dataEquals(item.data))
                .skip(1)
                .firstOrDefault(i => !i.disabled) ?? null
        );
    }

    public static findPreviousSelectableItem(
        items: List<Group<string, PopupListItem>>,
        item: PopupListItem
    ): PopupListItem | null {
        return (
            items
                .selectMany(g => g.source)
                .reverse()
                .skipWhile(i => !i.dataEquals(item.data))
                .skip(1)
                .firstOrDefault(i => !i.disabled) ?? null
        );
    }

    public static isFirstSelectableItem(items: List<Group<string, PopupListItem>>, item: PopupListItem): boolean {
        return PopupListService.findPreviousSelectableItem(items, item) === null;
    }

    public static isLastSelectableItem(items: List<Group<string, PopupListItem>>, item: PopupListItem): boolean {
        return PopupListService.findNextSelectableItem(items, item) === null;
    }
}
