import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    DestroyRef,
    effect,
    ElementRef,
    forwardRef,
    inject,
    input,
    InputSignal,
    model,
    OnInit,
    output,
    signal,
    TemplateRef,
    untracked,
    viewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Predicate, Selector } from "@mirei/ts-collections";
import {
    debounceTime,
    distinctUntilChanged,
    fromEvent,
    map,
    Observable,
    of,
    Subject,
    take,
    tap,
    withLatestFrom
} from "rxjs";
import { v4 } from "uuid";
import { AnimationState } from "../../animations/models/AnimationState";
import { PopupAnimationService } from "../../animations/services/popup-animation.service";
import { ButtonDirective } from "../../buttons/button/button.directive";
import { FilterChangeEvent } from "../../common/filter-input/models/FilterChangeEvent";
import { ListComponent } from "../../common/list/components/list/list.component";
import { ListFooterTemplateDirective } from "../../common/list/directives/list-footer-template.directive";
import { ListGroupHeaderTemplateDirective } from "../../common/list/directives/list-group-header-template.directive";
import { ListHeaderTemplateDirective } from "../../common/list/directives/list-header-template.directive";
import { ListItemTemplateDirective } from "../../common/list/directives/list-item-template.directive";
import { ListNoDataTemplateDirective } from "../../common/list/directives/list-no-data-template.directive";
import { SelectableOptions } from "../../common/list/models/SelectableOptions";
import { SelectionChangeEvent } from "../../common/list/models/SelectionChangeEvent";
import { ListService } from "../../common/list/services/list.service";
import { TextBoxDirective } from "../../inputs/text-box/directives/text-box.directive";
import { PopupRef } from "../../popup/models/PopupRef";
import { PopupService } from "../../popup/services/popup.service";
import { Action } from "../../utils/Action";
import { DropDownFooterTemplateDirective } from "../directives/drop-down-footer-template.directive";
import { DropDownGroupHeaderTemplateDirective } from "../directives/drop-down-group-header-template.directive";
import { DropDownHeaderTemplateDirective } from "../directives/drop-down-header-template.directive";
import { DropDownItemTemplateDirective } from "../directives/drop-down-item-template.directive";
import { DropDownNoDataTemplateDirective } from "../directives/drop-down-no-data-template.directive";
import { DropDownService } from "../services/drop-down.service";

@Component({
    selector: "mona-combo-box",
    templateUrl: "./combo-box.component.html",
    styleUrls: ["./combo-box.component.scss"],
    providers: [
        ListService,
        DropDownService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ComboBoxComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
        TextBoxDirective,
        FormsModule,
        FontAwesomeModule,
        ButtonDirective,
        NgTemplateOutlet,
        ListComponent,
        ListGroupHeaderTemplateDirective,
        ListFooterTemplateDirective,
        ListHeaderTemplateDirective,
        ListNoDataTemplateDirective,
        ListItemTemplateDirective
    ],
    host: {
        "[class.mona-disabled]": "disabled()",
        "[class.mona-combo-box]": "true",
        "[class.mona-dropdown]": "true"
    }
})
export class ComboBoxComponent<TData> implements OnInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    readonly #listService: ListService<TData> = inject(ListService);
    readonly #popupAnimationService: PopupAnimationService = inject(PopupAnimationService);
    readonly #popupService: PopupService = inject(PopupService);
    readonly #popupUidClass = `mona-dropdown-popup-${v4()}`;
    #popupRef: PopupRef | null = null;
    #propagateChange: Action<TData | null> | null = null;
    #value: any;

    protected readonly clearIcon = faTimes;
    protected readonly dropdownIcon = faChevronDown;
    protected readonly comboBoxValue$ = new Subject<string>();
    protected readonly comboBoxValue = signal("");
    protected readonly footerTemplate = contentChild(DropDownFooterTemplateDirective, { read: TemplateRef });
    protected readonly groupHeaderTemplate = contentChild(DropDownGroupHeaderTemplateDirective, { read: TemplateRef });
    protected readonly headerTemplate = contentChild(DropDownHeaderTemplateDirective, { read: TemplateRef });
    protected readonly itemTemplate = contentChild(DropDownItemTemplateDirective, { read: TemplateRef });
    protected readonly noDataTemplate = contentChild(DropDownNoDataTemplateDirective, { read: TemplateRef });
    protected readonly popupTemplate = viewChild.required<TemplateRef<any>>("popupTemplate");
    protected readonly selectableOptions: SelectableOptions = {
        enabled: true,
        mode: "single",
        toggleable: false
    };
    protected readonly selectedDataItem = computed(() => {
        return this.selectedListItem()?.data ?? null;
    });
    protected readonly selectedKeysChange = output<any[]>();
    protected readonly selectedListItem = computed(() => {
        return this.#listService.selectedListItems().firstOrDefault();
    });
    protected readonly valueText = computed(() => {
        const listItem = this.selectedListItem();
        if (!listItem) {
            return "";
        }
        return this.#listService.getItemText(listItem);
    });

    public allowCustomValue = input(false);
    public data = input<Iterable<TData>>([]);
    public disabled = model(false);
    public itemDisabled = input<string | Predicate<TData> | null | undefined>("");
    public placeholder = input("");
    public showClearButton = input(false);
    public textField = input<string | Selector<TData, string> | null | undefined>("");
    public valueField = input<string | Selector<TData, any> | null | undefined>("");
    public valueNormalizer: InputSignal<Action<Observable<string>, Observable<any>>> = input(
        (text$: Observable<string>) => text$.pipe(map(value => value))
    );

    public constructor() {
        effect(() => {
            const itemDisabled = this.itemDisabled();
            untracked(() => this.#listService.setDisabledBy(itemDisabled ?? ""));
        });
        effect(() => {
            const textField = this.textField();
            untracked(() => this.#listService.setTextField(textField ?? ""));
        });
        effect(() => {
            const valueField = this.valueField();
            untracked(() => {
                this.#listService.setValueField(valueField ?? "");
                if (this.#value != null) {
                    this.#listService.setSelectedDataItems([this.#value]);
                }
            });
        });
        effect(() => {
            const data = this.data();
            untracked(() => this.#listService.setData(data));
        });
    }

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.updateValue(null);
        this.#listService.clearSelections();
        this.#propagateChange?.(null);
        this.comboBoxValue.set("");
    }

    public close(): void {
        this.#popupRef?.close();
        this.#popupRef = null;
    }

    public ngOnInit(): void {
        this.initialize();
        this.setEventListeners();
        this.setSubscriptions();
    }

    public onItemSelect(event: SelectionChangeEvent<TData>): void {
        this.close();
    }

    public onKeydown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            const item = this.selectedDataItem();
            if (item && this.comboBoxValue() === this.valueText()) {
                this.updateValue(item);
            } else if (item && this.comboBoxValue() !== this.valueText()) {
                const targetItem = this.#listService
                    .viewItems()
                    .firstOrDefault(i =>
                        this.#listService.getItemText(i).toLowerCase().startsWith(this.comboBoxValue().toLowerCase())
                    );
                if (targetItem) {
                    this.#listService.selectItem(targetItem);
                    this.updateValue(targetItem.data);
                } else if (this.allowCustomValue()) {
                    this.handleCustomValue();
                } else {
                    this.comboBoxValue.set("");
                }
            } else if (this.allowCustomValue()) {
                this.handleCustomValue();
            } else {
                this.comboBoxValue.set("");
            }
            this.close();
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            this.handleArrowKeys(event);
        } else if (event.key === "Escape" || event.key === "Tab") {
            this.close();
        }
    }

    public open(): void {
        this.focus();
        if (this.#popupRef) {
            return;
        }
        this.#popupRef = this.#popupService.create({
            anchor: this.#hostElementRef.nativeElement,
            content: this.popupTemplate(),
            hasBackdrop: false,
            closeOnOutsideClick: false,
            withPush: false,
            width: this.#hostElementRef.nativeElement.getBoundingClientRect().width,
            popupClass: ["mona-dropdown-popup-content", this.#popupUidClass],
            positions: DropDownService.getDefaultPositions()
        });
        this.notifyValueChangeOnPopupClose();
        this.#popupAnimationService.setupDropdownOutsideClickCloseAnimation(this.#popupRef);
        this.#popupAnimationService.animateDropdown(this.#popupRef, AnimationState.Show);
        window.setTimeout(() => {
            const input = this.#hostElementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
                input.setSelectionRange(-1, -1);
            }
        });
        this.#popupRef.closed.pipe(take(1)).subscribe(() => {
            this.#popupRef = null;
            this.#listService.clearFilter();
            const popupElement = document.querySelector(`.${this.#popupUidClass}`);
            if (DropDownService.shouldFocusAfterClose(this.#hostElementRef.nativeElement, popupElement)) {
                this.focus();
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
        this.disabled.set(isDisabled);
    }

    public writeValue(obj: TData): void {
        this.updateValue(obj);
        if (obj != null) {
            this.#listService.setSelectedDataItems([obj]);
            this.comboBoxValue.set(this.valueText());
        }
    }

    private focus(): void {
        this.#hostElementRef.nativeElement?.focus();
    }

    private handleArrowKeys(event: KeyboardEvent): void {
        const previousItem = this.selectedListItem();
        const direction = event.key === "ArrowDown" ? "next" : "previous";
        const listItem = this.#listService.navigate(direction, "select");
        if (!listItem || previousItem === listItem) {
            return;
        }
        this.updateValue(listItem.data);
        if (!this.#popupRef) {
            this.notifyValueChange();
        }
    }

    private handleCustomValue(): void {
        this.valueNormalizer()(of(this.comboBoxValue()))
            .pipe(take(1))
            .subscribe(normalizedValue => {
                this.#listService.addNewDataItems([normalizedValue]);
                const item = this.#listService
                    .viewItems()
                    .where(i => !i.header && !this.#listService.isDisabled(i))
                    .firstOrDefault(
                        i => this.#listService.getItemText(i).toLowerCase() === this.comboBoxValue().toLowerCase()
                    );
                if (item) {
                    this.#listService.selectItem(item);
                    this.updateValue(item.data);
                }
            });
    }

    private initialize(): void {
        this.#listService.setNavigableOptions({ enabled: true, mode: "select" });
        this.#listService.setSelectableOptions(this.selectableOptions);
        this.#listService.filterInputVisible.set(false);
        this.#listService.selectedKeysChange = this.selectedKeysChange;
        this.comboBoxValue.set(this.valueText());
    }

    private notifyFilterChange(filter: string): FilterChangeEvent {
        const event = new FilterChangeEvent(filter);
        this.#listService.filterChange.emit(event);
        return event;
    }

    private notifyValueChange(): void {
        this.#propagateChange?.(this.#value);
    }

    private notifyValueChangeOnPopupClose(): void {
        if (!this.#popupRef) {
            return;
        }
        this.#popupRef.closed
            .pipe(
                take(1),
                withLatestFrom(
                    this.#listService.selectionChange$.pipe(distinctUntilChanged((s1, s2) => s1.data === s2.data))
                )
            )
            .subscribe(() => {
                this.notifyValueChange();
            });
    }

    private setEventListeners(): void {
        fromEvent<FocusEvent>(this.#hostElementRef.nativeElement, "focusout")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => {
                const target = event.relatedTarget as HTMLElement;
                if (
                    target &&
                    (this.#hostElementRef.nativeElement.contains(target) ||
                        this.#popupRef?.overlayRef.overlayElement.contains(target))
                ) {
                    return;
                }
            });
        fromEvent<FocusEvent>(this.#hostElementRef.nativeElement, "focusin")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                const input = this.#hostElementRef.nativeElement.querySelector("input");
                if (input) {
                    input.focus();
                    input.setSelectionRange(-1, -1);
                }
            });
    }

    private setSubscriptions(): void {
        const debounce = this.#listService.filterableOptions().enabled
            ? this.#listService.filterableOptions().debounce
            : 0;
        this.comboBoxValue$
            .pipe(
                tap(() => {
                    if (!this.#popupRef) {
                        this.open();
                    }
                }),
                debounceTime(debounce),
                takeUntilDestroyed(this.#destroyRef),
                distinctUntilChanged()
            )
            .subscribe(value => {
                if (this.#listService.filterableOptions().enabled) {
                    const event = this.notifyFilterChange(value);
                    if (!event.isDefaultPrevented()) {
                        this.#listService.setFilter(value);
                    }
                }
                const item = this.#listService
                    .viewItems()
                    .where(i => !i.header && !this.#listService.isDisabled(i))
                    .firstOrDefault(i => {
                        return this.#listService.getItemText(i).toLowerCase().includes(value.toLowerCase());
                    });
                if (item) {
                    this.#listService.clearSelections();
                    this.#listService.highlightedItem.set(item);
                    this.#listService.scrollToItem$.next(item);
                }
                this.comboBoxValue.set(value);
            });
        this.#listService.selectedKeysChange.subscribe(() => {
            const item = this.selectedDataItem();
            this.updateValue(item);
        });
    }

    private updateValue(value: TData | null) {
        this.#value = value;
        this.comboBoxValue.set(this.valueText());
    }
}
