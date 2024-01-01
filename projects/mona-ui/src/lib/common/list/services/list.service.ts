import { computed, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { from, IEnumerable, IGroup, ImmutableSet, Predicate, Selector } from "@mirei/ts-collections";
import { ListItem } from "../models/ListItem";

@Injectable()
export class ListService<T = any> {
    private readonly data: WritableSignal<Iterable<T>> = signal([]);
    private readonly listItems: Signal<ImmutableSet<ListItem>> = computed(() => {
        const data = this.data();
        return from(data)
            .select(item => new ListItem({ data: item }))
            .toImmutableSet();
    });
    public readonly disabledBy: WritableSignal<string | Predicate<T>> = signal("");
    public readonly filterText: WritableSignal<string> = signal("");
    public readonly selectedKeys: WritableSignal<ImmutableSet<any>> = signal(ImmutableSet.create());
    public readonly groupSelector: WritableSignal<string | Selector<T, any> | null> = signal(null);
    public readonly textField: WritableSignal<string | Selector<T, string>> = signal("");
    public readonly valueField: WritableSignal<string | Selector<T, any>> = signal("");
    public readonly viewItems: Signal<ImmutableSet<ListItem>> = computed(() => {
        const listItems = this.listItems();
        const filterText = this.filterText();
        const groupSelector = this.groupSelector();
        let enumerable: IEnumerable<ListItem> = listItems;
        if (filterText) {
            enumerable = enumerable.where(item => this.filterItem(item, filterText));
        }
        let groupedEnumerable: IEnumerable<IGroup<any, ListItem>>;
        if (groupSelector != null) {
            groupedEnumerable = enumerable.groupBy(item => this.getGroupField(item));
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

    public getGroupField(item: ListItem): any {
        const groupSelector = this.groupSelector();
        if (groupSelector == null) {
            return "";
        }
        if (typeof groupSelector === "string") {
            return (item.data as any)?.[groupSelector] ?? "";
        }
        return groupSelector(item.data);
    }

    public getItemText(item: ListItem): string {
        const textField = this.textField();
        if (!textField) {
            return item.data?.toString() ?? "";
        }
        if (typeof textField === "string") {
            return (item.data as any)?.[textField] ?? "";
        }
        return textField(item.data);
    }

    public isDisabled(item: ListItem): boolean {
        const disabledBy = this.disabledBy();
        if (typeof disabledBy === "string") {
            return (item.data as any)?.[disabledBy] ?? false;
        }
        return disabledBy(item.data);
    }

    public isSelected(item: ListItem): boolean {
        const selectedKeys = this.selectedKeys();
        const key = this.getItemKey(item);
        return selectedKeys.contains(key);
    }

    public selectItem(item: ListItem): void {
        const key = this.getItemKey(item);
        if (this.isSelected(item)) {
            this.selectedKeys.update(set => set.remove(key));
        } else {
            this.selectedKeys.update(set => set.add(key));
        }
    }

    public setData(data: Iterable<T>) {
        this.data.set(data);
    }

    public setDisabledBy(disabledBy: string | Predicate<T>): void {
        this.disabledBy.set(disabledBy);
    }

    public setGroupSelector(groupSelector: string | Selector<T, any> | null): void {
        this.groupSelector.set(groupSelector);
    }

    public setSelectedKeys(selectedKeys: Iterable<any>): void {
        this.selectedKeys.update(set => set.clear().addAll(selectedKeys));
    }

    public setTextField(textField: string | Selector<T, string>): void {
        this.textField.set(textField);
    }

    public setValueField(valueField: string | Selector<T, any>): void {
        this.valueField.set(valueField);
    }

    private filterItem(item: ListItem, filterText: string): boolean {
        const text = this.getItemText(item);
        return text.toLowerCase().includes(filterText.toLowerCase());
    }

    private getItemKey(item: ListItem): any | null {
        const valueField = this.valueField();
        if (!valueField) {
            return item.data;
        }
        if (typeof valueField === "string") {
            return (item.data as any)?.[valueField] ?? item.data;
        }
        return valueField(item.data);
    }
}
