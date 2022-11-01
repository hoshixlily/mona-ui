import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { faChevronDown, faSearch, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { PopupRef } from "../../../popup/models/PopupRef";
import { PopupService } from "../../../popup/services/popup.service";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { PopupSettings } from "../../../popup/models/PopupSettings";
import { PopupListService } from "../../services/popup-list.service";
import { fromEvent, Subject, take, takeUntil } from "rxjs";
import { SelectionMode } from "../../../models/SelectionMode";
import { Action } from "../../../utils/Action";
import { PopupListItem } from "../../data/PopupListItem";

@Component({
    selector: "mona-abstract-drop-down-list",
    standalone: true,
    imports: [CommonModule],
    template: "",
    styleUrls: [],
    providers: [PopupListService]
})
export abstract class AbstractDropDownListComponent implements OnInit, OnDestroy {
    protected readonly componentDestroy$: Subject<void> = new Subject<void>();
    public readonly clearIcon: IconDefinition = faTimes;
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    public popupRef: PopupRef | null = null;

    @Input()
    public data: Iterable<any> = [];

    @Input()
    public disabled: boolean = false;

    @ViewChild("dropdownWrapper")
    public dropdownWrapper!: ElementRef<HTMLDivElement>;

    @Input()
    public groupField?: string;

    @Input()
    public itemDisabler?: Action<any, boolean> | string;

    @Input()
    public placeholder?: string;

    @ViewChild("popupTemplate")
    public popupTemplate!: TemplateRef<void>;

    @Input()
    public showClearButton: boolean = false;

    @Input()
    public textField?: string;

    @Input()
    public valueField?: string;

    protected abstract selectionMode: SelectionMode;
    public abstract valuePopupListItem?: PopupListItem | PopupListItem[];

    // @Input()
    public abstract value?: any | any[];

    // @Output()
    public abstract valueChange: EventEmitter<any | any[]>;

    protected constructor(
        protected readonly elementRef: ElementRef<HTMLElement>,
        protected readonly popupListService: PopupListService,
        protected readonly popupService: PopupService
    ) {}

    public close(): void {
        this.popupRef?.close();
        this.popupRef = null;
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        this.popupListService.initializeListData({
            data: this.data,
            disabler: this.itemDisabler,
            textField: this.textField,
            valueField: this.valueField,
            groupField: this.groupField
        });
        if (this.value) {
            this.valuePopupListItem = this.popupListService.viewListData
                .selectMany(g => g.source)
                .singleOrDefault(d => d.dataEquals(this.value));
            if (this.valuePopupListItem) {
                this.valuePopupListItem.selected = true;
            }
        }
        this.setEvents();
    }

    public open(options: Partial<PopupSettings> = {}): PopupRef {
        if (this.popupRef) {
            return this.popupRef;
        }
        this.dropdownWrapper.nativeElement.focus();
        this.popupRef = this.popupService.create({
            anchor: this.dropdownWrapper,
            content: this.popupTemplate,
            hasBackdrop: true,
            withPush: false,
            width: this.elementRef.nativeElement.clientWidth,
            popupClass: ["mona-dropdown-popup-content"],
            positions: [
                new ConnectionPositionPair(
                    { originX: "start", originY: "bottom" },
                    { overlayX: "start", overlayY: "top" }
                )
            ],
            ...options
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            (this.elementRef.nativeElement.firstElementChild as HTMLElement)?.focus();
            this.popupListService.clearFilters();
        });
        return this.popupRef;
    }

    protected setEvents(): void {
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((event: KeyboardEvent) => {
                if (event.key === "Enter") {
                    if (this.popupRef) {
                        if (this.selectionMode === "single") {
                            this.close();
                        }
                        return;
                    }
                    this.open();
                } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    if (this.popupRef) {
                        return;
                    }
                    const listItem = this.popupListService.navigate(event, this.selectionMode);
                    if (listItem) {
                        if (this.selectionMode === "single") {
                            if (listItem.dataEquals(this.value)) {
                                return;
                            }
                            this.updateValue(listItem);
                        }
                    }
                } else if (event.key === "Escape") {
                    this.close();
                }
            });
    }

    protected updateValue(listItem: PopupListItem): void {
        this.value = listItem.data;
        this.valuePopupListItem = listItem;
        this.valueChange.emit(this.value);
    }
}
