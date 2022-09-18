import {
    AfterViewInit,
    ChangeDetectorRef,
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
    private selectedValues: ListItem[] = [];
    public highlightedItem: ListItem | null = null;

    @Input()
    public disabled: boolean = false;

    @Input()
    public groupField?: string;

    @ContentChild(ListGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<void>;

    @Input()
    public set itemDisabler(disabler: Action<any, boolean> | string | null) {
        this.disabler = ListComponent.getDisabler(disabler);
        if (this.disabler) {
            ListComponent.updateDisabledState(this.listData, this.disabler);
        }
    }

    @ContentChild(ListItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<void>;

    @ViewChildren(ListItemComponent)
    public listItemComponents: QueryList<ListItemComponent> = new QueryList<ListItemComponent>();

    @Input()
    public listData: List<Group<string, ListItem>> = new List<Group<string, ListItem>>();

    @Output()
    public selectionChange: EventEmitter<ListItem> = new EventEmitter<ListItem>();

    @Input()
    public selectionMode: SelectionMode = "single";

    @Input()
    public textField?: string;

    @Input()
    public set value(value: ListItem[]) {
        this.selectedValues = value;
        this.updateSelectedValues();
    }

    @Output()
    public valueChange: EventEmitter<ValueChangeEvent> = new EventEmitter<ValueChangeEvent>();

    @Input()
    public valueField?: string;

    public constructor(private readonly cdr: ChangeDetectorRef, private readonly elementRef: ElementRef<HTMLElement>) {}

    public static createListData(options: ListDataCreationOptions): List<Group<string, ListItem>> {
        let data: List<Group<string, ListItem>> = new List<Group<string, ListItem>>();
        let index = 0;
        if (options.groupField) {
            data = Enumerable.from(options.data)
                .groupBy(d => d[options.groupField as string])
                .select(g => {
                    const items = g.source
                        .select(d => {
                            return {
                                data: d,
                                index: index++,
                                text: options.textField ? d[options.textField] : d,
                                value: options.valueField ? d[options.valueField] : d
                            } as ListItem;
                        })
                        .toIndexableList();
                    return new Group(g.key, items);
                })
                .orderBy(g => g.key)
                .toList();
        } else {
            const items = Enumerable.from(options.data)
                .select(d => {
                    return {
                        data: d,
                        index: index++,
                        text: options.textField ? d[options.textField as string] : d,
                        value: options.valueField ? d[options.valueField as string] : d
                    } as ListItem;
                })
                .toList();
            data.add(new Group<string, any>("", items));
        }
        if (options.disabler) {
            ListComponent.updateDisabledState(data, options.disabler);
        }
        return data;
    }

    public static findFirstNonDisabledItem(listData: List<Group<string, ListItem>>): ListItem | null {
        return listData.selectMany(g => g.source).firstOrDefault(d => !d.disabled);
    }

    public static findNextNotDisabledItem(listData: List<Group<string, ListItem>>, item: ListItem): ListItem | null {
        return listData
            .selectMany(d => d.source)
            .skipWhile(d => d !== item)
            .skip(1)
            .skipWhile(d => !!d.disabled)
            .firstOrDefault();
    }

    public static findPrevNotDisabledItem(listData: List<Group<string, ListItem>>, item: ListItem): ListItem | null {
        return listData
            .selectMany(d => d.source)
            .reverse()
            .skipWhile(d => d !== item)
            .skip(1)
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
                for (const listItem of this.listData.selectMany(g => g.source)) {
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
                this.selectedValues = this.selectedValues.filter(d => d !== item);
            } else {
                item.selected = true;
                this.selectedValues = [...this.selectedValues, item];
            }
            this.valueChange.emit({
                value: this.selectedValues,
                via
            });
        }
        this.highlightedItem = item;
    }

    private highlightFirstItem(): void {
        this.highlightedItem = ListComponent.findFirstNonDisabledItem(this.listData);
        if (this.highlightedItem) {
            this.setKeyManagerActiveItem(this.highlightedItem);
        }
    }

    private highlightInitialSelectedItem(): void {
        if (this.selectedValues.length > 0) {
            if (this.selectionMode === "single") {
                this.highlightedItem = this.selectedValues[this.selectedValues.length - 1];
                this.setKeyManagerActiveItem(this.highlightedItem);
            } else {
                this.highlightedItem = this.selectedValues[this.selectedValues.length - 1];
                this.setKeyManagerActiveItem(this.highlightedItem);
            }
        } else {
            this.highlightFirstItem();
        }
    }

    private highlightNextItem(): void {
        if (this.highlightedItem) {
            const nextItem = ListComponent.findNextNotDisabledItem(this.listData, this.highlightedItem);
            if (nextItem) {
                this.highlightedItem = nextItem;
                this.setKeyManagerActiveItem(this.highlightedItem);
            }
        }
    }

    private highlightPreviousItem(): void {
        if (this.highlightedItem) {
            const previousItem = ListComponent.findPrevNotDisabledItem(this.listData, this.highlightedItem);
            if (previousItem) {
                this.highlightedItem = previousItem;
                this.setKeyManagerActiveItem(previousItem);
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
                    if (!this.highlightedItem) {
                        this.highlightFirstItem();
                        if (this.selectionMode === "single" && this.highlightedItem) {
                            this.onDropDownItemSelect(this.highlightedItem, "navigation");
                        }
                    } else {
                        this.highlightNextItem();
                        if (this.selectionMode === "single") {
                            this.onDropDownItemSelect(this.highlightedItem, "navigation");
                        }
                    }
                } else if (event.key === "ArrowUp") {
                    if (this.highlightedItem) {
                        this.highlightPreviousItem();
                        if (this.selectionMode === "single") {
                            this.onDropDownItemSelect(this.highlightedItem, "navigation");
                        }
                    }
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
            const keyManagerItem = this.listItemComponents.find(d => d.item === this.highlightedItem);
            if (keyManagerItem) {
                this.keyManager.setActiveItem(keyManagerItem);
            }
        }
    }

    private updateSelectedValues(): void {
        for (const item of this.listData.selectMany(g => g.source)) {
            item.selected = this.selectedValues.includes(item);
        }
    }
}
