import {
    Component,
    ContentChild,
    ElementRef,
    forwardRef,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    signal,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { PopupListService } from "../../../../services/popup-list.service";
import { PopupService } from "../../../../../popup/services/popup.service";
import { debounceTime, distinctUntilChanged, fromEvent, Subject, take, takeUntil } from "rxjs";
import { PopupListItem } from "../../../../data/PopupListItem";
import { ComboBoxGroupTemplateDirective } from "../../../combo-box/directives/combo-box-group-template.directive";
import { ComboBoxItemTemplateDirective } from "../../../combo-box/directives/combo-box-item-template.directive";
import { PopupListValueChangeEvent } from "../../../../data/PopupListValueChangeEvent";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { PopupSettings } from "../../../../../popup/models/PopupSettings";
import { Group } from "@mirei/ts-collections";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { Action } from "../../../../../utils/Action";
import { faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "mona-auto-complete",
    templateUrl: "./auto-complete.component.html",
    styleUrls: ["./auto-complete.component.scss"],
    providers: [
        PopupListService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutoCompleteComponent),
            multi: true
        }
    ]
})
export class AutoCompleteComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
    readonly #destroy$: Subject<void> = new Subject<void>();
    #propagateChange: any = () => {};
    #value: any;
    public readonly autoCompleteValue$: Subject<string> = new Subject<string>();
    public readonly clearIcon: IconDefinition = faTimes;
    public autoCompleteValue: WritableSignal<string> = signal("");
    public popupRef: PopupRef | null = null;
    public valuePopupListItem?: PopupListItem;

    @HostBinding("class.mona-dropdown")
    public readonly hostClass: boolean = true;

    @Input()
    public data: Iterable<any> = [];

    @Input()
    public disabled: boolean = false;

    @ViewChild("dropdownWrapper")
    public dropdownWrapper!: ElementRef<HTMLDivElement>;

    @Input()
    public filterable: boolean = false;

    @Input()
    public groupField?: string;

    @ContentChild(ComboBoxGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<any>;

    @Input()
    public itemDisabler?: Action<any, boolean> | string;

    @ContentChild(ComboBoxItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<any>;

    @Input()
    public placeholder?: string;

    @ViewChild("popupTemplate")
    public popupTemplate!: TemplateRef<any>;

    @Input()
    public showClearButton: boolean = false;

    @Input()
    public textField?: string;

    @Input()
    public valueField?: string;

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupListService: PopupListService,
        private readonly popupService: PopupService
    ) {}

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.popupListService.sourceListData
            .selectMany(g => g.source)
            .forEach(i => (i.selected = i.highlighted = false));
        this.autoCompleteValue.set("");
        this.#value = "";
        this.#propagateChange("");
    }

    public close(): void {
        this.popupRef?.close();
        this.popupRef = null;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["data"] && !changes["data"].isFirstChange()) {
            this.initialize();
        }
    }

    public ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
    }

    public ngOnInit(): void {
        this.initialize();
        this.setEventListeners();
        this.setSubscriptions();
        this.autoCompleteValue.set(this.value ?? "");
    }

    public onKeydown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            const item = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(i => i.selected || i.highlighted);
            if (item) {
                this.valuePopupListItem = item;
                this.autoCompleteValue.set(item.text);
                if (this.value !== item.text) {
                    this.#value = item.text;
                    this.#propagateChange(item.text);
                }
            } else {
                if (this.value !== this.autoCompleteValue()) {
                    this.#value = this.autoCompleteValue();
                    this.valuePopupListItem = undefined;
                    this.#propagateChange(this.autoCompleteValue());
                }
            }
            this.close();
        } else if (event.key === "Escape") {
            this.close();
        }
    }

    public onPopupListValueChange(event: PopupListValueChangeEvent): void {
        if (event?.via === "navigation") {
            return;
        }
        if (!event.value || event.value.length === 0) {
            this.#value = "";
            this.valuePopupListItem = undefined;
            this.autoCompleteValue.set("");
            this.#propagateChange(this.autoCompleteValue());
            return;
        }
        if (this.value && event.value[0].dataEquals(this.value)) {
            if (event.via === "selection") {
                this.close();
            }
            return;
        }
        if (event.via === "selection") {
            this.#value = event.value[0].text;
            this.valuePopupListItem = event.value[0];
            this.autoCompleteValue.set(event.value[0].text);
            this.#propagateChange(event.value[0].text);
            this.close();
        }
    }

    public open(): void {
        this.dropdownWrapper.nativeElement.focus();
        this.popupRef = this.popupService.create({
            anchor: this.dropdownWrapper,
            content: this.popupTemplate,
            hasBackdrop: true,
            withPush: false,
            width: this.elementRef.nativeElement.getBoundingClientRect().width,
            popupClass: ["mona-dropdown-popup-content"],
            positions: [
                new ConnectionPositionPair(
                    { originX: "start", originY: "bottom" },
                    { overlayX: "start", overlayY: "top" },
                    -1,
                    0,
                    "mona-dropdown-popup-content-bottom"
                ),
                new ConnectionPositionPair(
                    { originX: "start", originY: "top" },
                    { overlayX: "start", overlayY: "bottom" },
                    -1,
                    -1,
                    "mona-dropdown-popup-content-top"
                )
            ]
        });
        window.setTimeout(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
                input.setSelectionRange(-1, -1);
            }
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            (this.elementRef.nativeElement.firstElementChild as HTMLElement)?.focus();
            this.popupListService.clearFilters();
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
            }
        });
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {}

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public writeValue(data: any): void {
        this.updateValue(data);
    }

    private initialize(): void {
        this.popupListService.initializeListData({
            data: this.data,
            disabler: this.itemDisabler,
            textField: this.textField,
            valueField: this.valueField,
            groupField: this.groupField
        });
        this.valuePopupListItem = this.popupListService.viewListData
            .selectMany(g => g.source)
            .singleOrDefault(d => d.dataEquals(this.value));
        if (this.valuePopupListItem) {
            this.valuePopupListItem.selected = true;
        }
        this.autoCompleteValue.set(this.valuePopupListItem?.text ?? "");
    }

    private setEventListeners(): void {
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusin")
            .pipe(takeUntil(this.#destroy$))
            .subscribe(() => {
                const input = this.elementRef.nativeElement.querySelector("input");
                if (input) {
                    input.focus();
                    input.setSelectionRange(-1, -1);
                }
            });
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntil(this.#destroy$))
            .subscribe(event => {
                const target = event.relatedTarget as HTMLElement;
                if (
                    !(
                        target &&
                        (this.elementRef.nativeElement.contains(target) ||
                            this.popupRef?.overlayRef.overlayElement.contains(target))
                    )
                ) {
                    if (this.value !== this.autoCompleteValue()) {
                        this.#value = this.autoCompleteValue();
                        this.#propagateChange(this.autoCompleteValue());
                    }
                    this.valuePopupListItem = undefined;
                }
            });
    }

    private setSubscriptions(): void {
        this.autoCompleteValue$
            .pipe(takeUntil(this.#destroy$), debounceTime(50), distinctUntilChanged())
            .subscribe((value: string) => {
                if (value) {
                    if (this.filterable) {
                        this.popupListService.viewListData = this.popupListService.sourceListData
                            .select(g => {
                                const filteredItems = g.source.where(i =>
                                    i.text.toLowerCase().startsWith(value.toLowerCase())
                                );
                                return new Group<string, PopupListItem>(g.key, filteredItems.toList());
                            })
                            .toList();
                        this.popupListService.filterModeActive = true;
                    }
                    this.popupListService.viewListData
                        .selectMany(g => g.source)
                        .forEach(i => (i.selected = i.highlighted = false));
                    const popupListItem = this.popupListService.viewListData
                        .selectMany(g => g.source)
                        .firstOrDefault(
                            item => !item.disabled && item.text.toLowerCase().startsWith(value.toLowerCase())
                        );
                    if (popupListItem) {
                        popupListItem.highlighted = true;
                        this.popupListService.scrollToListItem$.next(popupListItem);
                    }
                    if (!this.popupRef) {
                        this.open();
                    }
                    this.autoCompleteValue.set(value);
                } else {
                    this.close();
                    this.autoCompleteValue.set(value);
                }
            });
    }

    private updateValue(value: any) {
        this.#value = value;
        this.valuePopupListItem = this.popupListService.viewListData
            .selectMany(g => g.source)
            .singleOrDefault(d => d.dataEquals(this.value));
        this.autoCompleteValue?.set(this.valuePopupListItem?.text ?? "");
    }

    public get value(): any {
        return this.#value;
    }
}
