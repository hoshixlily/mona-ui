import { Injectable } from "@angular/core";
import { Enumerable, Group, List } from "@mirei/ts-collections";
import { PopupListItem } from "../data/PopupListItem";
import { SelectionMode } from "../../models/SelectionMode";

@Injectable()
export class PopupListService {
    public listData: List<Group<string, PopupListItem>> = new List<Group<string, PopupListItem>>();

    public constructor() {}

    public static findFirstSelectedItem(items: List<Group<string, PopupListItem>>): PopupListItem | null {
        return items.selectMany(g => g.source).firstOrDefault(i => i.selected);
    }

    public static findLastSelectedItem(items: List<Group<string, PopupListItem>>): PopupListItem | null {
        return items.selectMany(g => g.source).lastOrDefault(i => i.selected);
    }

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

    public navigate(event: KeyboardEvent, selectionMode: SelectionMode): PopupListItem | null {
        const selectedItem = this.listData.selectMany(g => g.source).firstOrDefault(i => i.selected);
        const highlightedItem = this.listData.selectMany(g => g.source).firstOrDefault(i => i.highlighted);
        const firstItem = this.listData.selectMany(g => g.source).firstOrDefault();
        const focusedItem = highlightedItem ?? selectedItem ?? null;
        let newItem: PopupListItem | null = null;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (focusedItem && PopupListService.isLastSelectableItem(this.listData, focusedItem)) {
                return focusedItem;
            }
            const nextItem = !focusedItem
                ? firstItem
                : PopupListService.findNextSelectableItem(this.listData, focusedItem);
            if (nextItem) {
                if (selectionMode === "single") {
                    nextItem.selected = true;
                    if (focusedItem) {
                        focusedItem.selected = false;
                    }
                } else {
                    nextItem.highlighted = true;
                    if (focusedItem) {
                        focusedItem.highlighted = false;
                    }
                }
                newItem = nextItem;
            }
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (focusedItem) {
                if (PopupListService.isFirstSelectableItem(this.listData, focusedItem)) {
                    return focusedItem;
                }
                const previousItem = PopupListService.findPreviousSelectableItem(this.listData, focusedItem);
                if (previousItem) {
                    if (selectionMode === "single") {
                        focusedItem.selected = false;
                        previousItem.selected = true;
                    } else {
                        focusedItem.highlighted = false;
                        previousItem.highlighted = true;
                    }
                    newItem = previousItem;
                    // this.scrollToItem(previousItem);
                }
            }
        }
        return newItem;
    }

    public selectItem(item: PopupListItem | any): void {
        if (item instanceof PopupListItem) {
            this.listData.selectMany(g => g.source).forEach(i => (i.selected = i.dataEquals(item.data)));
        } else {
            this.listData.selectMany(g => g.source).forEach(i => (i.selected = i.dataEquals(item)));
        }
    }

    public selectNextItem(item: PopupListItem): PopupListItem | null {
        if (PopupListService.isLastSelectableItem(this.listData, item)) {
            return null;
        }
        const nextItem = PopupListService.findNextSelectableItem(this.listData, item);
        if (nextItem) {
            this.selectItem(nextItem);
        }
        return nextItem;
    }

    public selectPreviousItem(item: PopupListItem): PopupListItem | null {
        if (PopupListService.isFirstSelectableItem(this.listData, item)) {
            return null;
        }
        const previousItem = PopupListService.findPreviousSelectableItem(this.listData, item);
        if (previousItem) {
            this.selectItem(previousItem);
        }
        return previousItem;
    }

    public initializeListData(params: {
        data: Iterable<any>;
        textField?: string;
        valueField?: string;
        groupField?: string;
    }): List<Group<string, any>> {
        let listItems: List<Group<string, PopupListItem>> = new List<Group<string, PopupListItem>>();
        const createListItem = (item: any): PopupListItem => {
            return new PopupListItem({
                data: item,
                text: params.textField ? item[params.textField] : item,
                textField: params.textField,
                value: params.valueField ? item[params.valueField] : params.valueField,
                valueField: params.valueField
            });
        };
        if (params.groupField) {
            listItems = Enumerable.from(params.data)
                .groupBy(d => d[params.groupField as string])
                .select(g => new Group<string, any>(g.key, g.select(d => createListItem(d)).toList()))
                .orderBy(g => g.key)
                .toList();
        } else {
            const items = Enumerable.from(params.data)
                .select(d => createListItem(d))
                .toList();
            listItems.add(new Group<string, any>("", items));
        }

        this.listData = listItems;

        // item disabler code here
        return listItems;
    }

    // public updateHighlightedValues(values: any[]): void {
    //     this.listData.forEach(g => {
    //         g.source.forEach(i => {
    //             i.highlighted = values.some(v => i.dataEquals(v));
    //         });
    //     });
    // }
    //
    // public updateSelectedValues(values: any[]): void {
    //     this.listData.forEach(g => {
    //         g.source.forEach(i => {
    //             i.selected = values.some(v => i.dataEquals(v));
    //         });
    //     });
    // }
}
