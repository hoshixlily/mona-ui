import { computed, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { from, IEnumerable, IGroup, ImmutableSet, Predicate, Selector } from "@mirei/ts-collections";
import { GroupableOptions } from "../models/GroupableOptions";
import { ListItem } from "../models/ListItem";
import { SelectableOptions } from "../models/SelectableOptions";

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
    public readonly filterText: WritableSignal<string> = signal("");
    public readonly groupBy: WritableSignal<string | Selector<TData, any> | null> = signal(null);
    public readonly groupableOptions: WritableSignal<GroupableOptions<TData, any>> = signal({
        enabled: false
    });
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
        const groupableOptions = this.groupableOptions();
        let enumerable: IEnumerable<ListItem<TData>> = listItems;
        if (filterText) {
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

    public isSelected(item: ListItem<TData>): boolean {
        const options = this.selectableOptions();
        if (!options.enabled) {
            return false;
        }
        const selectedKeys = this.selectedKeys();
        const key = this.getItemKey(item);
        return selectedKeys.contains(key);
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

    public setGroupBy(groupSelector: string | Selector<TData, any> | null): void {
        this.groupBy.set(groupSelector);
    }

    public setGroupableOptions(options: GroupableOptions<TData, any>): void {
        this.groupableOptions.set(options);
    }

    public setSelectableOptions(options: SelectableOptions): void {
        this.selectableOptions.set(options);
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

    private filterItem(item: ListItem<TData>, filterText: string): boolean {
        const text = this.getItemText(item);
        return text.toLowerCase().includes(filterText.toLowerCase());
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
}
