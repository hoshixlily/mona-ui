import {
    AfterViewInit,
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
import { DropDownListDataItem } from "../../../dropdowns/modules/drop-down-list/models/DropDownListDataItem";
import { DropDownListItemComponent } from "../../../dropdowns/modules/drop-down-list/components/drop-down-list-item/drop-down-list-item.component";

@Component({
    selector: "mona-list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    private disabler?: Action<any, boolean>;
    private itemCount: number = 0;
    private keyManager!: ActiveDescendantKeyManager<ListItemComponent>;
    public listData: List<Group<string, ListItem>> = new List<Group<string, ListItem>>();
    public selectedItem: ListItem | null = null;

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

    @Input()
    public textField?: string;

    @Input()
    public value?: unknown;

    @Output()
    public valueChange: EventEmitter<unknown> = new EventEmitter<unknown>();

    @Input()
    public valueField?: string;

    public constructor(private readonly elemenRef: ElementRef<HTMLElement>, private readonly zone: NgZone) {}

    public ngAfterViewInit(): void {
        this.keyManager = new ActiveDescendantKeyManager<ListItemComponent>(this.listItemComponents).skipPredicate(
            li => !!li.item?.disabled
        );
        this.setEventListeners();
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        if (this.value) {
            if (this.disabler?.(this.value)) {
                return;
            }
            this.selectedItem = this.listData.selectMany(g => g.source).firstOrDefault(d => d.data === this.value);
            this.setKeyManagerActiveItem(this.selectedItem);
        }
    }

    public onDropDownItemClick(item: ListItem): void {
        this.selectedItem = item;
        this.value = item.data;
        this.valueChange.emit(item.data);
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
                                selected: this.value === d,
                                text: this.textField ? d[this.textField] : d,
                                value: this.valueField ? d[this.valueField] : d
                            } as DropDownListDataItem;
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
                        selected: this.value === d,
                        text: this.textField ? d[this.textField] : d,
                        value: this.valueField ? d[this.valueField] : d
                    } as DropDownListDataItem;
                })
                .toList();
            this.listData.add(new Group<string, any>("", items));
        }
        this.updateDisabledState();
    }

    private selectFirstItem(): void {
        this.selectedItem = this.findFirstNonDisabledItem();
        if (this.selectedItem) {
            this.value = this.selectedItem.data;
            this.valueChange.emit(this.value);
            this.setKeyManagerActiveItem(this.selectedItem);
        }
    }

    private selectNextItem(): void {
        if (this.selectedItem) {
            const nextItem = this.findNextNotDisabledItem(this.selectedItem);
            if (nextItem) {
                this.selectedItem = nextItem;
                this.setKeyManagerActiveItem(this.selectedItem);
                this.value = nextItem.data;
                this.valueChange.emit(nextItem.data);
            }
        }
    }

    private selectPreviousItem(): void {
        if (this.selectedItem) {
            const previousItem = this.findPrevNotDisabledItem(this.selectedItem);
            if (previousItem) {
                this.selectedItem = previousItem;
                this.setKeyManagerActiveItem(previousItem);
                this.value = previousItem.data;
                this.valueChange.emit(previousItem.data);
            }
        }
    }

    private setEventListeners(): void {
        this.zone.runOutsideAngular(() => {
            fromEvent<KeyboardEvent>(document, "keydown")
                .pipe(
                    takeUntil(this.componentDestroy$),
                    filter(() => !this.disabled),
                    filter(e => e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")
                )
                .subscribe(e => {
                    e.preventDefault();
                    if (e.key === "ArrowDown") {
                        this.zone.run(() => {
                            if (!this.selectedItem) {
                                this.selectFirstItem();
                            } else {
                                this.selectNextItem();
                            }
                        });
                    } else if (e.key === "ArrowUp") {
                        this.zone.run(() => {
                            this.keyManager.setPreviousItemActive();
                            this.selectedItem = this.keyManager.activeItem?.item ?? null;
                        });
                    } else if (e.key === "Enter") {
                        this.zone.run(() => {
                            if (this.keyManager.activeItem?.item) {
                                this.value = this.keyManager.activeItem.item.data;
                                this.valueChange.emit(this.value);
                            }
                        });
                    } else {
                        this.zone.run(() => {
                            this.keyManager.onKeydown(e);
                        });
                    }
                });
            fromEvent(this.elemenRef.nativeElement, "keydown")
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
                        this.zone.run(() => {
                            if (!this.selectedItem) {
                                this.selectFirstItem();
                            } else {
                                this.selectNextItem();
                            }
                        });
                    } else if (event.key === "ArrowUp") {
                        this.zone.run(() => {
                            this.keyManager.setPreviousItemActive();
                            this.selectedItem = this.keyManager.activeItem?.item ?? null;
                        });
                    } else if (event.key === "Enter") {
                        this.zone.run(() => {
                            if (this.keyManager.activeItem?.item) {
                                this.value = this.keyManager.activeItem.item.data;
                                this.valueChange.emit(this.value);
                            }
                        });
                    }
                });
        });
    }

    private setKeyManagerActiveItem(item: ListItemComponent | DropDownListDataItem): void {
        if (item instanceof ListItemComponent) {
            this.keyManager.setActiveItem(item);
        } else {
            const keyManagerItem = this.listItemComponents.find(d => d.item === this.selectedItem);
            if (keyManagerItem) {
                this.keyManager.setActiveItem(keyManagerItem);
            }
        }
    }

    private updateDisabledState(): void {
        if (this.disabler) {
            for (const item of this.listData.selectMany(g => g.source)) {
                item.disabled = this.disabler(item.data);
            }
        }
    }
}
