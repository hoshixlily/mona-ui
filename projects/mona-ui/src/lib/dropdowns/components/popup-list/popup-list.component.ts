import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { Enumerable, Group, List } from "@mirei/ts-collections";
import { PopupListItem } from "../../data/PopupListItem";
import { SelectionMode } from "../../../models/SelectionMode";
import { PopupListService } from "../../services/popup-list.service";
import { fromEvent } from "rxjs";

@Component({
    selector: "mona-popup-list",
    templateUrl: "./popup-list.component.html",
    styleUrls: ["./popup-list.component.scss"],
    providers: [PopupListService]
})
export class PopupListComponent implements OnInit, OnChanges {
    public listData: List<Group<string, PopupListItem>> = new List<Group<string, PopupListItem>>();

    @Input()
    public data: Iterable<any> = [];

    @Input()
    public groupField: string = "";

    @Input()
    public set highlightedValues(values: any[]) {
        this.updateHighlightedValues(values);
    }

    @Input()
    public navigable: boolean = true;

    @Input()
    public selectionMode: SelectionMode = "single";

    @Input()
    public textField!: string;

    @Input()
    public set value(values: any[]) {
        this.updateSelectedValues(values);
    }

    @Output()
    public valueChange: EventEmitter<any[]> = new EventEmitter<any[]>();

    @Input()
    public valueField!: string;

    public constructor(private readonly elementRef: ElementRef, private readonly popupListService: PopupListService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["data"]) {
            this.listData = this.initializeListData();
        }
        if (changes["highlightedValues"] && changes["highlightedValues"].isFirstChange()) {
            window.setTimeout(() => this.updateHighlightedValues(changes["highlightedValues"].currentValue));
        }
        if (changes["value"] && changes["value"].isFirstChange()) {
            window.setTimeout(() => this.updateSelectedValues(changes["value"].currentValue));
        }
    }

    public ngOnInit(): void {
        this.listData = this.initializeListData();
        this.setEvents();
    }

    public onListItemClick(item: PopupListItem, event: MouseEvent): void {
        if (item.disabled) {
            return;
        }
        if (this.selectionMode === "single") {
            this.updateSelectedValues([item.data]);
            this.valueChange.emit([item.data]);
        } else if (this.selectionMode === "multiple") {
            item.selected = !item.selected;
            const selectedItems = this.listData
                .selectMany(g => g.source)
                .where(i => i.selected)
                .select(i => i.data)
                .toArray();
            this.valueChange.emit(selectedItems);
        }
    }

    private initializeListData(): List<Group<string, any>> {
        let listItems: List<Group<string, PopupListItem>> = new List<Group<string, PopupListItem>>();
        const createListItem = (item: any): PopupListItem => {
            return new PopupListItem({
                data: item,
                text: this.textField ? item[this.textField] : item,
                textField: this.textField,
                value: this.valueField ? item[this.valueField] : this.valueField,
                valueField: this.valueField
            });
        };
        if (this.groupField) {
            listItems = Enumerable.from(this.data)
                .groupBy(d => d[this.groupField])
                .select(g => new Group<string, any>(g.key, g.select(d => createListItem(d)).toList()))
                .orderBy(g => g.key)
                .toList();
        } else {
            const items = Enumerable.from(this.data)
                .select(d => createListItem(d))
                .toList();
            listItems.add(new Group<string, any>("", items));
        }

        // item disabler code here
        return listItems;
    }

    private setEvents(): void {
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown").subscribe((event: KeyboardEvent) => {
            if (!this.navigable) {
                return;
            }
            const selectedItem = this.listData.selectMany(g => g.source).firstOrDefault(i => i.selected);
            const highlightedItem = this.listData.selectMany(g => g.source).firstOrDefault(i => i.highlighted);
            const focusedItem = highlightedItem ?? selectedItem ?? null;
            if (event.key === "ArrowDown") {
                event.preventDefault();
                if (!focusedItem) {
                    const firstItem = this.listData.selectMany(g => g.source).firstOrDefault();
                    if (firstItem) {
                        if (this.selectionMode === "single") {
                            this.updateSelectedValues([firstItem]);
                        } else {
                            this.updateHighlightedValues([firstItem]);
                        }
                    }
                } else {
                    if (PopupListService.isLastSelectableItem(this.listData, focusedItem)) {
                        return;
                    }
                    focusedItem.highlighted = false;
                    const nextItem = PopupListService.findNextSelectableItem(this.listData, focusedItem);
                    if (nextItem) {
                        if (this.selectionMode === "single") {
                            focusedItem.selected = false;
                            nextItem.selected = true;
                        } else {
                            focusedItem.highlighted = false;
                            nextItem.highlighted = true;
                        }
                    }
                }
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                if (focusedItem) {
                    if (PopupListService.isFirstSelectableItem(this.listData, focusedItem)) {
                        return;
                    }
                    const previousItem = PopupListService.findPreviousSelectableItem(this.listData, focusedItem);
                    if (previousItem) {
                        if (this.selectionMode === "single") {
                            focusedItem.selected = false;
                            previousItem.selected = true;
                        } else {
                            focusedItem.highlighted = false;
                            previousItem.highlighted = true;
                        }
                    }
                }
            } else if (event.key === "Enter") {
                if (focusedItem) {
                    this.onListItemClick(focusedItem, new MouseEvent("click"));
                }
            }
        });
    }

    private updateHighlightedValues(values: any[]): void {
        this.listData.forEach(g => {
            g.source.forEach(i => {
                i.highlighted = values.some(v => i.dataEquals(v));
            });
        });
    }

    private updateSelectedValues(values: any[]): void {
        this.listData.forEach(g => {
            g.source.forEach(i => {
                i.selected = values.some(v => i.dataEquals(v));
            });
        });
    }
}
