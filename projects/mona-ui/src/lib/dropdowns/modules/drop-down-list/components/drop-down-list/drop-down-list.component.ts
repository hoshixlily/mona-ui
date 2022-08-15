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
    ViewChild,
    ViewChildren
} from "@angular/core";
import { PopupService } from "../../../../../popup/services/popup.service";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { debounceTime, fromEvent, Subject, take, takeUntil } from "rxjs";
import { Enumerable, Group, IndexableList } from "@mirei/ts-collections";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { DropDownListDataItem } from "../../models/DropDownListDataItem";
import { DropDownListItemTemplateDirective } from "../../directives/drop-down-list-item-template.directive";
import { DropDownListValueTemplateDirective } from "../../directives/drop-down-list-value-template.directive";
import { DropDownListGroupTemplateDirective } from "../../directives/drop-down-list-group-template.directive";
import { DropDownListItemComponent } from "../drop-down-list-item/drop-down-list-item.component";
import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { Action } from "../../../../../utils/Action";

@Component({
    selector: "mona-drop-down-list",
    templateUrl: "./drop-down-list.component.html",
    styleUrls: ["./drop-down-list.component.scss"]
})
export class DropDownListComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly componentDestroy$: Subject<void> = new Subject();
    private disabler?: Action<any, boolean>;
    private dropdownPopupRef: PopupRef | null = null;
    private itemCount: number = 0;
    private keyManager!: ActiveDescendantKeyManager<DropDownListItemComponent>;
    public dropdownData: IndexableList<Group<string, DropDownListDataItem>> = new IndexableList<
        Group<string, DropDownListDataItem>
    >();
    public selectedItem: DropDownListDataItem | null = null;

    @Input()
    public set data(data: Iterable<any>) {
        this.processDropdownData(data);
    }

    @Input()
    public disabled: boolean = false;

    @ViewChild("dropdownPopupTemplate")
    public dropdownPopupTemplate!: TemplateRef<void>;

    @ViewChild("dropdownWrapper")
    public dropdownWrapper!: ElementRef<HTMLDivElement>;

    @Input()
    public groupField?: string;

    @ContentChild(DropDownListGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<void>;

    @Input()
    public set itemDisabler(disabler: Action<any, boolean> | string) {
        if (typeof disabler === "string") {
            this.disabler = (item: any) => !!item?.[disabler] ?? false;
        } else {
            this.disabler = disabler;
        }
        this.updateDisabledState();
    }

    @ContentChild(DropDownListItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<void>;

    @ViewChildren(DropDownListItemComponent)
    public dropdownListItemComponents: QueryList<DropDownListItemComponent> = new QueryList<DropDownListItemComponent>();

    @Input()
    public textField?: string;

    @Input()
    public value?: any;

    @Output()
    public valueChange: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    public valueField?: string;

    @ContentChild(DropDownListValueTemplateDirective, { read: TemplateRef })
    public valueTemplate?: TemplateRef<void>;

    public constructor(
        private readonly elementRef: ElementRef<HTMLDivElement>,
        private readonly popupService: PopupService,
        private readonly zone: NgZone
    ) {}

    public ngAfterViewInit(): void {
        this.keyManager = new ActiveDescendantKeyManager<DropDownListItemComponent>(
            this.dropdownListItemComponents
        ).skipPredicate(i => !!i.dataItem?.disabled);
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
            this.selectedItem = this.dropdownData.selectMany(g => g.source).firstOrDefault(d => d.data === this.value);
            this.setKeyManagerActiveItem(this.selectedItem);
        }
    }

    public onDropDownItemClick(item: DropDownListDataItem, close: boolean = true): void {
        this.selectedItem = item;
        this.value = item.data;
        this.valueChange.emit(item.data);
        if (close) {
            this.dropdownPopupRef?.close();
            this.dropdownWrapper.nativeElement.focus();
        }
    }

    public openDropdown(): void {
        this.dropdownWrapper.nativeElement.focus();
        this.dropdownPopupRef = this.popupService.create({
            anchor: this.dropdownWrapper,
            content: this.dropdownPopupTemplate,
            hasBackdrop: true,
            withPush: false,
            width: this.elementRef.nativeElement.clientWidth,
            offset: {
                vertical: 0
            },
            popupClass: ["mona-dropdown-popup-content"],
            positions: [
                new ConnectionPositionPair(
                    { originX: "start", originY: "bottom" },
                    { overlayX: "start", overlayY: "top" }
                )
            ]
        });
        this.dropdownPopupRef.closed.pipe(take(1)).subscribe(() => {
            this.dropdownPopupRef = null;
        });
        window.setTimeout(() => {
            if (this.selectedItem) {
                this.setKeyManagerActiveItem(this.selectedItem);
            }
        });
    }

    private findFirstNonDisabledItem(): DropDownListDataItem | null {
        return this.dropdownData.selectMany(g => g.source).firstOrDefault(d => !d.disabled);
    }

    private findNextNotDisabledItem(item: DropDownListDataItem): DropDownListDataItem | null {
        return this.dropdownData
            .selectMany(d => d.source)
            .skipWhile(d => d !== item)
            .skip(1)
            .skipWhile(d => !!d.disabled)
            .firstOrDefault();
    }

    private findPrevNotDisabledItem(item: DropDownListDataItem): DropDownListDataItem | null {
        return this.dropdownData
            .selectMany(d => d.source)
            .reverse()
            .skipWhile(d => d !== item)
            .skip(1)
            .skipWhile(d => !!d.disabled)
            .firstOrDefault();
    }

    private processDropdownData(data: Iterable<any>): void {
        this.dropdownData.clear();
        let index = 0;
        if (this.groupField) {
            this.dropdownData = Enumerable.from(data)
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
                .toIndexableList();
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
                .toIndexableList();
            this.dropdownData.add(new Group<string, any>("", items));
        }
        this.updateDisabledState();
    }

    private selectFirstItem(): void {
        this.selectedItem = this.findFirstNonDisabledItem();
        if (this.selectedItem) {
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
            fromEvent(document, "keydown")
                .pipe(takeUntil(this.componentDestroy$), debounceTime(10))
                .subscribe((e: Event) => {
                    if (!this.dropdownPopupRef) {
                        return;
                    }
                    e.stopPropagation();
                    const event = e as KeyboardEvent;
                    if (event.key === "ArrowDown") {
                        this.zone.run(() => {
                            if (!this.selectedItem) {
                                this.keyManager.setFirstItemActive();
                                this.selectedItem = this.keyManager.activeItem?.dataItem ?? null;
                            }
                            this.keyManager.setNextItemActive();
                            this.selectedItem = this.keyManager.activeItem?.dataItem ?? null;
                        });
                    } else if (event.key === "ArrowUp") {
                        this.zone.run(() => {
                            this.keyManager.setPreviousItemActive();
                            this.selectedItem = this.keyManager.activeItem?.dataItem ?? null;
                        });
                    } else if (event.key === "Enter") {
                        this.zone.run(() => {
                            if (this.dropdownPopupRef) {
                                if (this.keyManager.activeItem?.dataItem) {
                                    this.onDropDownItemClick(this.keyManager.activeItem?.dataItem);
                                }
                                this.dropdownPopupRef?.close();
                                return;
                            }
                        });
                    } else {
                        this.zone.run(() => this.keyManager.onKeydown(event));
                    }
                });
            fromEvent(this.elementRef.nativeElement, "keydown")
                .pipe(takeUntil(this.componentDestroy$))
                .subscribe((e: Event) => {
                    if (this.dropdownPopupRef) {
                        return;
                    }
                    e.stopPropagation();
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
                        this.zone.run(() => this.selectPreviousItem());
                    } else if (event.key === "Enter") {
                        this.zone.run(() => this.openDropdown());
                    }
                });
        });
    }

    private setKeyManagerActiveItem(item: DropDownListItemComponent | DropDownListDataItem): void {
        if (item instanceof DropDownListItemComponent) {
            this.keyManager.setActiveItem(item);
        } else {
            const keyManagerItem = this.dropdownListItemComponents.find(d => d.dataItem === this.selectedItem);
            if (keyManagerItem) {
                this.keyManager.setActiveItem(keyManagerItem);
            }
        }
    }

    private updateDisabledState(): void {
        for (const item of this.dropdownData.selectMany(g => g.source)) {
            if (this.disabler) {
                item.disabled = this.disabler(item.data);
            }
        }
    }
}
