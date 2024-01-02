import { computed, EventEmitter, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { from, IEnumerable, ImmutableSet, Predicate, Selector } from "@mirei/ts-collections";
import { ReplaySubject } from "rxjs";
import { FilterChangeEvent } from "../../filter-input/models/FilterChangeEvent";
import { FilterableOptions } from "../models/FilterableOptions";
import { GroupableOptions } from "../models/GroupableOptions";
import { ListItem } from "../models/ListItem";
import { NavigableOptions } from "../models/NavigableOptions";
import { NavigationDirection } from "../models/NavigationDirection";
import { NavigationMode } from "../models/NavigationMode";
import { SelectableOptions } from "../models/SelectableOptions";
import { VirtualScrollOptions } from "../models/VirtualScrollOptions";

@Injectable()
export class ListService<TData> {
    private readonly data: WritableSignal<Iterable<TData>> = signal([]);
    private readonly listItems: Signal<ImmutableSet<ListItem<TData>>> = computed(() => {
        const data = this.data();
        return from(data)
            .select(item => new ListItem({ data: item, header: "" }))
            .toImmutableSet();
    });
    public readonly disabledBy: WritableSignal<string | Predicate<TData>> = signal("");
    public readonly filterPlaceholder: WritableSignal<string> = signal("");
    public readonly filterText: WritableSignal<string> = signal("");
    public readonly filterableOptions: WritableSignal<FilterableOptions> = signal({
        enabled: false,
        caseSensitive: false,
        debounce: 0,
        operator: "contains"
    });
    public readonly groupBy: WritableSignal<string | Selector<TData, any> | null> = signal(null);
    public readonly groupableOptions: WritableSignal<GroupableOptions<TData, any>> = signal({
        enabled: false,
        headerOrder: "asc"
    });
    public readonly highlightedItem: WritableSignal<ListItem<TData> | null> = signal(null);
    public readonly navigableOptions: WritableSignal<NavigableOptions> = signal({
        enabled: false,
        mode: "select",
        wrap: false
    });
    public readonly scrollToItem$: ReplaySubject<ListItem<TData>> = new ReplaySubject<ListItem<TData>>(1);
    public readonly selectableOptions: WritableSignal<SelectableOptions> = signal({
        mode: "single",
        enabled: false,
        toggleable: false
    });
    public readonly selectedKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
    public readonly selectedListItems: Signal<ImmutableSet<ListItem<TData>>> = computed(() => {
        const selectedKeys = this.selectedKeys();
        return this.viewItems()
            .where(i => selectedKeys.contains(this.getSelectionKey(i)))
            .toImmutableSet();
    });
    public readonly textField: WritableSignal<string | Selector<TData, string>> = signal("");
    public readonly valueField: WritableSignal<string | Selector<TData, any>> = signal("");
    public readonly viewItems: Signal<ImmutableSet<ListItem<TData>>> = computed(() => {
        const listItems = this.listItems();
        const filterText = this.filterText();
        const filterableOptions = this.filterableOptions();
        const groupableOptions = this.groupableOptions();
        let enumerable: IEnumerable<ListItem<TData>> = listItems;
        if (filterableOptions.enabled) {
            enumerable = enumerable.where(item => this.filterItem(item, filterText));
        }
        if (groupableOptions.enabled) {
            if (groupableOptions.orderBy) {
                if (groupableOptions.orderByDirection === "desc") {
                    enumerable = enumerable.orderByDescending(item => this.getOrderKey(item));
                } else {
                    enumerable = enumerable.orderBy(item => this.getOrderKey(item));
                }
            }
            let groupedEnumerable = enumerable.groupBy(item => this.getGroupField(item));
            if (groupableOptions.headerOrder) {
                if (groupableOptions.headerOrder === "desc") {
                    groupedEnumerable = groupedEnumerable.orderByDescending(g => g.key);
                } else {
                    groupedEnumerable = groupedEnumerable.orderBy(g => g.key);
                }
            }
            return groupedEnumerable
                .selectMany(g => {
                    const groupHeaderItem = new ListItem({ data: g.key, header: String(g.key) });
                    return g.source.prepend(groupHeaderItem);
                })
                .toImmutableSet();
        } else {
            return enumerable.toImmutableSet();
        }
    });
    public readonly virtualScrollOptions: WritableSignal<VirtualScrollOptions> = signal({
        enabled: false,
        height: 28
    });
    public filterChange: EventEmitter<FilterChangeEvent> = new EventEmitter<FilterChangeEvent>();
    public selectedKeysChange: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    public constructor() {}

    public clearFilter(): void {
        this.filterText.set("");
    }

    public clearSelections(): void {
        this.selectedKeys.update(set => set.clear());
    }

    public getGroupField(item: ListItem<TData>): any {
        const groupSelector = this.groupBy();
        if (groupSelector == null) {
            return "";
        }
        if (typeof groupSelector === "string") {
            return (item.data as any)?.[groupSelector] ?? "";
        }
        return groupSelector(item.data);
    }

    public getItemText(item: ListItem<TData>): string {
        const textField = this.textField();
        if (!textField) {
            return item.data?.toString() ?? "";
        }
        if (typeof textField === "string") {
            return (item.data as any)?.[textField] ?? "";
        }
        return textField(item.data);
    }

    public isDisabled(item: ListItem<TData>): boolean {
        const disabledBy = this.disabledBy();
        if (typeof disabledBy === "string") {
            return (item.data as any)?.[disabledBy] ?? false;
        }
        return disabledBy(item.data);
    }

    public isHighlighted(item: ListItem<TData>): boolean {
        const highlightedItem = this.highlightedItem();
        return highlightedItem === item;
    }

    public isSelected(item: ListItem<TData>): boolean {
        const options = this.selectableOptions();
        if (!options.enabled) {
            return false;
        }
        const selectedKeys = this.selectedKeys();
        const key = this.getSelectionKey(item);
        return selectedKeys.contains(key);
    }

    public navigate(direction: NavigationDirection, mode: NavigationMode): ListItem<TData> | null {
        const options = this.navigableOptions();
        if (!options.enabled) {
            return null;
        }
        const viewItems = this.viewItems()
            .where(i => !i.header && !this.isDisabled(i))
            .toImmutableSet();
        if (viewItems.isEmpty()) {
            return null;
        }
        const selectableOptions = this.selectableOptions();
        let item: ListItem<TData> | null;
        if (selectableOptions.mode === "single") {
            item = this.navigateForSingleSelection(viewItems, direction, mode);
        } else {
            item = this.navigateForMultipleSelection(viewItems, direction);
        }
        if (item) {
            this.scrollToItem$.next(item);
        }
        return item;
    }

    public selectItem(item: ListItem<TData>): void {
        const key = this.getSelectionKey(item);
        const options = this.selectableOptions();
        if (options.mode === "single") {
            if (options.toggleable) {
                this.selectedKeys.update(set => {
                    if (set.contains(key)) {
                        return set.remove(key);
                    }
                    return set.clear().add(key);
                });
            } else {
                this.selectedKeys.update(set => set.clear().add(key));
            }
        } else {
            this.selectedKeys.update(set => {
                if (set.contains(key)) {
                    return set.remove(key);
                }
                return set.add(key);
            });
        }
    }

    public setData(data: Iterable<TData>) {
        this.data.set(data);
    }

    public setDisabledBy(disabledBy: string | Predicate<TData>): void {
        this.disabledBy.set(disabledBy);
    }

    public setFilter(filter: string): void {
        this.filterText.set(filter);
    }

    public setFilterPlaceholder(placeholder: string): void {
        this.filterPlaceholder.set(placeholder);
    }

    public setFilterableOptions(options: Partial<FilterableOptions>): void {
        this.filterableOptions.update(o => ({ ...o, ...options }));
    }

    public setGroupBy(groupSelector: string | Selector<TData, any> | null): void {
        this.groupBy.set(groupSelector);
    }

    public setGroupableOptions(options: GroupableOptions<TData, any>): void {
        this.groupableOptions.update(o => ({ ...o, ...options }));
    }

    public setNavigableOptions(options: Partial<NavigableOptions>): void {
        this.navigableOptions.update(o => ({ ...o, ...options }));
    }

    public setSelectableOptions(options: SelectableOptions): void {
        this.selectableOptions.update(o => ({ ...o, ...options }));
    }

    public setSelectedDataItems(dataItems: Iterable<TData>): void {
        const valueField = this.valueField();
        if (!valueField) {
            this.selectedKeys.update(set => set.clear().addAll(dataItems));
        } else {
            const selectedKeys = from(dataItems)
                .select(item => {
                    return this.getDataItemSelectionKey(item);
                })
                .toImmutableSet();
            this.selectedKeys.update(set => set.clear().addAll(selectedKeys));
        }
    }

    public setSelectedKeys(selectedKeys: Iterable<any>): void {
        this.selectedKeys.update(set => set.clear().addAll(selectedKeys));
    }

    public setTextField(textField: string | Selector<TData, string>): void {
        this.textField.set(textField);
    }

    public setValueField(valueField: string | Selector<TData, any>): void {
        this.valueField.set(valueField);
    }

    public setVirtualScrollOptions(options: VirtualScrollOptions): void {
        this.virtualScrollOptions.update(o => ({ ...o, ...options }));
    }

    private filterItem(item: ListItem<TData>, filterText: string): boolean {
        if (filterText === "") {
            return true;
        }

        const options = this.filterableOptions();
        const itemText = this.getItemText(item);
        const text = options.caseSensitive ? itemText : itemText.toLowerCase();
        const filter = options.caseSensitive ? filterText : filterText.toLowerCase();

        if (typeof options.operator === "function") {
            return options.operator(text, filter);
        }

        switch (options.operator) {
            case "contains":
                return text.includes(filter);
            case "startsWith":
                return text.startsWith(filter);
            case "endsWith":
                return text.endsWith(filter);
            default:
                return false;
        }
    }

    private getDataItemSelectionKey(dataItem: TData): any | null {
        const valueField = this.valueField();
        if (!valueField) {
            return dataItem;
        }
        if (typeof valueField === "string") {
            return (dataItem as any)?.[valueField] ?? dataItem;
        }
        return valueField(dataItem);
    }

    private getPreviousItemForNavigation(
        viewItems: ImmutableSet<ListItem<TData>>,
        navigationItem: ListItem<TData>
    ): ListItem<TData> | null {
        let prevItem = viewItems.takeWhile(i => i !== navigationItem).lastOrDefault(i => !this.isDisabled(i));
        if (prevItem == null) {
            const lastItem = viewItems.lastOrDefault(i => !this.isDisabled(i));
            if (this.navigableOptions().wrap) {
                prevItem = lastItem;
            } else if (!this.navigableOptions().wrap) {
                prevItem = navigationItem;
            }
        }
        return prevItem;
    }

    private getOrderKey(item: ListItem<TData>): any | null {
        const orderBy = this.groupableOptions().orderBy;
        if (orderBy) {
            if (typeof orderBy === "string") {
                return (item.data as any)[orderBy];
            } else {
                return orderBy(item.data);
            }
        }
        return null;
    }

    private getSelectionKey(item: ListItem<TData>): any | null {
        return this.getDataItemSelectionKey(item.data);
    }

    private navigateForMultipleSelection(
        viewItems: ImmutableSet<ListItem<TData>>,
        direction: NavigationDirection
    ): ListItem<TData> | null {
        const selectedKeys = this.selectedKeys();
        const firstItem = viewItems.first();
        if (selectedKeys.isEmpty() && !this.highlightedItem()) {
            this.highlightedItem.set(firstItem);
            return firstItem;
        }
        const firstSelectedItem = viewItems.firstOrDefault(i => selectedKeys.contains(this.getSelectionKey(i)));
        const lastSelectedItem = viewItems.lastOrDefault(i => selectedKeys.contains(this.getSelectionKey(i)));
        const lastHighlightedItem = this.highlightedItem();

        if (direction === "next") {
            const navigationItem = lastHighlightedItem ?? lastSelectedItem ?? firstItem;
            let nextItem = viewItems
                .skipWhile(i => i !== navigationItem)
                .skip(1)
                .firstOrDefault(i => !this.isDisabled(i));
            if (nextItem == null) {
                const firstItem = viewItems.firstOrDefault(i => !this.isDisabled(i));
                if (this.navigableOptions().wrap) {
                    nextItem = firstItem;
                } else if (!this.navigableOptions().wrap) {
                    nextItem = navigationItem;
                }
            }
            if (nextItem) {
                this.highlightedItem.set(nextItem);
                return nextItem;
            }
        } else {
            const navigationItem = lastHighlightedItem ?? firstSelectedItem ?? firstItem;
            let prevItem = this.getPreviousItemForNavigation(viewItems, navigationItem);
            if (prevItem) {
                this.highlightedItem.set(prevItem);
                return prevItem;
            }
        }
        return null;
    }

    private navigateForSingleSelection(
        viewItems: ImmutableSet<ListItem<TData>>,
        direction: NavigationDirection,
        mode: NavigationMode
    ): ListItem<TData> | null {
        const selectedKeys = this.selectedKeys();
        const firstItem = viewItems.first();
        if (selectedKeys.isEmpty() && !this.highlightedItem()) {
            if (mode === "select") {
                this.selectItem(firstItem);
            } else {
                this.highlightedItem.set(firstItem);
            }
            return firstItem;
        }
        const selectedItem = viewItems.lastOrDefault(i => selectedKeys.contains(this.getSelectionKey(i)));
        const lastHighlightedItem = this.highlightedItem();
        const navigationItem = lastHighlightedItem ?? selectedItem ?? firstItem;
        if (direction === "next") {
            let nextItem = viewItems
                .skipWhile(i => i !== navigationItem)
                .skip(1)
                .firstOrDefault(i => !this.isDisabled(i));
            if (nextItem == null) {
                if (this.navigableOptions().wrap) {
                    nextItem = firstItem;
                } else if (!this.navigableOptions().wrap) {
                    nextItem = navigationItem;
                }
            }
            if (nextItem) {
                if (mode === "select") {
                    this.selectItem(nextItem);
                } else {
                    this.highlightedItem.set(nextItem);
                }
                return nextItem;
            }
        } else {
            let prevItem = this.getPreviousItemForNavigation(viewItems, navigationItem);
            if (prevItem) {
                if (mode === "select") {
                    this.selectItem(prevItem);
                } else {
                    this.highlightedItem.set(prevItem);
                }
                return prevItem;
            }
        }
        return null;
    }
}
