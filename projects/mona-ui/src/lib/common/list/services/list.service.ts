import { computed, EventEmitter, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { from, IEnumerable, ImmutableSet, Predicate, Selector } from "@mirei/ts-collections";
import { ReplaySubject } from "rxjs";
import { FilterChangeEvent } from "../../filter-input/models/FilterChangeEvent";
import { FilterableOptions } from "../models/FilterableOptions";
import { GroupableOptions } from "../models/GroupableOptions";
import { ListItem } from "../models/ListItem";
import { NavigationDirection } from "../models/NavigationDirection";
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
    public readonly scrollToItem$: ReplaySubject<ListItem<TData>> = new ReplaySubject<ListItem<TData>>(1);
    public readonly selectableOptions: WritableSignal<SelectableOptions> = signal({
        mode: "single",
        enabled: false,
        toggleable: false
    });
    public readonly selectedKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
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

    public constructor() {}

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
        const key = this.getItemKey(item);
        return selectedKeys.contains(key);
    }

    public navigate(direction: NavigationDirection): ListItem<TData> | null {
        const viewItems = this.viewItems()
            .where(i => !i.header && !this.isDisabled(i))
            .toImmutableSet();
        if (viewItems.isEmpty()) {
            return null;
        }
        const selectableOptions = this.selectableOptions();
        let item: ListItem<TData> | null;
        if (selectableOptions.mode === "single") {
            item = this.navigateForSingleSelection(viewItems, direction);
        } else {
            item = this.navigateForMultipleSelection(viewItems, direction);
        }
        if (item) {
            this.scrollToItem$.next(item);
        }
        return item;
    }

    public selectItem(item: ListItem<TData>): void {
        const key = this.getItemKey(item);
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

    public setFilterableOptions(options: FilterableOptions): void {
        this.filterableOptions.update(o => ({ ...o, ...options }));
    }

    public setGroupBy(groupSelector: string | Selector<TData, any> | null): void {
        this.groupBy.set(groupSelector);
    }

    public setGroupableOptions(options: GroupableOptions<TData, any>): void {
        this.groupableOptions.update(o => ({ ...o, ...options }));
    }

    public setSelectableOptions(options: SelectableOptions): void {
        this.selectableOptions.update(o => ({ ...o, ...options }));
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

    private getItemKey(item: ListItem<TData>): any | null {
        const valueField = this.valueField();
        if (!valueField) {
            return item.data;
        }
        if (typeof valueField === "string") {
            return (item.data as any)?.[valueField] ?? item.data;
        }
        return valueField(item.data);
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
        const firstSelectedItem = viewItems.firstOrDefault(i => selectedKeys.contains(this.getItemKey(i)));
        const lastSelectedItem = viewItems.lastOrDefault(i => selectedKeys.contains(this.getItemKey(i)));
        const lastHighlightedItem = this.highlightedItem();

        if (direction === "next") {
            const navigationItem = lastHighlightedItem ?? lastSelectedItem ?? firstItem;
            const nextItem = viewItems
                .skipWhile(i => i !== navigationItem)
                .skip(1)
                .firstOrDefault(i => !this.isDisabled(i));
            if (nextItem) {
                this.highlightedItem.set(nextItem);
                return nextItem;
            } else {
                this.highlightedItem.set(firstItem);
                return firstItem;
            }
        } else {
            const navigationItem = lastHighlightedItem ?? firstSelectedItem ?? firstItem;
            const prevItem = viewItems.takeWhile(i => i !== navigationItem).lastOrDefault(i => !this.isDisabled(i));
            if (prevItem) {
                this.highlightedItem.set(prevItem);
                return prevItem;
            } else {
                const lastItem = viewItems.lastOrDefault(i => !this.isDisabled(i));
                if (lastItem) {
                    this.highlightedItem.set(lastItem);
                    return lastItem;
                }
            }
        }
        return null;
    }

    private navigateForSingleSelection(
        viewItems: ImmutableSet<ListItem<TData>>,
        direction: NavigationDirection
    ): ListItem<TData> | null {
        const selectedKeys = this.selectedKeys();
        const firstItem = viewItems.first();
        if (selectedKeys.isEmpty()) {
            this.selectItem(firstItem);
            return firstItem;
        }
        const lastSelectedItem = viewItems.lastOrDefault(i => selectedKeys.contains(this.getItemKey(i)));
        if (!lastSelectedItem) {
            return null;
        }
        if (direction === "next") {
            const nextItem = viewItems
                .skipWhile(i => i !== lastSelectedItem)
                .skip(1)
                .firstOrDefault(i => !this.isDisabled(i));
            if (nextItem) {
                this.selectItem(nextItem);
                return nextItem;
            }
        } else {
            const prevItem = viewItems.takeWhile(i => i !== lastSelectedItem).lastOrDefault(i => !this.isDisabled(i));
            if (prevItem) {
                this.selectItem(prevItem);
                return prevItem;
            }
        }
        return null;
    }
}
