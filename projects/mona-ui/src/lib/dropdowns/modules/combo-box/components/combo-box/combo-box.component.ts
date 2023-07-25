import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ElementRef,
    forwardRef,
    HostBinding,
    Input,
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
import { PopupListItem } from "../../../../data/PopupListItem";
import { PopupListValueChangeEvent } from "../../../../data/PopupListValueChangeEvent";
import { distinctUntilChanged, fromEvent, map, Observable, of, Subject, take, takeUntil } from "rxjs";
import { Group } from "@mirei/ts-collections";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { Action } from "../../../../../utils/Action";
import { ComboBoxGroupTemplateDirective } from "../../directives/combo-box-group-template.directive";
import { ComboBoxItemTemplateDirective } from "../../directives/combo-box-item-template.directive";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { faChevronDown, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";
import { AnimationState } from "../../../../../animations/AnimationState";

@Component({
    selector: "mona-combo-box",
    templateUrl: "./combo-box.component.html",
    styleUrls: ["./combo-box.component.scss"],
    providers: [
        PopupListService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ComboBoxComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComboBoxComponent implements OnInit, OnDestroy, ControlValueAccessor {
    readonly #destroy$: Subject<void> = new Subject<void>();
    #propagateChange: any = () => {};
    #value: any;
    public readonly clearIcon: IconDefinition = faTimes;
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    public readonly comboBoxValue$: Subject<string> = new Subject<string>();
    public comboBoxValue: WritableSignal<string> = signal("");
    public popupRef: PopupRef | null = null;
    public valuePopupListItem?: PopupListItem;

    @HostBinding("class.mona-dropdown")
    public readonly hostClass: boolean = true;

    @Input()
    public allowCustomValue: boolean = true;

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

    @Input()
    public valueNormalizer: Action<Observable<string>, Observable<any>> = (text$: Observable<string>) =>
        text$.pipe(map(value => value));

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupListService: PopupListService,
        private readonly popupService: PopupService
    ) {}

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.comboBoxValue.set("");
        this.updateValue(undefined);
        this.#propagateChange?.(undefined);
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
    }

    public onKeydown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            const item = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(i => i.text.toLowerCase() === this.comboBoxValue().toLowerCase());
            if (item) {
                if (item.dataEquals(this.value)) {
                    this.close();
                    return;
                }
                this.popupListService.selectItem(item, "single");
                this.updateValue(item.data);
                this.#propagateChange?.(item.data);
            } else {
                if (this.allowCustomValue) {
                    this.valueNormalizer(of(this.comboBoxValue())).subscribe(normalizedValue => {
                        this.data = [...this.data, normalizedValue];
                        this.popupListService.initializeListData({
                            data: [...this.data],
                            valueField: this.valueField,
                            disabler: this.itemDisabler,
                            textField: this.textField,
                            groupField: this.groupField
                        });
                        const item = this.popupListService.viewListData
                            .selectMany(g => g.source)
                            .firstOrDefault(i => i.text.toLowerCase() === this.comboBoxValue().toLowerCase());
                        if (item) {
                            this.popupListService.selectItem(item, "single");
                            this.updateValue(item.data);
                            this.#propagateChange?.(item.data);
                        }
                    });
                } else {
                    this.comboBoxValue.set("");
                }
            }
            this.close();
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            if (this.popupRef) {
                return;
            }
            const listItem = this.popupListService.navigate(event, "single");
            if (listItem && !listItem.dataEquals(this.value)) {
                this.updateValue(listItem.data);
                this.#propagateChange?.(this.value);
            }
        } else if (event.key === "Escape") {
            this.close();
        }
    }

    public onPopupListValueChange(event: PopupListValueChangeEvent): void {
        if (!event.value || event.value.length === 0) {
            this.comboBoxValue.set("");
            this.updateValue(undefined);
            this.#propagateChange?.(undefined);
            return;
        }
        if (this.value && event.value[0].dataEquals(this.value)) {
            if (event.via === "selection") {
                this.close();
            }
            return;
        }
        if (event.via === "selection") {
            this.close();
        }
        this.updateValue(event.value[0].data);
        this.#propagateChange?.(event.value[0].data);
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
            const item = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(i => i.text.toLowerCase() === this.comboBoxValue().toLowerCase());
            if (!item) {
                this.comboBoxValue.set("");
            }
        });
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {
        void 0;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public writeValue(obj: any): void {
        this.updateValue(obj);
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
        this.comboBoxValue.set(this.valuePopupListItem?.text ?? "");
    }

    private setEventListeners(): void {
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntil(this.#destroy$))
            .subscribe(event => {
                const target = event.relatedTarget as HTMLElement;
                if (
                    target &&
                    (this.elementRef.nativeElement.contains(target) ||
                        this.popupRef?.overlayRef.overlayElement.contains(target))
                ) {
                    return;
                }
                // this.close();
            });
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusin")
            .pipe(takeUntil(this.#destroy$))
            .subscribe(() => {
                const input = this.elementRef.nativeElement.querySelector("input");
                if (input) {
                    input.focus();
                    input.setSelectionRange(-1, -1);
                }
            });
    }

    private setSubscriptions(): void {
        this.comboBoxValue$.pipe(takeUntil(this.#destroy$), distinctUntilChanged()).subscribe(value => {
            if (this.filterable) {
                if (!value) {
                    this.popupListService.viewListData = this.popupListService.sourceListData.toList();
                    this.popupListService.filterModeActive = false;
                } else {
                    this.popupListService.viewListData = this.popupListService.sourceListData
                        .select(g => {
                            const filteredItems = g.source.where(i =>
                                i.text.toLowerCase().includes(value.toLowerCase())
                            );
                            return new Group<string, PopupListItem>(g.key, filteredItems.toList());
                        })
                        .toList();
                    this.popupListService.filterModeActive = true;
                }
            }
            this.popupListService.viewListData
                .selectMany(g => g.source)
                .forEach(i => {
                    i.highlighted.set(false);
                    i.selected.set(false);
                });
            const popupListItem = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(item => !item.disabled && item.text.toLowerCase().includes(value.toLowerCase()));
            if (!this.popupRef) {
                this.open();
            }
            if (popupListItem) {
                popupListItem.highlighted.set(true);
                this.popupListService.scrollToListItem$.next(popupListItem);
            }
            this.comboBoxValue.set(value);
        });
    }

    private updateValue(value: any) {
        this.#value = value;
        this.valuePopupListItem = this.popupListService.viewListData
            .selectMany(g => g.source)
            .singleOrDefault(d => d.dataEquals(this.value));
        this.comboBoxValue.set(this.valuePopupListItem?.text ?? "");
    }

    public get value(): any {
        return this.#value;
    }
}
