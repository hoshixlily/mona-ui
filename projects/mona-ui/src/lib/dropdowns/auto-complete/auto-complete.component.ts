import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
    Component,
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
    signal,
    TemplateRef,
    untracked,
    viewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Predicate, Selector } from "@mirei/ts-collections";
import { debounceTime, fromEvent, Subject, take, tap } from "rxjs";
import { v4 } from "uuid";
import { AnimationState } from "../../animations/models/AnimationState";
import { PopupAnimationService } from "../../animations/services/popup-animation.service";
import { FilterChangeEvent } from "../../common/filter-input/models/FilterChangeEvent";
import { ListComponent } from "../../common/list/components/list/list.component";
import { ListFooterTemplateDirective } from "../../common/list/directives/list-footer-template.directive";
import { ListGroupHeaderTemplateDirective } from "../../common/list/directives/list-group-header-template.directive";
import { ListHeaderTemplateDirective } from "../../common/list/directives/list-header-template.directive";
import { ListItemTemplateDirective } from "../../common/list/directives/list-item-template.directive";
import { ListNoDataTemplateDirective } from "../../common/list/directives/list-no-data-template.directive";
import { ListItem } from "../../common/list/models/ListItem";
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
    selector: "mona-auto-complete",
    templateUrl: "./auto-complete.component.html",
    styleUrls: ["./auto-complete.component.scss"],
    providers: [
        ListService,
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
        FontAwesomeModule,
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
        "[class.mona-dropdown]": "true",
        "[class.mona-auto-complete]": "true"
    }
})
export class AutoCompleteComponent<TData> implements OnInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    readonly #listService: ListService<TData> = inject(ListService);
    readonly #popupAnimationService: PopupAnimationService = inject(PopupAnimationService);
    readonly #popupService: PopupService = inject(PopupService);
    readonly #popupUidClass: string = `mona-dropdown-popup-${v4()}`;
    #popupRef: PopupRef | null = null;
    #propagateChange: Action<string | null> | null = null;
    #value = "";

    protected readonly autoCompleteValue = signal("");
    protected readonly autoCompleteValue$ = new Subject<string>();
    protected readonly clearIcon = faTimes;
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
    protected readonly selectedKeysChange = output<any[]>();

    public data = input<Iterable<TData>>([]);
    public disabled = model(false);
    public itemDisabled = input<string | Predicate<TData> | null | undefined>("");
    public placeholder = input("");
    public showClearButton = input(false);
    public textField = input<string | Selector<TData, string> | null | undefined>("");
    public valueField = input<string | Selector<TData, any> | null | undefined>("");

    public constructor() {
        effect(() => {
            const textField = this.textField();
            untracked(() => this.#listService.setTextField(textField ?? ""));
        });
        effect(() => {
            const itemDisabled = this.itemDisabled();
            untracked(() => this.#listService.setDisabledBy(itemDisabled ?? ""));
        });
        effect(() => {
            const valueField = this.valueField();
            untracked(() => this.#listService.setValueField(valueField ?? ""));
        });
        effect(() => {
            const data = this.data();
            untracked(() => this.#listService.setData(data));
        });
    }

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.updateValue("");
        this.autoCompleteValue.set("");
        this.#listService.clearSelections();
        this.#propagateChange?.(null);
    }

    public close(): void {
        this.#popupRef?.close();
        this.#popupRef = null;
    }

    public ngOnInit(): void {
        this.initialize();
        this.setEventListeners();
        this.setSubscriptions();
        this.autoCompleteValue.set(this.#value ?? "");
    }

    public onItemSelect(event: SelectionChangeEvent<TData>): void {
        const itemText = this.#listService.getItemText(event.item);
        this.updateValue(itemText);
        this.autoCompleteValue.set(itemText);
        this.notifyValueChange();
        this.close();
    }

    public onKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape" || event.key === "Tab") {
            this.close();
        } else if (event.key === "Enter") {
            this.handleEnterKey();
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            this.handleArrowKeys(event);
        }
    }

    public open(): void {
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
            this.#listService.clearSelections();
            this.#listService.clearFilter();
            const popupElement = document.querySelector(`.${this.#popupUidClass}`);
            if (DropDownService.shouldFocusAfterClose(this.#hostElementRef.nativeElement, popupElement)) {
                this.focus();
            }
            const input = this.#hostElementRef.nativeElement.querySelector("input");
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
        this.disabled.set(isDisabled);
    }

    public writeValue(data: any): void {
        this.updateValue(data);
    }

    private focus(): void {
        this.#hostElementRef.nativeElement?.focus();
    }

    private getItemStartsWith(value: string): ListItem<TData> | null {
        return this.#listService
            .viewItems()
            .where(i => !i.header && !this.#listService.isDisabled(i))
            .firstOrDefault(i => {
                return this.#listService.getItemText(i).toLowerCase().startsWith(value.toLowerCase());
            });
    }

    private handleArrowKeys(event: KeyboardEvent): void {
        const direction = event.key === "ArrowDown" ? "next" : "previous";
        this.#listService.navigate(direction, "highlight");
    }

    private handleEnterKey(): void {
        const highlightedItem = this.#listService.highlightedItem();
        const highlightedItemText = highlightedItem ? this.#listService.getItemText(highlightedItem) : "";
        const autoCompleteValue = this.autoCompleteValue();
        if (highlightedItemText && autoCompleteValue) {
            this.autoCompleteValue.set(highlightedItemText);
            if (this.#value !== this.autoCompleteValue()) {
                this.updateValue(highlightedItemText);
                this.notifyValueChange();
            }
        } else if (this.#value !== autoCompleteValue) {
            this.updateValue(autoCompleteValue);
            this.notifyValueChange();
        }
        this.close();
    }

    private initialize(): void {
        this.#listService.setNavigableOptions({ enabled: true, mode: "highlight" });
        this.#listService.setSelectableOptions(this.selectableOptions);
        this.#listService.selectedKeysChange = this.selectedKeysChange;
        this.#listService.filterInputVisible.set(false);
    }

    private notifyFilterChange(filter: string): FilterChangeEvent {
        const event = new FilterChangeEvent(filter);
        this.#listService.filterChange.emit(event);
        return event;
    }

    private notifyValueChange(): void {
        this.#propagateChange?.(this.#value);
    }

    private setEventListeners(): void {
        fromEvent<FocusEvent>(this.#hostElementRef.nativeElement, "focusin")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                const input = this.#hostElementRef.nativeElement.querySelector("input");
                if (input) {
                    input.focus();
                    input.setSelectionRange(-1, -1);
                }
            });
        fromEvent<FocusEvent>(this.#hostElementRef.nativeElement, "focusout")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => {
                const target = event.relatedTarget as HTMLElement;
                if (
                    !(
                        target &&
                        (this.#hostElementRef.nativeElement.contains(target) ||
                            this.#popupRef?.overlayRef.overlayElement.contains(target))
                    )
                ) {
                    return;
                }
            });
    }

    private setSubscriptions(): void {
        const debounce = this.#listService.filterableOptions().enabled
            ? this.#listService.filterableOptions().debounce
            : 0;
        this.autoCompleteValue$
            .pipe(
                tap(() => {
                    if (!this.#popupRef) {
                        this.open();
                    }
                }),
                debounceTime(debounce),
                takeUntilDestroyed(this.#destroyRef)
            )
            .subscribe((value: string) => {
                if (!value) {
                    this.autoCompleteValue.set(value);
                    this.close();
                    return;
                }
                if (this.#listService.filterableOptions().enabled) {
                    const event = this.notifyFilterChange(value);
                    if (!event.isDefaultPrevented()) {
                        this.#listService.setFilter(value);
                    }
                }
                const item = this.getItemStartsWith(value);
                if (item) {
                    this.#listService.clearSelections();
                    this.#listService.highlightedItem.set(item);
                    this.#listService.scrollToItem$.next(item);
                } else {
                    this.#listService.clearSelections();
                    this.#listService.highlightedItem.set(null);
                }
                this.autoCompleteValue.set(value);
            });
    }

    private updateValue(value: string) {
        this.#value = value;
    }
}
