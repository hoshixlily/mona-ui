import {
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { debounce, debounceTime, fromEvent, mergeWith, of, Subject, take, takeUntil, timer } from "rxjs";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { faChevronDown, faSearch, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ListItem } from "../../../../../shared/data/ListItem";
import { Enumerable, Group, List } from "@mirei/ts-collections";
import { Action } from "../../../../../utils/Action";
import { FocusMonitor } from "@angular/cdk/a11y";
import { PopupService } from "../../../../../popup/services/popup.service";
import { ListComponent } from "../../../../../shared/components/list/list.component";
import { ValueChangeEvent } from "../../../../../shared/data/ValueChangeEvent";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { MultiSelectGroupTemplateDirective } from "../../directives/multi-select-group-template.directive";
import { MultiSelectItemTemplateDirective } from "../../directives/multi-select-item-template.directive";

@Component({
    selector: "mona-multi-select",
    templateUrl: "./multi-select.component.html",
    styleUrls: ["./multi-select.component.scss"]
})
export class MultiSelectComponent implements OnInit, OnDestroy {
    private readonly componentDestroy$: Subject<void> = new Subject();
    private popupRef: PopupRef | null = null;
    private resizeObserver: ResizeObserver | null = null;
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    public readonly filterChange$: Subject<string> = new Subject();
    public readonly filterKeydown$: Subject<Event> = new Subject();
    public readonly filterIcon: IconDefinition = faSearch;
    public filterText: string = "";
    public highlightedItem: ListItem | null = null;
    public listData: List<Group<string, ListItem>> = new List();
    public selectedListItems: ListItem[] = [];
    // public valueText: string = "";
    public viewData: List<Group<string, ListItem>> = new List();

    @Input()
    public data: Iterable<any> = [];

    @Input()
    public disabled: boolean = false;

    @Input()
    public filterable: boolean = true;

    @Input()
    public groupField?: string;

    @ContentChild(MultiSelectGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<void>;

    @Input()
    public itemDisabler: Action<any, boolean> | string | null = null;

    @ContentChild(MultiSelectItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<void>;

    @ViewChild("listComponent")
    public listComponent!: ListComponent;

    @ViewChild("multiSelectPopupTemplate")
    public multiSelectPopupTemplate!: TemplateRef<void>;

    @ViewChild("multiSelectWrapper")
    public multiSelectWrapper!: ElementRef<HTMLDivElement>;

    @Input()
    public textField?: string;

    @Input()
    public value: any[] = [];

    @Output()
    public valueChange: EventEmitter<any[]> = new EventEmitter<any[]>();

    @Input()
    public valueField?: string;

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly focusMonitor: FocusMonitor,
        private readonly popupService: PopupService
    ) {}

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
        this.resizeObserver?.disconnect();
    }

    public ngOnInit(): void {
        this.listData = ListComponent.createListData({
            data: this.data,
            groupField: this.groupField,
            disabler: ListComponent.getDisabler(this.itemDisabler) ?? undefined,
            textField: this.textField,
            valueField: this.valueField
        });

        this.viewData = this.listData.toList();

        if (this.value) {
            const valueEnumerable = Enumerable.from(this.value);
            const listItems = this.viewData
                .selectMany(g => g.source)
                .where(i => valueEnumerable.any(v => i.dataEquals(v)))
                .toArray();
            this.selectedListItems = listItems.filter(i => !i.disabled);
            this.highlightedItem = Enumerable.from(listItems).lastOrDefault(i => !i.disabled);
        }

        this.setSubscriptions();
        this.setEventListeners();
    }

    public onSelectedItemRemove(event: Event, item: ListItem): void {
        event.stopPropagation();
        this.selectedListItems = this.selectedListItems.filter(i => i !== item);
        this.value = this.selectedListItems.map(i => i.data);
        this.valueChange.emit(this.value);
    }

    public onSelectedListItemsChange(event: ValueChangeEvent): void {
        this.selectedListItems = event.value;
    }

    public open(): void {
        this.popupRef = this.popupService.create({
            anchor: this.multiSelectWrapper,
            content: this.multiSelectPopupTemplate,
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

        this.highlightLastSelectedItem();

        window.setTimeout(() => {
            this.listComponent.scrollToHighlightedItem();
        });

        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            if (this.value.length !== this.selectedListItems.length) {
                this.value = this.selectedListItems.map(i => i.data);
                this.valueChange.emit(this.value);
            }
            this.popupRef = null;
            this.filterChange$.next("");
            (this.elementRef.nativeElement.firstElementChild as HTMLElement)?.focus();
            this.viewData = this.listData.toList();
            this.highlightedItem = null;
        });
    }

    private filterListData(filter: string): void {
        if (!filter) {
            this.viewData = this.listData.toList();
            this.highlightLastSelectedItem();
        }
        this.viewData = this.listData
            .select(g => {
                const items = g.source
                    .where(i => (!filter ? true : i.text.toLowerCase().includes(filter.toLowerCase())))
                    .toList();
                return new Group(g.key, items);
            })
            .toList();
        if (this.highlightedItem && !this.viewData.selectMany(g => g.source).any(i => i.equals(this.highlightedItem))) {
            this.highlightedItem = null;
        }
    }

    private highlightLastSelectedItem(): void {
        this.highlightedItem =
            this.selectedListItems.length > 0
                ? this.viewData
                      .selectMany(g => g.source)
                      .firstOrDefault(
                          i => !i.disabled && i.equals(this.selectedListItems[this.selectedListItems.length - 1])
                      )
                : this.viewData.selectMany(g => g.source).firstOrDefault(i => !i.disabled);
    }

    private setEventListeners(): void {
        this.resizeObserver = new ResizeObserver(() => {
            window.setTimeout(() => {
                this.popupRef?.overlayRef.updatePosition();
                this.popupRef?.overlayRef.updateSize({ width: this.elementRef.nativeElement.clientWidth });
            });
        });
        this.resizeObserver.observe(this.elementRef.nativeElement);
    }

    private setSubscriptions(): void {
        fromEvent(this.elementRef.nativeElement, "keydown")
            .pipe(
                mergeWith(this.filterKeydown$),
                takeUntil(this.componentDestroy$),
                debounce(e => {
                    const key = (e as KeyboardEvent).key;
                    if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter") {
                        return of(e);
                    }
                    return timer(20);
                })
            )
            .subscribe(e => {
                const event = e as KeyboardEvent;
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    if (!this.popupRef) {
                        this.open();
                    } else {
                        const nextItem = this.highlightedItem
                            ? ListComponent.findNextNotDisabledItem(this.viewData, this.highlightedItem)
                            : ListComponent.findFirstNotDisabledItem(this.viewData);
                        if (nextItem) {
                            this.highlightedItem = nextItem;
                        }
                    }
                } else if (event.key === "ArrowUp") {
                    if (!this.popupRef) {
                        return;
                    }
                    event.preventDefault();
                    const prevItem = this.highlightedItem
                        ? ListComponent.findPrevNotDisabledItem(this.viewData, this.highlightedItem)
                        : ListComponent.findLastNonDisabledItem(this.viewData);
                    if (prevItem) {
                        this.highlightedItem = prevItem;
                    }
                } else if (event.key === "Escape") {
                    return;
                } else if (event.key === "Enter") {
                    if (!this.popupRef) {
                        this.open();
                        return;
                    }
                    if (
                        event.target instanceof HTMLInputElement &&
                        !this.viewData
                            .selectMany(g => g.source)
                            .any(i =>
                                i.text.toLowerCase().startsWith((event.target as HTMLInputElement).value.toLowerCase())
                            )
                    ) {
                        e.stopImmediatePropagation();
                        return;
                    }
                    event.preventDefault();
                    if (this.highlightedItem) {
                        if (!this.viewData.selectMany(g => g.source).any(i => i.equals(this.highlightedItem))) {
                            return;
                        }
                        if (this.selectedListItems.includes(this.highlightedItem)) {
                            this.selectedListItems = this.selectedListItems.filter(
                                i => !i.equals(this.highlightedItem)
                            );
                        } else {
                            this.selectedListItems = [...this.selectedListItems, this.highlightedItem];
                        }
                        this.value = this.selectedListItems.map(i => i.data);
                        this.valueChange.emit(this.value);
                    }
                }
            });
        this.filterChange$.pipe(takeUntil(this.componentDestroy$), debounceTime(50)).subscribe(filter => {
            this.filterText = filter;
            this.filterListData(filter);
        });
    }
}
