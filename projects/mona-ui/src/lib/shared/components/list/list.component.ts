import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { Enumerable, Group, List } from "@mirei/ts-collections";
import { ListItem } from "../../data/ListItem";
import { SelectionMode } from "../../../models/SelectionMode";

@Component({
    selector: "mona-list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit, OnChanges {
    public listData: List<Group<string, ListItem>> = new List<Group<string, ListItem>>();

    @Input()
    public data: any[] = [];

    @Input()
    public groupField: string = "";

    @Input()
    public set highlightedValues(values: any[]) {
        this.updateHighlightedValues(values);
    }

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

    public constructor() {}

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
    }

    public onListItemClick(item: ListItem, event: MouseEvent): void {
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
        let listItems: List<Group<string, ListItem>> = new List<Group<string, ListItem>>();
        const createListItem = (item: any): ListItem => {
            return new ListItem({
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
