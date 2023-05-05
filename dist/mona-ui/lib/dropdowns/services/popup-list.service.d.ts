import { Group, List } from "@mirei/ts-collections";
import { PopupListItem } from "../data/PopupListItem";
import { SelectionMode } from "../../models/SelectionMode";
import { ItemDisabler, ItemDisablerAction } from "../data/ItemDisabler";
import { Subject } from "rxjs";
import * as i0 from "@angular/core";
export declare class PopupListService {
    readonly scrollToListItem$: Subject<PopupListItem>;
    filterModeActive: boolean;
    sourceListData: List<Group<string, PopupListItem>>;
    viewListData: List<Group<string, PopupListItem>>;
    constructor();
    static findFirstSelectedItem(items: List<Group<string, PopupListItem>>): PopupListItem | null;
    static findLastSelectedItem(items: List<Group<string, PopupListItem>>): PopupListItem | null;
    static findNextSelectableItem(items: List<Group<string, PopupListItem>>, item: PopupListItem): PopupListItem | null;
    static findPreviousSelectableItem(items: List<Group<string, PopupListItem>>, item: PopupListItem): PopupListItem | null;
    static getItemDisablerAction(disabler: ItemDisabler): ItemDisablerAction;
    static isFirstSelectableItem(items: List<Group<string, PopupListItem>>, item: PopupListItem): boolean;
    static isLastSelectableItem(items: List<Group<string, PopupListItem>>, item: PopupListItem): boolean;
    clearFilters(): void;
    filterItems(filter: string, selectionMode: SelectionMode): void;
    getListItemsOfValues(values: any[]): PopupListItem[];
    initializeListData(params: {
        data: Iterable<any>;
        disabler?: ItemDisabler;
        textField?: string;
        valueField?: string;
        groupField?: string;
    }): List<Group<string, any>>;
    navigate(event: KeyboardEvent, selectionMode: SelectionMode): PopupListItem | null;
    selectItem(item: PopupListItem, selectionMode: SelectionMode): void;
    private updateDisabledItems;
    static ɵfac: i0.ɵɵFactoryDeclaration<PopupListService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PopupListService>;
}
