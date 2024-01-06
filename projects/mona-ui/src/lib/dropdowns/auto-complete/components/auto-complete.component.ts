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
    OnInit,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Predicate, Selector } from "@mirei/ts-collections";
import { debounceTime, fromEvent, Subject, take, tap } from "rxjs";
import { v4 } from "uuid";
import { AnimationState } from "../../../animations/models/AnimationState";
import { PopupAnimationService } from "../../../animations/services/popup-animation.service";
import { FilterChangeEvent } from "../../../common/filter-input/models/FilterChangeEvent";
import { ListComponent } from "../../../common/list/components/list/list.component";
import { ListFooterTemplateDirective } from "../../../common/list/directives/list-footer-template.directive";
import { ListGroupHeaderTemplateDirective } from "../../../common/list/directives/list-group-header-template.directive";
import { ListHeaderTemplateDirective } from "../../../common/list/directives/list-header-template.directive";
import { ListItemTemplateDirective } from "../../../common/list/directives/list-item-template.directive";
import { ListNoDataTemplateDirective } from "../../../common/list/directives/list-no-data-template.directive";
import { ListSelectableDirective } from "../../../common/list/directives/list-selectable.directive";
import { ListItem } from "../../../common/list/models/ListItem";
import { SelectableOptions } from "../../../common/list/models/SelectableOptions";
import { ListService } from "../../../common/list/services/list.service";
import { TextBoxDirective } from "../../../inputs/text-box/directives/text-box.directive";
import { PopupRef } from "../../../popup/models/PopupRef";
import { PopupService } from "../../../popup/services/popup.service";
import { Action } from "../../../utils/Action";
import { DropDownService } from "../../services/drop-down.service";
import { AutoCompleteFooterTemplateDirective } from "../directives/auto-complete-footer-template.directive";
import { AutoCompleteGroupHeaderTemplateDirective } from "../directives/auto-complete-group-header-template.directive";
import { AutoCompleteHeaderTemplateDirective } from "../directives/auto-complete-header-template.directive";
import { AutoCompleteItemTemplateDirective } from "../directives/auto-complete-item-template.directive";
import { AutoCompleteNoDataTemplateDirective } from "../directives/auto-complete-no-data-template.directive";

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
        NgIf,
        FontAwesomeModule,
        NgTemplateOutlet,
        ListComponent,
        ListSelectableDirective,
        ListGroupHeaderTemplateDirective,
        ListFooterTemplateDirective,
        ListHeaderTemplateDirective,
        ListNoDataTemplateDirective,
        ListItemTemplateDirective
    ]
})
export class AutoCompleteComponent<TData> implements OnInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #popupUidClass: string = `mona-dropdown-popup-${v4()}`;
    #propagateChange: Action<string | null> | null = null;
    #value: string = "";

    public readonly autoCompleteValue$: Subject<string> = new Subject<string>();
    public readonly clearIcon: IconDefinition = faTimes;
    public autoCompleteValue: WritableSignal<string> = signal("");
    public popupRef: PopupRef | null = null;

    protected readonly selectableOptions: SelectableOptions = {
        enabled: true,
        mode: "single",
        toggleable: false
    };

    @HostBinding("class.mona-dropdown")
    public readonly hostClass: boolean = true;

    @Input()
    public set data(value: Iterable<TData>) {
        this.listService.setData(value);
    }

    @Input()
    public disabled: boolean = false;

    @ViewChild("dropdownWrapper")
    public dropdownWrapper!: ElementRef<HTMLDivElement>;

    @ContentChild(AutoCompleteFooterTemplateDirective, { read: TemplateRef })
    public footerTemplate: TemplateRef<any> | null = null;

    @ContentChild(AutoCompleteGroupHeaderTemplateDirective, { read: TemplateRef })
    public groupHeaderTemplate: TemplateRef<any> | null = null;

    @ContentChild(AutoCompleteHeaderTemplateDirective, { read: TemplateRef })
    public headerTemplate: TemplateRef<any> | null = null;

    @Input()
    public set itemDisabled(value: string | Predicate<TData> | null | undefined) {
        this.listService.setDisabledBy(value ?? "");
    }

    @ContentChild(AutoCompleteItemTemplateDirective, { read: TemplateRef })
    public itemTemplate: TemplateRef<any> | null = null;

    @ContentChild(AutoCompleteNoDataTemplateDirective, { read: TemplateRef })
    public noDataTemplate: TemplateRef<any> | null = null;

    @Input()
    public placeholder?: string;

    @ViewChild("popupTemplate")
    public popupTemplate!: TemplateRef<any>;

    @Input()
    public showClearButton: boolean = false;

    @Input()
    public set textField(value: string | Selector<TData, string> | null | undefined) {
        this.listService.setTextField(value ?? "");
    }

    @Input()
    public set valueField(value: string | Selector<TData, any> | null | undefined) {
        this.listService.setValueField(value ?? "");
    }

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly listService: ListService<TData>,
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupService: PopupService
    ) {}

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.updateValue("");
        this.autoCompleteValue.set("");
        this.listService.clearSelections();
        this.#propagateChange?.(null);
    }

    public close(): void {
        this.popupRef?.close();
        this.popupRef = null;
    }

    public ngOnInit(): void {
        this.initialize();
        this.setEventListeners();
        this.setSubscriptions();
        this.autoCompleteValue.set(this.#value ?? "");
    }

    public onItemSelect(item: ListItem<TData>): void {
        const itemText = this.listService.getItemText(item);
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
        this.dropdownWrapper.nativeElement.focus();
        this.popupRef = this.popupService.create({
            anchor: this.dropdownWrapper,
            content: this.popupTemplate,
            hasBackdrop: false,
            closeOnOutsideClick: false,
            withPush: false,
            width: this.elementRef.nativeElement.getBoundingClientRect().width,
            popupClass: ["mona-dropdown-popup-content", this.#popupUidClass],
            positions: DropDownService.getDefaultPositions()
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
            this.listService.clearSelections();
            this.listService.clearFilter();
            const popupElement = document.querySelector(`.${this.#popupUidClass}`);
            if (DropDownService.shouldFocusAfterClose(this.elementRef.nativeElement, popupElement)) {
                this.focus();
            }
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

    private focus(): void {
        (this.elementRef.nativeElement.firstElementChild as HTMLElement)?.focus();
    }

    private getItemStartsWith(value: string): ListItem<TData> | null {
        return this.listService
            .viewItems()
            .where(i => !i.header && !this.listService.isDisabled(i))
            .firstOrDefault(i => {
                return this.listService.getItemText(i).toLowerCase().startsWith(value.toLowerCase());
            });
    }

    private handleArrowKeys(event: KeyboardEvent): void {
        const direction = event.key === "ArrowDown" ? "next" : "previous";
        this.listService.navigate(direction, "highlight");
    }

    private handleEnterKey(): void {
        const highlightedItem = this.listService.highlightedItem();
        const highlightedItemText = highlightedItem ? this.listService.getItemText(highlightedItem) : "";
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
        this.listService.setNavigableOptions({ enabled: true, mode: "highlight" });
        this.listService.setSelectableOptions(this.selectableOptions);
        this.listService.filterInputVisible.set(false);
    }

    private notifyFilterChange(filter: string): FilterChangeEvent {
        const event = new FilterChangeEvent(filter);
        this.listService.filterChange.emit(event);
        return event;
    }

    private notifyValueChange(): void {
        this.#propagateChange?.(this.#value);
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
                    return;
                }
            });
    }

    private setSubscriptions(): void {
        const debounce = this.listService.filterableOptions().enabled
            ? this.listService.filterableOptions().debounce
            : 0;
        this.autoCompleteValue$
            .pipe(
                tap(() => {
                    if (!this.popupRef) {
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
                if (this.listService.filterableOptions().enabled) {
                    const event = this.notifyFilterChange(value);
                    if (!event.isDefaultPrevented()) {
                        this.listService.setFilter(value);
                    }
                }
                const item = this.getItemStartsWith(value);
                if (item) {
                    this.listService.clearSelections();
                    this.listService.highlightedItem.set(item);
                    this.listService.scrollToItem$.next(item);
                } else {
                    this.listService.clearSelections();
                    this.listService.highlightedItem.set(null);
                }
                this.autoCompleteValue.set(value);
            });
    }

    private updateValue(value: string) {
        this.#value = value;
    }
}
