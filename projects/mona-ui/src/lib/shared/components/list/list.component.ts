import {
    AfterViewInit,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    TemplateRef,
    ViewChildren
} from "@angular/core";
import { filter, fromEvent, Subject, takeUntil } from "rxjs";
import { Action } from "../../../utils/Action";
import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { Enumerable, Group, List } from "@mirei/ts-collections";
import { ListItemComponent } from "../list-item/list-item.component";
import { ListItem } from "../../data/ListItem";
import { ListGroupTemplateDirective } from "../../directives/list-group-template.directive";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { SelectionMode } from "../../../models/SelectionMode";
import { ValueChangeEvent } from "../../data/ValueChangeEvent";
import { ListDataCreationOptions } from "../../data/ListDataCreationOptions";

@Component({
    selector: "mona-list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    private disabler?: Action<ListItem, boolean> | null = null;
    private keyManager!: ActiveDescendantKeyManager<ListItemComponent>;
    public highlightedListItem: ListItem | null = null;
    public selectedValues: ListItem[] = [];

    @Input()
    public data: List<Group<string, ListItem>> = new List<Group<string, ListItem>>();

    @Input()
    public disabled: boolean = false;

    @ContentChild(ListGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<void>;

    @Input()
    public highlightable: boolean = false;

    @Input()
    public set highlightedItem(item: ListItem | null) {
        this.highlightedListItem = item;
        this.scrollToHighlightedItem();
    }

    @Input()
    public set itemDisabler(disabler: Action<any, boolean> | string | null) {
        this.disabler = ListComponent.getDisabler(disabler);
        if (this.disabler) {
            ListComponent.updateDisabledState(this.data, this.disabler);
        }
    }

    @ContentChild(ListItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<void>;

    @ViewChildren(ListItemComponent)
    public listItemComponents: QueryList<ListItemComponent> = new QueryList<ListItemComponent>();

    @Output()
    public selectionChange: EventEmitter<ListItem> = new EventEmitter<ListItem>();

    @Input()
    public selectionMode: SelectionMode = "single";

    @Input()
    public set value(value: ListItem[]) {
        this.selectedValues = value;
        this.updateSelectedValues();
    }

    @Output()
    public valueChange: EventEmitter<ValueChangeEvent> = new EventEmitter<ValueChangeEvent>();

    public constructor(public readonly elementRef: ElementRef<HTMLElement>) {}

    public static createListData(options: ListDataCreationOptions): List<Group<string, ListItem>> {
        let data: List<Group<string, ListItem>> = new List<Group<string, ListItem>>();
        let index = 0;
        if (options.groupField) {
            data = Enumerable.from(options.data)
                .groupBy(d => d[options.groupField as string])
                .select(g => {
                    const items = g.source
                        .select(d => {
                            return new ListItem({
                                data: d,
                                index: index++,
                                text: options.textField ? d[options.textField] : d,
                                textField: options.textField ?? "",
                                value: options.valueField ? d[options.valueField] : d,
                                valueField: options.valueField ?? ""
                            });
                        })
                        .toList();
                    return new Group(g.key, items);
                })
                .orderBy(g => g.key)
                .toList();
        } else {
            const items = Enumerable.from(options.data)
                .select(d => {
                    return new ListItem({
                        data: d,
                        index: index++,
                        text: options.textField ? d[options.textField as string] : d,
                        textField: options.textField ?? "",
                        value: options.valueField ? d[options.valueField as string] : d,
                        valueField: options.valueField ?? ""
                    });
                })
                .toList();
            data.add(new Group<string, any>("", items));
        }
        if (options.disabler) {
            ListComponent.updateDisabledState(data, options.disabler);
        }
        return data;
    }

    public static findFirstNotDisabledItem(listData: List<Group<string, ListItem>>): ListItem | null {
        return listData.selectMany(g => g.source).firstOrDefault(d => !d.disabled);
    }

    public static findLastNonDisabledItem(listData: List<Group<string, ListItem>>): ListItem | null {
        return listData
            .selectMany(g => g.source)
            .reverse()
            .firstOrDefault(d => !d.disabled);
    }

    public static findNextNotDisabledItem(listData: List<Group<string, ListItem>>, item: ListItem): ListItem | null {
        const count = listData.selectMany(d => d.source).count();
        return listData
            .selectMany(d => d.source)
            .skipWhile(d => !d.equals(item))
            .skip(count === 1 ? 0 : 1)
            .skipWhile(d => !!d.disabled)
            .firstOrDefault();
    }

    public static findPrevNotDisabledItem(listData: List<Group<string, ListItem>>, item: ListItem): ListItem | null {
        const count = listData.selectMany(d => d.source).count();
        return listData
            .selectMany(d => d.source)
            .reverse()
            .skipWhile(d => !d.equals(item))
            .skip(count === 1 ? 0 : 1)
            .skipWhile(d => !!d.disabled)
            .firstOrDefault();
    }

    public static getDisabler(disabler: Action<any, boolean> | string | null): Action<ListItem, boolean> | null {
        return typeof disabler === "string" ? (item: any) => !!item?.[disabler] ?? false : disabler;
    }

    public static updateDisabledState(
        listData: List<Group<string, ListItem>>,
        disabler: Action<ListItem, boolean>
    ): void {
        for (const item of listData.selectMany(g => g.source)) {
            item.disabled = disabler(item.data);
        }
    }

    public ngAfterViewInit(): void {
        this.keyManager = new ActiveDescendantKeyManager<ListItemComponent>(this.listItemComponents).skipPredicate(
            li => !!li.item?.disabled
        );
        this.highlightInitialSelectedItem();
        this.setEventListeners();
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {}

    public onDropDownItemSelect(item: ListItem, via: "navigation" | "selection" = "selection"): void {
        if (this.selectionMode === "single") {
            if (this.selectedValues.length !== 0) {
                for (const listItem of this.data.selectMany(g => g.source)) {
                    listItem.selected = false;
                }
            }
            item.selected = true;
            this.selectedValues = [item];
            this.valueChange.emit({
                value: this.selectedValues,
                via
            });
        } else {
            if (this.selectedValues.includes(item)) {
                item.selected = false;
                this.selectedValues = this.selectedValues.filter(d => !d.equals(item));
            } else {
                item.selected = true;
                this.selectedValues = [...this.selectedValues, item];
            }
            this.valueChange.emit({
                value: this.selectedValues,
                via
            });
        }
        this.highlightedListItem = item;
    }

    public scrollToHighlightedItem(): void {
        if (this.highlightedListItem) {
            const listItem = this.listItemComponents.find(d => d.item.equals(this.highlightedListItem));
            if (listItem) {
                listItem.elementRef.nativeElement.scrollIntoView({ behavior: "auto", block: "center" });
            }
        }
    }

    private highlightFirstItem(): void {
        this.highlightedListItem = ListComponent.findFirstNotDisabledItem(this.data);
        if (this.highlightedListItem) {
            this.setKeyManagerActiveItem(this.highlightedListItem);
        }
    }

    private highlightInitialSelectedItem(): void {
        if (this.selectedValues.length > 0) {
            if (this.selectionMode === "single") {
                this.highlightedListItem = this.selectedValues[this.selectedValues.length - 1];
                this.setKeyManagerActiveItem(this.highlightedListItem);
            } else {
                this.highlightedListItem = this.selectedValues[this.selectedValues.length - 1];
                this.setKeyManagerActiveItem(this.highlightedListItem);
            }
        } else {
            this.highlightFirstItem();
        }
    }

    private highlightNextItem(): void {
        if (this.highlightedListItem) {
            const nextItem = ListComponent.findNextNotDisabledItem(this.data, this.highlightedListItem);
            if (nextItem) {
                this.highlightedListItem = nextItem;
                this.setKeyManagerActiveItem(this.highlightedListItem);
            }
        }
    }

    private highlightPreviousItem(): void {
        if (this.highlightedListItem) {
            const previousItem = ListComponent.findPrevNotDisabledItem(this.data, this.highlightedListItem);
            if (previousItem) {
                this.highlightedListItem = previousItem;
                this.setKeyManagerActiveItem(previousItem);
            }
        }
    }

    private scrollIntoView(): void {
        if (this.highlightedListItem) {
            const listItem = this.listItemComponents.find(d => d.item.equals(this.highlightedListItem));
            if (listItem) {
                listItem.elementRef.nativeElement.scrollIntoView({ behavior: "auto", block: "center" });
            }
        }
    }

    private setEventListeners(): void {
        fromEvent(this.elementRef.nativeElement, "keydown")
            .pipe(
                takeUntil(this.componentDestroy$),
                filter(() => !this.disabled),
                filter((e: Event) => {
                    const event = e as KeyboardEvent;
                    return event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter";
                })
            )
            .subscribe(e => {
                e.preventDefault();
                const event = e as KeyboardEvent;
                if (event.key === "ArrowDown") {
                    if (!this.highlightedListItem) {
                        this.highlightFirstItem();
                        if (this.selectionMode === "single" && this.highlightedListItem) {
                            this.onDropDownItemSelect(this.highlightedListItem, "navigation");
                        }
                    } else {
                        this.highlightNextItem();
                        if (this.selectionMode === "single") {
                            this.onDropDownItemSelect(this.highlightedListItem, "navigation");
                        }
                    }
                    this.scrollIntoView();
                } else if (event.key === "ArrowUp") {
                    if (this.highlightedListItem) {
                        this.highlightPreviousItem();
                        if (this.selectionMode === "single") {
                            this.onDropDownItemSelect(this.highlightedListItem, "navigation");
                        }
                    }
                    this.scrollIntoView();
                } else if (event.key === "Enter") {
                    if (this.keyManager.activeItem?.item) {
                        this.onDropDownItemSelect(this.keyManager.activeItem?.item, "selection");
                    }
                }
            });
    }

    private setKeyManagerActiveItem(item: ListItemComponent | ListItem): void {
        if (item instanceof ListItemComponent) {
            this.keyManager.setActiveItem(item);
        } else {
            const keyManagerItem = this.listItemComponents.find(d => d.item.equals(this.highlightedListItem));
            if (keyManagerItem) {
                this.keyManager.setActiveItem(keyManagerItem);
            }
        }
    }

    private updateSelectedValues(): void {
        for (const item of this.data.selectMany(g => g.source)) {
            item.selected = this.selectedValues.includes(item);
        }
    }
}
