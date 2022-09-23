import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { debounce, debounceTime, EMPTY, fromEvent, of, Subject, switchMap, take, takeUntil, timer } from "rxjs";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { faChevronDown, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ListItem } from "../../../../../shared/data/ListItem";
import { Group, List } from "@mirei/ts-collections";
import { Action } from "../../../../../utils/Action";
import { FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import { PopupService } from "../../../../../popup/services/popup.service";
import { ListComponent } from "../../../../../shared/components/list/list.component";
import { ValueChangeEvent } from "../../../../../shared/data/ValueChangeEvent";
import { ConnectionPositionPair } from "@angular/cdk/overlay";

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
    public readonly valueKeydown$: Subject<Event> = new Subject();
    public highlightedItem: ListItem | null = null;
    public listData: List<Group<string, ListItem>> = new List();
    public selectedListItems: ListItem[] = [];
    public valueText: string = "";
    public viewData: List<Group<string, ListItem>> = new List();

    @Input()
    public autoClose: boolean = false;

    @Input()
    public data: Iterable<any> = [];

    @Input()
    public disabled: boolean = false;

    @Input()
    public groupField?: string;

    // @ContentChild(ComboBoxGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<void>;

    @Input()
    public itemDisabler: Action<any, boolean> | string | null = null;

    // @ContentChild(ComboBoxItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<void>;

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
            const listItems = this.viewData
                .selectMany(g => g.source)
                .where(i => this.value.includes(i.data))
                .toArray();
            this.selectedListItems = listItems.filter(i => !i.disabled);
        }

        this.setSubscriptions();
        this.setEventListeners();
    }

    public onSelectedItemRemove(item: ListItem): void {
        this.selectedListItems = this.selectedListItems.filter(i => i !== item);
        this.value = this.selectedListItems.map(i => i.data);
        this.valueChange.emit(this.value);
    }

    public onSelectedListItemsChange(event: ValueChangeEvent): void {
        this.selectedListItems = event.value;
        if (event.via === "selection" && this.autoClose) {
            this.popupRef?.close();
            this.popupRef = null;
        }
        if (!this.autoClose) {
            this.inputElement?.focus();
        }
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

        this.inputElement?.focus();
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            if (this.value.length !== this.selectedListItems.length) {
                this.value = this.selectedListItems.map(i => i.data);
                this.valueChange.emit(this.value);
            }
            this.popupRef = null;
            this.filterChange$.next("");
            (this.elementRef.nativeElement.firstElementChild as HTMLElement)?.focus();
            this.viewData = this.listData.toList();
        });
    }

    private setEventListeners(): void {
        // fromEvent(this.elementRef.nativeElement, "focusin")
        //     .pipe(takeUntil(this.componentDestroy$))
        //     .subscribe(e => {
        //         if (!this.popupRef) {
        //             this.viewData = this.listData.toList();
        //             this.open();
        //         }
        //     });
        // this.focusMonitor
        //     .monitor(this.elementRef.nativeElement, true)
        //     .pipe(
        //         takeUntil(this.componentDestroy$),
        //         debounceTime(100),
        //         switchMap((origin: FocusOrigin) => {
        //             if (!origin) {
        //                 this.popupRef?.close();
        //                 this.popupRef = null;
        //             }
        //             return EMPTY;
        //         })
        //     )
        //     .subscribe();
        this.resizeObserver = new ResizeObserver(() => {
            window.setTimeout(() => {
                this.popupRef?.overlayRef.updatePosition();
                this.popupRef?.overlayRef.updateSize({ width: this.elementRef.nativeElement.clientWidth });
            });
        });
        this.resizeObserver.observe(this.elementRef.nativeElement);
    }

    private setSubscriptions(): void {
        this.valueKeydown$
            .pipe(
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
                            : ListComponent.findFirstNonDisabledItem(this.viewData);
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
                } else if (event.key === "Enter") {
                    if (!this.popupRef) {
                        return;
                    }
                    event.preventDefault();
                    if (this.highlightedItem) {
                        if (this.selectedListItems.includes(this.highlightedItem)) {
                            this.selectedListItems = this.selectedListItems.filter(i => i !== this.highlightedItem);
                        } else {
                            this.selectedListItems = [...this.selectedListItems, this.highlightedItem];
                        }
                        this.value = this.selectedListItems.map(i => i.data);
                        this.valueChange.emit(this.value);
                    }
                    this.popupRef?.close();
                    this.popupRef = null;
                } else if (event.key === "Backspace") {
                    if (this.popupRef) {
                        this.popupRef?.close();
                        this.popupRef = null;
                    }
                    if (this.selectedListItems.length > 0) {
                        this.selectedListItems = this.selectedListItems.slice(0, -1);
                        this.value = this.selectedListItems.map(i => i.data);
                        this.valueChange.emit(this.value);
                    }
                }
            });
    }

    private get inputElement(): HTMLInputElement {
        return this.elementRef.nativeElement.querySelector("input:first-child") as HTMLInputElement;
    }
}
