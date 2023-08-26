import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { NgClass, NgIf, NgTemplateOutlet } from "@angular/common";
import {
    Component,
    ContentChild,
    DestroyRef,
    ElementRef,
    forwardRef,
    HostBinding,
    inject,
    Input,
    OnChanges,
    OnInit,
    signal,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Group } from "@mirei/ts-collections";
import { debounceTime, distinctUntilChanged, fromEvent, Subject, take } from "rxjs";
import { AnimationState } from "../../animations/models/AnimationState";
import { PopupAnimationService } from "../../animations/services/popup-animation.service";
import { TextBoxDirective } from "../../inputs/directives/text-box.directive";
import { PopupRef } from "../../popup/models/PopupRef";
import { PopupService } from "../../popup/services/popup.service";
import { Action } from "../../utils/Action";
import { ComboBoxGroupTemplateDirective } from "../directives/combo-box-group-template.directive";
import { ComboBoxItemTemplateDirective } from "../directives/combo-box-item-template.directive";
import { ListGroupTemplateDirective } from "../directives/list-group-template.directive";
import { ListItemTemplateDirective } from "../directives/list-item-template.directive";
import { PopupListItem } from "../models/PopupListItem";
import { PopupListValueChangeEvent } from "../models/PopupListValueChangeEvent";
import { PopupListComponent } from "../popup-list/popup-list.component";
import { PopupListService } from "../services/popup-list.service";

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
    ],
    standalone: true,
    imports: [
        NgClass,
        TextBoxDirective,
        FormsModule,
        NgIf,
        FontAwesomeModule,
        PopupListComponent,
        ListItemTemplateDirective,
        NgTemplateOutlet,
        ListGroupTemplateDirective
    ]
})
export class AutoCompleteComponent implements OnInit, OnChanges, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #propagateChange: any = () => {};
    #value: any;
    public readonly autoCompleteValue$: Subject<string> = new Subject<string>();
    public readonly clearIcon: IconDefinition = faTimes;
    public autoCompleteValue: WritableSignal<string> = signal("");
    public popupRef: PopupRef | null = null;
    public valuePopupListItem?: PopupListItem | null = null;

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
    public groupTemplate: TemplateRef<any> | null = null;

    @Input()
    public itemDisabler?: Action<any, boolean> | string;

    @ContentChild(ComboBoxItemTemplateDirective, { read: TemplateRef })
    public itemTemplate: TemplateRef<any> | null = null;

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
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupListService: PopupListService,
        private readonly popupService: PopupService
    ) {}

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.popupListService.sourceListData
            .selectMany(g => g.source)
            .forEach(i => {
                i.highlighted.set(false);
                i.selected.set(false);
            });
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
                .firstOrDefault(i => i.selected() || i.highlighted());
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
            hasBackdrop: false,
            closeOnOutsideClick: false,
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
        this.popupAnimationService.setupDropdownOutsideClickCloseAnimation(this.popupRef);
        this.popupAnimationService.animateDropdown(this.popupRef, AnimationState.Show);
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
            this.valuePopupListItem.selected.set(true);
        }
        this.autoCompleteValue.set(this.valuePopupListItem?.text ?? "");
    }

    private setEventListeners(): void {
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusin")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                const input = this.elementRef.nativeElement.querySelector("input");
                if (input) {
                    input.focus();
                    input.setSelectionRange(-1, -1);
                }
            });
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntilDestroyed(this.#destroyRef))
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
            .pipe(takeUntilDestroyed(this.#destroyRef), debounceTime(50), distinctUntilChanged())
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
                        .forEach(i => {
                            i.highlighted.set(false);
                            i.selected.set(false);
                        });
                    const popupListItem = this.popupListService.viewListData
                        .selectMany(g => g.source)
                        .firstOrDefault(
                            item => !item.disabled && item.text.toLowerCase().startsWith(value.toLowerCase())
                        );
                    if (popupListItem) {
                        popupListItem.highlighted.set(true);
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
