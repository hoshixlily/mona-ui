import { Injectable } from "@angular/core";
import { Enumerable, Group, List } from "@mirei/ts-collections";
import { PopupListItem } from "../../models/PopupListItem";
import { SelectionMode } from "../../../models/SelectionMode";
import { ItemDisabler, ItemDisablerAction } from "../../models/ItemDisabler";
import { Subject } from "rxjs";

@Injectable()
export class PopupListService {
    public readonly scrollToListItem$: Subject<PopupListItem> = new Subject<PopupListItem>();
    public filterModeActive: boolean = false;
    public sourceListData: List<Group<string, PopupListItem>> = new List<Group<string, PopupListItem>>();
    public viewListData: List<Group<string, PopupListItem>> = new List<Group<string, PopupListItem>>();

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

    public static getItemDisablerAction(disabler: ItemDisabler): ItemDisablerAction {
        if (typeof disabler === "string") {
            return (item: any) => !!item?.[disabler] ?? false;
        }
        return disabler;
    }

    public static isFirstSelectableItem(items: List<Group<string, PopupListItem>>, item: PopupListItem): boolean {
        return PopupListService.findPreviousSelectableItem(items, item) === null;
    }

    public static isLastSelectableItem(items: List<Group<string, PopupListItem>>, item: PopupListItem): boolean {
        return PopupListService.findNextSelectableItem(items, item) === null;
    }

    public clearFilters(): void {
        this.viewListData = this.sourceListData.toList();
        this.viewListData.selectMany(g => g.source).forEach(i => i.highlighted.set(false));
        this.filterModeActive = false;
    }

    public filterItems(filter: string, selectionMode: SelectionMode): void {
        if (!filter) {
            this.clearFilters();
            return;
        }
        this.viewListData = this.sourceListData
            .select(g => {
                const filteredItems = g.source.where(i => i.text.toLowerCase().includes(filter.toLowerCase()));
                return new Group<string, PopupListItem>(g.key, filteredItems.toList());
            })
            .toList();
        if (selectionMode === "single") {
            const selectedItem = this.viewListData
                .selectMany(g => g.source)
                .where(i => i.selected())
                .firstOrDefault();
            if (selectedItem) {
                selectedItem.highlighted.set(true);
            } else {
                const firstItem = this.viewListData
                    .selectMany(g => g.source)
                    .where(i => !i.disabled)
                    .firstOrDefault();
                if (firstItem) {
                    firstItem.highlighted.set(true);
                }
            }
        } else {
            this.viewListData.selectMany(g => g.source).forEach(i => i.highlighted.set(false));
            const firstItem = this.viewListData
                .selectMany(g => g.source)
                .where(i => !i.disabled)
                .firstOrDefault();
            if (firstItem) {
                firstItem.highlighted.set(true);
            }
        }
        this.filterModeActive = true;
    }

    public getListItemsOfValues(values: any[]): PopupListItem[] {
        const popupListItems: PopupListItem[] = [];
        values.forEach(v => {
            const item = this.sourceListData.selectMany(g => g.source).firstOrDefault(i => i.dataEquals(v));
            if (item) {
                popupListItems.push(item);
            }
        });
        return popupListItems;
    }

    public initializeListData(params: {
        data: Iterable<any>;
        disabler?: ItemDisabler;
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
                value: params.valueField ? item[params.valueField] : item,
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

        const selectedItems = this.sourceListData
            .selectMany(g => g.source)
            .where(i => i.selected())
            .toList();

        this.sourceListData = listItems;
        this.viewListData = this.sourceListData.toList();

        this.sourceListData
            .selectMany(g => g.source)
            .forEach(i => {
                i.selected.set(selectedItems.any(s => s.dataEquals(i.data)));
            });

        if (params.disabler) {
            const disablerAction = PopupListService.getItemDisablerAction(params.disabler);
            this.updateDisabledItems(disablerAction);
        }

        return listItems;
    }

    public navigate(event: KeyboardEvent, selectionMode: SelectionMode): PopupListItem | null {
        const selectedItem = this.viewListData.selectMany(g => g.source).firstOrDefault(i => i.selected());
        const highlightedItem = this.viewListData.selectMany(g => g.source).firstOrDefault(i => i.highlighted());
        const firstItem = this.viewListData.selectMany(g => g.source).firstOrDefault(i => !i.disabled);
        const focusedItem = highlightedItem ?? selectedItem ?? null;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            return this.handleArrowDownKey(focusedItem, firstItem, selectionMode);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            return this.handleArrowUpKey(focusedItem, selectionMode);
        }
        return null;
    }

    public selectItem(item: PopupListItem, selectionMode: SelectionMode): void {
        if (selectionMode === "single") {
            this.viewListData.selectMany(g => g.source).forEach(i => i.selected.set(false));
            item.selected.set(true);
        } else {
            item.selected.set(!item.selected());
        }
    }

    private handleArrowDownKey(
        focusedItem: PopupListItem | null,
        firstItem: PopupListItem | null,
        selectionMode: SelectionMode
    ): PopupListItem | null {
        let newItem: PopupListItem | null = null;
        if (focusedItem && PopupListService.isLastSelectableItem(this.viewListData, focusedItem)) {
            if (this.filterModeActive && focusedItem.highlighted() && !focusedItem.selected()) {
                focusedItem.highlighted.set(false);
                focusedItem.selected.set(true);
            }
            return focusedItem;
        }
        const nextItem = !focusedItem
            ? firstItem
            : PopupListService.findNextSelectableItem(this.viewListData, focusedItem);
        if (!nextItem) {
            return null;
        }
        if (selectionMode === "single") {
            if (this.filterModeActive) {
                if (focusedItem && focusedItem.highlighted() && !focusedItem.selected()) {
                    focusedItem.highlighted.set(false);
                    focusedItem.selected.set(true);
                    newItem = focusedItem;
                    return newItem;
                } else {
                    if (focusedItem) {
                        focusedItem.selected.set(false);
                        focusedItem.highlighted.set(false);
                        nextItem.selected.set(true);
                    }
                }
            } else {
                if (focusedItem) {
                    if (focusedItem.highlighted() && !focusedItem.selected()) {
                        focusedItem.highlighted.set(false);
                        focusedItem.selected.set(true);
                        newItem = focusedItem;
                        return newItem;
                    } else {
                        focusedItem.selected.set(false);
                        focusedItem.highlighted.set(false);
                    }
                }
                nextItem.selected.set(true);
            }
        } else {
            nextItem.highlighted.set(true);
            if (focusedItem) {
                focusedItem.highlighted.set(false);
            }
        }
        newItem = nextItem;
        return newItem;
    }

    private handleArrowUpKey(focusedItem: PopupListItem | null, selectionMode: SelectionMode): PopupListItem | null {
        if (!focusedItem) {
            return null;
        }
        if (PopupListService.isFirstSelectableItem(this.viewListData, focusedItem)) {
            return focusedItem;
        }
        const previousItem = PopupListService.findPreviousSelectableItem(this.viewListData, focusedItem);
        if (!previousItem) {
            return null;
        }

        let newItem: PopupListItem | null = null;
        if (selectionMode === "single") {
            if (this.filterModeActive) {
                if (focusedItem.highlighted() && !focusedItem.selected()) {
                    focusedItem.highlighted.set(false);
                    focusedItem.selected.set(true);
                    newItem = focusedItem;
                    return newItem;
                } else {
                    focusedItem.selected.set(false);
                    focusedItem.highlighted.set(false);
                    previousItem.selected.set(true);
                }
            } else {
                if (focusedItem.highlighted() && !focusedItem.selected()) {
                    focusedItem.highlighted.set(false);
                    focusedItem.selected.set(true);
                    newItem = focusedItem;
                    return newItem;
                } else {
                    focusedItem.selected.set(false);
                    previousItem.selected.set(true);
                }
            }
        } else {
            focusedItem.highlighted.set(false);
            previousItem.highlighted.set(true);
        }
        newItem = previousItem;
        return newItem;
    }

    private updateDisabledItems(disablerAction: ItemDisablerAction): void {
        this.sourceListData.selectMany(g => g.source).forEach(i => (i.disabled = disablerAction(i.data)));
    }
}
