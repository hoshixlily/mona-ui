import { EventEmitter, Injectable, signal, WritableSignal } from "@angular/core";
import { EnumerableSet, Group, IEnumerable, List } from "@mirei/ts-collections";
import { ListViewItem } from "../models/ListViewItem";
import { SelectableOptions } from "../models/SelectableOptions";
import { VirtualScrollOptions } from "../models/VirtualScrollOptions";

@Injectable()
export class ListViewService {
    public listViewItems: WritableSignal<List<ListViewItem>> = signal<List<ListViewItem>>(new List<ListViewItem>([]));
    public selectableOptions: SelectableOptions = {
        enabled: false,
        mode: "single"
    };
    public selectedKeys: EnumerableSet<any> = new EnumerableSet<any>();
    public selectedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();
    public selectionKey: any;
    public virtualScrollOptions: VirtualScrollOptions = { enabled: false, itemHeight: 30 };

    public constructor() {}

    public loadSelectedKeys(selectedKeys: Iterable<any>): void {
        const selectedKeySet = new EnumerableSet<any>(selectedKeys);
        for (const item of this.listViewItems()) {
            item.selected.set(false);
        }
        for (const key of selectedKeySet) {
            const item = this.listViewItems().firstOrDefault(item => {
                if (this.selectionKey) {
                    return item.data[this.selectionKey] === key;
                }
                return item.data === key;
            });
            if (item) {
                item.selected.set(true);
            }
        }
    }

    public setSelectableOptions(options: SelectableOptions): void {
        this.selectableOptions = { ...this.selectableOptions, ...options };
    }

    public setVirtualScrollOptions(options: VirtualScrollOptions): void {
        this.virtualScrollOptions = { ...this.virtualScrollOptions, ...options };
    }

    public toggleItemSelection(item: ListViewItem): void {
        if (!this.selectableOptions.enabled) {
            return;
        }
        if (this.selectableOptions.mode === "single") {
            this.selectedKeys.clear();
            for (const item of this.listViewItems()) {
                item.selected.set(false);
            }
        }
        const key = this.selectionKey ? item.data[this.selectionKey] : item.data;
        if (this.selectedKeys.contains(key)) {
            this.selectedKeys.remove(key);
            item.selected.set(false);
        } else {
            this.selectedKeys.add(key);
            item.selected.set(true);
        }
        this.selectedKeysChange.emit(this.selectedKeys.toArray());
    }
}
