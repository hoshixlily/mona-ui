import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
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

@Component({
    selector: "mona-list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    private disabler?: Action<ListItem, boolean>;
    private itemCount: number = 0;
    private keyManager!: ActiveDescendantKeyManager<ListItemComponent>;
    public highlightedItem: ListItem | null = null;
    public listData: List<Group<string, ListItem>> = new List<Group<string, ListItem>>();

    @Input()
    public set data(data: Iterable<any>) {
        this.processDropdownData(data);
    }

    @Input()
    public disabled: boolean = false;

    @Input()
    public groupField?: string;

    @ContentChild(ListGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<void>;

    @Input()
    public set itemDisabler(disabler: Action<any, boolean> | string) {
        if (typeof disabler === "string") {
            this.disabler = (item: any) => !!item?.[disabler] ?? false;
        } else {
            this.disabler = disabler;
        }
        // this.updateDisabledState();
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
    public textField?: string;

    @Input()
    public value: ListItem[] = [];

    @Output()
    public valueChange: EventEmitter<ListItem[]> = new EventEmitter<ListItem[]>();

    @Input()
    public valueField?: string;

    public constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly zone: NgZone
    ) {}

    public ngAfterViewInit(): void {
        this.keyManager = new ActiveDescendantKeyManager<ListItemComponent>(this.listItemComponents).skipPredicate(
            li => !!li.item?.disabled
        );
        // this.elemenRef.nativeElement.tabIndex = 0;
        this.setEventListeners();
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        if (this.selectionMode === "single") {
            if (this.value.length !== 0) {
                for (const item of this.listData.selectMany(g => g.source)) {
                    item.selected = this.value[0] === item;
                }
            }
        } else {
            for (const item of this.listData.selectMany(g => g.source)) {
                item.selected = this.value.includes(item);
            }
        }
    }

    public onDropDownItemClick(item: ListItem): void {
        if (this.selectionMode === "single") {
            if (this.value.length !== 0) {
                for (const listItem of this.listData.selectMany(g => g.source)) {
                    listItem.selected = false;
                }
            }
            item.selected = true;
            this.value = [item];
            this.valueChange.emit(this.value);
        } else {
            if (this.value.includes(item)) {
                item.selected = false;
                this.value = this.value.filter(d => d !== item);
            } else {
                item.selected = true;
                this.value = [...this.value, item];
            }
            this.valueChange.emit(this.value);
        }
        this.highlightedItem = item;
    }

    private findFirstNonDisabledItem(): ListItem | null {
        return this.listData.selectMany(g => g.source).firstOrDefault(d => !d.disabled);
    }

    private findNextNotDisabledItem(item: ListItem): ListItem | null {
        return this.listData
            .selectMany(d => d.source)
            .skipWhile(d => d !== item)
            .skip(1)
            .skipWhile(d => !!d.disabled)
            .firstOrDefault();
    }

    private findPrevNotDisabledItem(item: ListItem): ListItem | null {
        return this.listData
            .selectMany(d => d.source)
            .reverse()
            .skipWhile(d => d !== item)
            .skip(1)
            .skipWhile(d => !!d.disabled)
            .firstOrDefault();
    }

    private processDropdownData(data: Iterable<any>): void {
        this.listData.clear();
        let index = 0;
        if (this.groupField) {
            this.listData = Enumerable.from(data)
                .groupBy(d => d[this.groupField as string])
                .select(g => {
                    const items = g.source
                        .select(d => {
                            this.itemCount++;
                            return {
                                data: d,
                                index: index++,
                                selected: this.value.map(v => v.data).includes(d),
                                text: this.textField ? d[this.textField] : d,
                                value: this.valueField ? d[this.valueField] : d
                            } as ListItem;
                        })
                        .toIndexableList();
                    return new Group(g.key, items);
                })
                .orderBy(g => g.key)
                .toList();
        } else {
            const items = Enumerable.from(data)
                .select(d => {
                    this.itemCount++;
                    return {
                        data: d,
                        index: index++,
                        selected: this.value.map(v => v.data).includes(d),
                        text: this.textField ? d[this.textField] : d,
                        value: this.valueField ? d[this.valueField] : d
                    } as ListItem;
                })
                .toList();
            this.listData.add(new Group<string, any>("", items));
        }
        this.updateDisabledState();
    }

    private highlightFirstItem(): void {
        this.highlightedItem = this.findFirstNonDisabledItem();
        if (this.highlightedItem) {
            this.setKeyManagerActiveItem(this.highlightedItem);
            if (this.selectionMode === "single") {
                this.onDropDownItemClick(this.highlightedItem);
            }
            this.cdr.detectChanges();
        }
    }

    private highlightNextItem(): void {
        if (this.highlightedItem) {
            const nextItem = this.findNextNotDisabledItem(this.highlightedItem);
            if (nextItem) {
                this.highlightedItem = nextItem;
                this.setKeyManagerActiveItem(this.highlightedItem);
                if (this.selectionMode === "single") {
                    this.onDropDownItemClick(this.highlightedItem);
                }
                this.cdr.detectChanges();
            }
        }
    }

    private highlightPreviousItem(): void {
        if (this.highlightedItem) {
            const previousItem = this.findPrevNotDisabledItem(this.highlightedItem);
            if (previousItem) {
                this.highlightedItem = previousItem;
                this.setKeyManagerActiveItem(previousItem);
                if (this.selectionMode === "single") {
                    this.onDropDownItemClick(this.highlightedItem);
                }
                this.cdr.detectChanges();
            }
        }
    }

    private setEventListeners(): void {
        // this.zone.runOutsideAngular(() => {
        // fromEvent<KeyboardEvent>(document, "keydown")
        //     .pipe(
        //         takeUntil(this.componentDestroy$),
        //         filter(() => !this.disabled),
        //         filter(e => e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")
        //     )
        //     .subscribe(e => {
        //         e.preventDefault();
        //         if (e.key === "ArrowDown") {
        //             this.zone.run(() => {
        //                 if (!this.highlightedItem) {
        //                     this.highlightFirstItem();
        //                 } else {
        //                     this.highlightNextItem();
        //                 }
        //             });
        //         } else if (e.key === "ArrowUp") {
        //             this.zone.run(() => {
        //                 if (this.highlightedItem) {
        //                     this.highlightPreviousItem();
        //                 }
        //             });
        //         } else if (e.key === "Enter") {
        //             this.zone.run(() => {
        //                 if (this.keyManager.activeItem?.item) {
        //                     if (this.keyManager.activeItem?.item) {
        //                         this.onDropDownItemClick(this.keyManager.activeItem?.item);
        //                     }
        //                 }
        //             });
        //         } else {
        //             this.zone.run(() => {
        //                 this.keyManager.onKeydown(e);
        //             });
        //         }
        //     });
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
                    // this.zone.run(() => {
                    if (!this.highlightedItem) {
                        this.highlightFirstItem();
                    } else {
                        this.highlightNextItem();
                    }
                    // });
                } else if (event.key === "ArrowUp") {
                    // this.zone.run(() => {
                    if (this.highlightedItem) {
                        this.highlightPreviousItem();
                    }
                    // });
                } else if (event.key === "Enter") {
                    // this.zone.run(() => {
                    if (this.keyManager.activeItem?.item) {
                        this.onDropDownItemClick(this.keyManager.activeItem?.item);
                    }
                    // });
                }
            });
        // });
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

    private updateDisabledState(): void {
        if (this.disabler) {
            for (const item of this.listData.selectMany(g => g.source)) {
                item.disabled = this.disabler(item);
            }
        }
    }
}
