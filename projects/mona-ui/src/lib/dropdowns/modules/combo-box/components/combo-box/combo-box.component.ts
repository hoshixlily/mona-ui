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
import { debounce, debounceTime, EMPTY, of, Subject, take, takeUntil, timer } from "rxjs";
import { Group, List } from "@mirei/ts-collections";
import { ListItem } from "../../../../../shared/data/ListItem";
import { PopupService } from "../../../../../popup/services/popup.service";
import { Action } from "../../../../../utils/Action";
import { ListComponent } from "../../../../../shared/components/list/list.component";
import { faChevronDown, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ValueChangeEvent } from "../../../../../shared/data/ValueChangeEvent";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { ConnectionPositionPair } from "@angular/cdk/overlay";

@Component({
    selector: "mona-combo-box",
    templateUrl: "./combo-box.component.html",
    styleUrls: ["./combo-box.component.scss"]
})
export class ComboBoxComponent implements OnInit, OnDestroy {
    private readonly componentDestroy$: Subject<void> = new Subject();
    private popupRef: PopupRef | null = null;
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    public readonly filterChange$: Subject<string> = new Subject();
    public readonly filterKeydown$: Subject<Event> = new Subject();
    public filterText: string = "";
    public highlightedItem: ListItem | null = null;
    public listData: List<Group<string, ListItem>> = new List();
    public selectedListItems: ListItem[] = [];
    public viewData: List<Group<string, ListItem>> = new List();

    @ViewChild("comboboxPopupTemplate")
    public comboboxPopupTemplate!: TemplateRef<void>;

    @ViewChild("comboboxWrapper")
    public comboboxWrapper!: ElementRef<HTMLDivElement>;

    @Input()
    public data: Iterable<any> = [];

    @Input()
    public disabled: boolean = false;

    @Input()
    public groupField?: string;

    public groupTemplate?: TemplateRef<void>;

    @Input()
    public itemDisabler: Action<any, boolean> | string | null = null;

    public itemTemplate?: TemplateRef<void>;

    @Input()
    public textField?: string;

    @Input()
    public value?: any;

    @Output()
    public valueChange: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    public valueField?: string;

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupService: PopupService
    ) {}

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        this.listData = ListComponent.createListData({
            data: this.data,
            groupField: this.groupField,
            disabler: ListComponent.getDisabler(this.itemDisabler) ?? undefined,
            textField: this.textField,
            valueField: this.valueField
        });

        this.viewData = this.listData;

        if (this.value) {
            const listItem = this.viewData.selectMany(g => g.source).firstOrDefault(i => i.data === this.value);
            this.selectedListItems = listItem && !listItem.disabled ? [listItem] : [];
        }

        this.setSubscriptions();
    }

    public onSelectedListItemsChange(event: ValueChangeEvent): void {
        this.selectedListItems = event.value;
        this.value = this.selectedListItems.length > 0 ? this.selectedListItems[0].data : null;
        this.valueChange.emit(this.value);
        if (event.via === "selection") {
            this.popupRef?.close();
            this.popupRef = null;
        }
        this.filterText = this.selectedListItems[0]?.text ?? "";
    }

    public open(): void {
        // this.comboboxWrapper.nativeElement.focus();
        this.popupRef = this.popupService.create({
            anchor: this.comboboxWrapper,
            content: this.comboboxPopupTemplate,
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
        (this.elementRef.nativeElement.querySelector("input:first-child") as HTMLInputElement)?.focus();
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.filterChange$.next("");
            (this.elementRef.nativeElement.firstElementChild as HTMLElement)?.focus();
        });
    }

    private setSubscriptions(): void {
        this.filterKeydown$
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
                    const nextItem =
                        this.selectedListItems.length > 0
                            ? ListComponent.findNextNotDisabledItem(this.viewData, this.selectedListItems[0])
                            : this.highlightedItem
                            ? ListComponent.findNextNotDisabledItem(this.viewData, this.highlightedItem)
                            : ListComponent.findFirstNonDisabledItem(this.viewData);
                    if (nextItem) {
                        this.selectedListItems = [nextItem];
                        this.value = nextItem.data;
                        this.valueChange.emit(this.value);
                        this.filterText = nextItem.text;
                    }
                } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    const previousItem =
                        this.selectedListItems.length > 0
                            ? ListComponent.findPrevNotDisabledItem(this.viewData, this.selectedListItems[0])
                            : this.highlightedItem
                            ? ListComponent.findPrevNotDisabledItem(this.viewData, this.highlightedItem)
                            : ListComponent.findFirstNonDisabledItem(this.viewData);
                    if (previousItem) {
                        this.selectedListItems = [previousItem];
                        this.value = previousItem.data;
                        this.valueChange.emit(this.value);
                        this.filterText = previousItem.text;
                    }
                } else if (event.key === "Enter") {
                    event.preventDefault();
                    this.popupRef?.close();
                    this.popupRef = null;
                } else {
                    const textInput = this.elementRef.nativeElement.querySelector(
                        "input:first-child"
                    ) as HTMLInputElement;
                    if (textInput) {
                        if (!this.popupRef) {
                            this.open();
                        }
                        const text = textInput.value;
                        const item = this.viewData.selectMany(g => g.source).firstOrDefault(i => i.text === text);
                        if (item) {
                            this.selectedListItems = item && !item.disabled ? [item] : [];
                            this.value = this.selectedListItems.length > 0 ? this.selectedListItems[0].data : null;
                            this.valueChange.emit(this.value);
                        } else {
                            this.selectedListItems = [];
                            if (this.value != null) {
                                this.value = null;
                                this.valueChange.emit(this.value);
                            }
                            const highlightedItem = this.viewData
                                .selectMany(g => g.source)
                                .firstOrDefault(i => i.text.startsWith(text));
                            if (highlightedItem) {
                                this.highlightedItem = highlightedItem;
                            } else {
                                this.highlightedItem = null;
                            }
                        }
                    }
                }
            });
    }
}
