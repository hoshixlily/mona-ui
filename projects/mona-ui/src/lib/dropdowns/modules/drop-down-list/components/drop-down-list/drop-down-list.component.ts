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
    TemplateRef,
    ViewChild
} from "@angular/core";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { debounce, debounceTime, fromEvent, mergeWith, of, Subject, take, takeUntil, timer } from "rxjs";
import { Group, List } from "@mirei/ts-collections";
import { DropDownListItemTemplateDirective } from "../../directives/drop-down-list-item-template.directive";
import { DropDownListValueTemplateDirective } from "../../directives/drop-down-list-value-template.directive";
import { DropDownListGroupTemplateDirective } from "../../directives/drop-down-list-group-template.directive";
import { Action } from "../../../../../utils/Action";
import { ListItem } from "../../../../../shared/data/ListItem";
import { ValueChangeEvent } from "../../../../../shared/data/ValueChangeEvent";
import { ListComponent } from "../../../../../shared/components/list/list.component";
import { PopupService } from "../../../../../popup/services/popup.service";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { faChevronDown, faSearch, IconDefinition } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "mona-drop-down-list",
    templateUrl: "./drop-down-list.component.html",
    styleUrls: ["./drop-down-list.component.scss"]
})
export class DropDownListComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly componentDestroy$: Subject<void> = new Subject();
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    public readonly filterChange$: Subject<string> = new Subject();
    public readonly filterKeydown$: Subject<Event> = new Subject();
    public readonly filterIcon: IconDefinition = faSearch;
    public filterText: string = "";
    public listData: List<Group<string, ListItem>> = new List();
    public popupRef: PopupRef | null = null;
    public selectedListItems: ListItem[] = [];
    public viewData: List<Group<string, ListItem>> = new List();

    @Input()
    public data: Iterable<any> = [];

    @Input()
    public disabled: boolean = false;

    @ViewChild("dropdownPopupTemplate")
    public dropdownPopupTemplate!: TemplateRef<void>;

    @ViewChild("dropdownWrapper")
    public dropdownWrapper!: ElementRef<HTMLDivElement>;

    @Input()
    public filterable: boolean = false;

    @Input()
    public groupField?: string;

    @ContentChild(DropDownListGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<void>;

    @Input()
    public itemDisabler: Action<any, boolean> | string | null = null;

    @ContentChild(DropDownListItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<void>;

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
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupService: PopupService
    ) {}

    public ngAfterViewInit(): void {}

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        this.listData = ListComponent.createListData({
            data: this.data,
            disabler: ListComponent.getDisabler(this.itemDisabler) ?? undefined,
            groupField: this.groupField,
            textField: this.textField,
            valueField: this.valueField
        });

        this.viewData = this.listData;

        if (this.value) {
            const listItem = this.viewData.selectMany(g => g.source).firstOrDefault(i => i.data === this.value);
            this.selectedListItems = listItem && !listItem.disabled ? [listItem] : [];
        }
        this.setEventListeners();
        this.setSubscriptions();
    }

    public onSelectedListItemsChange(event: ValueChangeEvent): void {
        this.selectedListItems = event.value;
        if (event.via === "selection") {
            this.popupRef?.close();
            this.popupRef = null;
        }
    }

    public open(): void {
        this.dropdownWrapper.nativeElement.focus();
        this.popupRef = this.popupService.create({
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
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            if (this.value != null) {
                if (this.value !== this.selectedListItems[0]?.data) {
                    this.value = this.selectedListItems[0]?.data;
                    this.valueChange.emit(this.value);
                }
            } else if (this.selectedListItems.length > 0) {
                this.value = this.selectedListItems[0].data;
                this.valueChange.emit(this.value);
            }
            this.popupRef = null;
            this.filterChange$.next("");
            (this.elementRef.nativeElement.firstElementChild as HTMLElement)?.focus();
        });
    }

    private filterListData(filter: string): void {
        this.viewData = this.listData
            .select(g => {
                const items = g.source
                    .where(i => (!filter ? true : i.text.toLowerCase().includes(filter.toLowerCase())))
                    .toList();
                return new Group(g.key, items);
            })
            .toList();
    }

    private setEventListeners(): void {
        fromEvent(this.elementRef.nativeElement, "keydown")
            .pipe(
                mergeWith(this.filterKeydown$),
                takeUntil(this.componentDestroy$),
                debounce(e => {
                    const key = (e as KeyboardEvent).key;
                    if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter") {
                        return of(e);
                    }
                    return timer(100);
                })
            )
            .subscribe((e: Event) => {
                e.stopPropagation();
                const event = e as KeyboardEvent;
                if (event.key === "ArrowDown") {
                    e.preventDefault();
                    const nextItem =
                        ListComponent.findNextNotDisabledItem(this.viewData, this.selectedListItems[0]) ??
                        ListComponent.findFirstNonDisabledItem(this.viewData);
                    if (nextItem) {
                        this.selectedListItems = [nextItem];
                        if (!this.popupRef) {
                            this.value = nextItem.data;
                            this.valueChange.emit(this.value);
                        }
                    }
                } else if (event.key === "ArrowUp") {
                    e.preventDefault();
                    const previousItem =
                        ListComponent.findPrevNotDisabledItem(this.viewData, this.selectedListItems[0]) ??
                        ListComponent.findLastNonDisabledItem(this.viewData);
                    if (previousItem) {
                        this.selectedListItems = [previousItem];
                        if (!this.popupRef) {
                            this.value = previousItem.data;
                            this.valueChange.emit(this.value);
                        }
                    }
                } else if (event.key === "Enter") {
                    if (this.elementRef.nativeElement.contains(event.target as HTMLElement)) {
                        if (this.popupRef) {
                            this.popupRef.close();
                            this.popupRef = null;
                        } else {
                            this.open();
                        }
                    } else {
                        this.popupRef?.close();
                        this.popupRef = null;
                    }
                }
            });
    }

    private setSubscriptions(): void {
        this.filterChange$.pipe(takeUntil(this.componentDestroy$), debounceTime(50)).subscribe(filter => {
            this.filterText = filter;
            this.filterListData(filter);
        });
    }
}
