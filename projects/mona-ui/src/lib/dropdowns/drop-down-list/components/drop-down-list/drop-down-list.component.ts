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
    model,
    OnInit,
    output,
    TemplateRef,
    untracked,
    viewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Predicate } from "@mirei/ts-collections";
import { distinctUntilChanged, fromEvent, take, withLatestFrom } from "rxjs";
import { v4 } from "uuid";
import { AnimationState } from "../../../../animations/models/AnimationState";
import { PopupAnimationService } from "../../../../animations/services/popup-animation.service";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { ListComponent } from "../../../../common/list/components/list/list.component";
import { ListFooterTemplateDirective } from "../../../../common/list/directives/list-footer-template.directive";
import { ListGroupHeaderTemplateDirective } from "../../../../common/list/directives/list-group-header-template.directive";
import { ListHeaderTemplateDirective } from "../../../../common/list/directives/list-header-template.directive";
import { ListItemTemplateDirective } from "../../../../common/list/directives/list-item-template.directive";
import { ListNoDataTemplateDirective } from "../../../../common/list/directives/list-no-data-template.directive";
import { SelectableOptions } from "../../../../common/list/models/SelectableOptions";
import { SelectionChangeEvent } from "../../../../common/list/models/SelectionChangeEvent";
import { ListService } from "../../../../common/list/services/list.service";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { PopupService } from "../../../../popup/services/popup.service";
import { Action } from "../../../../utils/Action";
import { DropDownFooterTemplateDirective } from "../../../directives/drop-down-footer-template.directive";
import { DropDownGroupHeaderTemplateDirective } from "../../../directives/drop-down-group-header-template.directive";
import { DropDownHeaderTemplateDirective } from "../../../directives/drop-down-header-template.directive";
import { DropDownItemTemplateDirective } from "../../../directives/drop-down-item-template.directive";
import { DropDownNoDataTemplateDirective } from "../../../directives/drop-down-no-data-template.directive";
import { DropDownService } from "../../../services/drop-down.service";
import { DropDownListValueTemplateDirective } from "../../directives/drop-down-list-value-template.directive";

@Component({
    selector: "mona-drop-down-list",
    templateUrl: "./drop-down-list.component.html",
    styleUrls: ["./drop-down-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ListService,
        DropDownService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropDownListComponent),
            multi: true
        }
    ],
    standalone: true,
    imports: [
        NgClass,
        NgTemplateOutlet,
        FormsModule,
        FontAwesomeModule,
        ButtonDirective,
        ListComponent,
        ListItemTemplateDirective,
        ListGroupHeaderTemplateDirective,
        ListFooterTemplateDirective,
        ListHeaderTemplateDirective,
        ListNoDataTemplateDirective
    ],
    host: {
        "[class.mona-disabled]": "disabled()",
        "[class.mona-dropdown]": "true",
        "[class.mona-dropdown-list]": "true",
        "[attr.aria-disabled]": "disabled() ? true : undefined",
        "[attr.aria-haspopup]": "true",
        "[attr.tabindex]": "disabled() ? null : 0"
    }
})
export class DropDownListComponent<TData> implements OnInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    readonly #listService: ListService<TData> = inject(ListService);
    readonly #popupAnimationService: PopupAnimationService = inject(PopupAnimationService);
    readonly #popupService: PopupService = inject(PopupService);
    readonly #popupUidClass = `mona-dropdown-popup-${v4()}`;
    #popupRef: PopupRef | null = null;
    #propagateChange: Action<TData | null> | null = null;
    #value: TData | null = null;

    protected readonly clearIcon = faTimes;
    protected readonly dropdownIcon = faChevronDown;
    protected readonly footerTemplate = contentChild(DropDownFooterTemplateDirective, { read: TemplateRef });
    protected readonly groupHeaderTemplate = contentChild(DropDownGroupHeaderTemplateDirective, {
        read: TemplateRef
    });
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
    protected readonly valueTemplate = contentChild(DropDownListValueTemplateDirective, { read: TemplateRef });
    protected readonly valueText = computed(() => {
        const listItem = this.selectedListItem();
        if (!listItem) {
            return "";
        }
        return this.#listService.getItemText(listItem);
    });

    public data = input<Iterable<TData>>([]);
    public disabled = model(false);
    public itemDisabled = input<string | Predicate<TData> | null | undefined>("");
    public placeholder = input("");
    public showClearButton = input(false);
    public textField = input<string | null | undefined>("");
    public valueField = input<string | null | undefined>("");

    public constructor() {
        effect(() => {
            const textField = this.textField() ?? "";
            untracked(() => this.#listService.setTextField(textField));
        });
        effect(() => {
            const valueField = this.valueField() ?? "";
            untracked(() => {
                this.#listService.setValueField(valueField);
                if (this.#value != null) {
                    this.#listService.setSelectedDataItems([this.#value]);
                }
            });
        });
        effect(() => {
            const itemDisabled = this.itemDisabled() ?? "";
            untracked(() => this.#listService.setDisabledBy(itemDisabled));
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
        this.#propagateChange?.(this.#value);
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
        if (event.source.source === "mouse" || event.source.key === "Enter" || event.source.key === "NumpadEnter") {
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
            closeOnOutsideClick: false,
            content: this.popupTemplate(),
            hasBackdrop: false,
            withPush: false,
            width: this.#hostElementRef.nativeElement.getBoundingClientRect().width,
            popupClass: ["mona-dropdown-popup-content", this.#popupUidClass],
            positions: DropDownService.getDefaultPositions()
        });
        this.notifyValueChangeOnPopupClose();
        this.#popupAnimationService.setupDropdownOutsideClickCloseAnimation(this.#popupRef);
        this.#popupAnimationService.animateDropdown(this.#popupRef, AnimationState.Show);
        this.#popupRef.closed.pipe(take(1)).subscribe(() => {
            this.#popupRef = null;
            const popupElement = document.querySelector(`.${this.#popupUidClass}`);
            if (DropDownService.shouldFocusAfterClose(this.#hostElementRef.nativeElement, popupElement)) {
                this.focus();
            }
            this.#listService.clearFilter();
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

    public setValue(value: any): void {
        this.updateValue(value);
    }

    public writeValue(obj: TData): void {
        this.updateValue(obj);
        if (obj != null) {
            this.#listService.setSelectedDataItems([obj]);
        }
    }

    private focus(): void {
        this.#hostElementRef.nativeElement?.focus();
    }

    private handleArrowKeys(event: KeyboardEvent): void {
        const previousItem = this.selectedListItem();
        const direction = event.key === "ArrowDown" ? "next" : "previous";
        const item = this.#listService.navigate(direction, "select");
        if (item) {
            if (previousItem === item) {
                return;
            }
            this.updateValue(item.data);
            if (!this.#popupRef) {
                this.notifyValueChange();
            }
        }
    }

    private handleEnterKey(): void {
        if (this.#popupRef) {
            this.close();
            return;
        }
        this.open();
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            event.preventDefault();
            this.handleEnterKey();
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            this.handleArrowKeys(event);
        } else if (event.key === "Escape" || event.key === "Tab") {
            this.close();
        }
    }

    private initialize(): void {
        this.#listService.setNavigableOptions({ enabled: true, mode: "select" });
        this.#listService.setSelectableOptions(this.selectableOptions);
        this.#listService.selectedKeysChange = this.selectedKeysChange;
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
        fromEvent<KeyboardEvent>(this.#hostElementRef.nativeElement, "keydown")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => {
                this.handleKeyDown(event);
            });
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
        fromEvent<MouseEvent>(this.#hostElementRef.nativeElement, "click")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                if (this.disabled()) {
                    return;
                }
                this.open();
            });
    }

    private setSubscriptions(): void {
        this.#listService.selectedKeysChange.subscribe(() => {
            const item = this.selectedDataItem();
            this.updateValue(item);
        });
    }

    private updateValue(value: TData | null): void {
        this.#value = value;
    }
}
