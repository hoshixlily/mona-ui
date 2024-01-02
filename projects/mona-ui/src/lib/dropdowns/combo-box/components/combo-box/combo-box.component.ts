import { NgClass, NgIf, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChild,
    DestroyRef,
    ElementRef,
    forwardRef,
    HostBinding,
    inject,
    Input,
    OnInit,
    Signal,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Predicate, Selector } from "@mirei/ts-collections";
import { distinctUntilChanged, fromEvent, map, Observable, of, Subject, take } from "rxjs";
import { v4 } from "uuid";
import { AnimationState } from "../../../../animations/models/AnimationState";
import { PopupAnimationService } from "../../../../animations/services/popup-animation.service";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { ListComponent } from "../../../../common/list/components/list/list.component";
import { ListGroupHeaderTemplateDirective } from "../../../../common/list/directives/list-group-header-template.directive";
import { ListSelectableDirective } from "../../../../common/list/directives/list-selectable.directive";
import { ListItem } from "../../../../common/list/models/ListItem";
import { SelectableOptions } from "../../../../common/list/models/SelectableOptions";
import { ListService } from "../../../../common/list/services/list.service";
import { TextBoxDirective } from "../../../../inputs/text-box/directives/text-box.directive";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { PopupService } from "../../../../popup/services/popup.service";
import { Action } from "../../../../utils/Action";
import { ListItemTemplateDirective } from "../../../popup-list/directives/list-item-template.directive";
import { DropDownService } from "../../../services/drop-down.service";
import { ComboBoxGroupTemplateDirective } from "../../directives/combo-box-group-template.directive";
import { ComboBoxItemTemplateDirective } from "../../directives/combo-box-item-template.directive";

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
        NgIf,
        FontAwesomeModule,
        ButtonDirective,
        NgTemplateOutlet,
        ListComponent,
        ListSelectableDirective,
        ListGroupHeaderTemplateDirective,
        ListItemTemplateDirective
    ]
})
export class ComboBoxComponent<TData> implements OnInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #popupUidClass: string = `mona-dropdown-popup-${v4()}`;
    #popupRef: PopupRef | null = null;
    #propagateChange: any = () => {};
    #value: any;

    protected readonly dropdownText: Signal<string> = computed(() => {
        const listItem = this.selectedListItem();
        if (!listItem) {
            return "";
        }
        return this.listService.getItemText(listItem);
    });
    protected readonly selectableOptions: SelectableOptions = {
        enabled: true,
        mode: "single",
        toggleable: false
    };
    protected readonly selectedDataItem: Signal<TData | null> = computed(() => {
        return this.selectedListItem()?.data ?? null;
    });
    protected readonly selectedListItem: Signal<ListItem<TData> | null> = computed(() => {
        return this.listService.selectedListItems().firstOrDefault();
    });

    public readonly clearIcon: IconDefinition = faTimes;
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    public readonly comboBoxValue$: Subject<string> = new Subject<string>();
    public comboBoxValue: WritableSignal<string> = signal("");

    @HostBinding("class.mona-dropdown")
    public readonly hostClass: boolean = true;

    @Input()
    public allowCustomValue: boolean = true;

    @Input()
    public set data(value: Iterable<TData>) {
        this.listService.setData(value);
    }

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
    public set itemDisabled(value: string | Predicate<TData> | null | undefined) {
        this.listService.setDisabledBy(value ?? "");
    }

    @ContentChild(ComboBoxItemTemplateDirective, { read: TemplateRef })
    public itemTemplate: TemplateRef<any> | null = null;

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

    @Input()
    public valueNormalizer: Action<Observable<string>, Observable<any>> = (text$: Observable<string>) =>
        text$.pipe(map(value => value));

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly dropDownService: DropDownService,
        private readonly listService: ListService<TData>,
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupService: PopupService
    ) {}

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.updateValue(null);
        this.#propagateChange?.(undefined);
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

    public onItemSelect(item: ListItem<TData>): void {
        this.close();
    }

    public onKeydown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            // const item = this.popupListService.viewListData
            //     .selectMany(g => g.source)
            //     .firstOrDefault(i => i.text.toLowerCase() === this.comboBoxValue().toLowerCase());
            // if (item) {
            //     if (item.dataEquals(this.value)) {
            //         this.close();
            //         return;
            //     }
            //     this.popupListService.selectItem(item, "single");
            //     this.updateValue(item.data);
            //     this.#propagateChange?.(item.data);
            // } else {
            //     if (this.allowCustomValue) {
            //         this.handleCustomValue();
            //     } else {
            //         this.comboBoxValue.set("");
            //     }
            // }
            this.close();
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            this.handleArrowKeys(event);
        } else if (event.key === "Escape") {
            this.close();
        }
    }

    public onSelectedKeysChange(keys: Array<any>): void {
        const item = this.selectedDataItem();
        this.updateValue(item);
    }

    public open(): void {
        this.dropdownWrapper.nativeElement.focus();
        if (this.#popupRef) {
            return;
        }
        this.#popupRef = this.popupService.create({
            anchor: this.dropdownWrapper,
            content: this.popupTemplate,
            hasBackdrop: false,
            closeOnOutsideClick: false,
            withPush: false,
            width: this.elementRef.nativeElement.getBoundingClientRect().width,
            popupClass: ["mona-dropdown-popup-content", this.#popupUidClass],
            positions: DropDownService.getDefaultPositions()
        });
        this.popupAnimationService.setupDropdownOutsideClickCloseAnimation(this.#popupRef);
        this.popupAnimationService.animateDropdown(this.#popupRef, AnimationState.Show);
        // this.dropDownService.focusPopup(this.#popupUidClass);
        window.setTimeout(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
                input.setSelectionRange(-1, -1);
            }
        });
        const previousItem = this.selectedListItem();
        this.#popupRef.closed.pipe(take(1)).subscribe(() => {
            this.#popupRef = null;
            this.listService.clearFilter();
            this.focus();
            if (previousItem !== this.selectedListItem()) {
                this.notifyValueChange();
            }
            // const item = this.popupListService.viewListData
            //     .selectMany(g => g.source)
            //     .firstOrDefault(i => i.text.toLowerCase() === this.comboBoxValue().toLowerCase());
            // if (!item) {
            //     this.comboBoxValue.set("");
            // }
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

    public writeValue(obj: TData): void {
        this.updateValue(obj);
        if (obj != null) {
            this.listService.setSelectedDataItems([obj]);
            this.comboBoxValue.set(this.dropdownText());
        }
    }

    private focus(): void {
        (this.elementRef.nativeElement.firstElementChild as HTMLElement)?.focus();
    }

    private handleArrowKeys(event: KeyboardEvent): void {
        // if (this.#popupRef) {
        //     return;
        // }
        const previousItem = this.selectedListItem();
        const direction = event.key === "ArrowDown" ? "next" : "previous";
        const listItem = this.listService.navigate(direction, "select");
        if (!listItem || previousItem === listItem) {
            return;
        }
        this.updateValue(listItem.data);
        if (!this.#popupRef) {
            this.notifyValueChange();
        }
    }

    private handleCustomValue(): void {
        this.valueNormalizer(of(this.comboBoxValue()))
            .pipe(take(1))
            .subscribe(normalizedValue => {
                const updatedData = [...this.data, normalizedValue];
                this.listService.setData(updatedData);
                const item = this.listService
                    .viewItems()
                    .firstOrDefault(
                        i => this.listService.getItemText(i).toLowerCase() === this.comboBoxValue().toLowerCase()
                    );
                if (item) {
                    this.listService.selectItem(item);
                    this.updateValue(item.data);
                    this.notifyValueChange();
                }
            });
    }

    private initialize(): void {
        // this.popupListService.initializeListData({
        //     data: this.data,
        //     disabler: this.itemDisabler,
        //     textField: this.textField,
        //     valueField: this.valueField,
        //     groupField: this.groupField
        // });
        // this.valuePopupListItem = this.popupListService.viewListData
        //     .selectMany(g => g.source)
        //     .singleOrDefault(d => d.dataEquals(this.value));
        // if (this.valuePopupListItem) {
        //     this.valuePopupListItem.selected.set(true);
        // }
        this.listService.setNavigableOptions({ enabled: true, mode: "select" });
        this.listService.setSelectableOptions(this.selectableOptions);
        this.comboBoxValue.set(this.dropdownText());
    }

    private notifyValueChange(): void {
        this.#propagateChange?.(this.#value);
    }

    private setEventListeners(): void {
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => {
                const target = event.relatedTarget as HTMLElement;
                if (
                    target &&
                    (this.elementRef.nativeElement.contains(target) ||
                        this.#popupRef?.overlayRef.overlayElement.contains(target))
                ) {
                    return;
                }
                // this.close();
            });
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusin")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                const input = this.elementRef.nativeElement.querySelector("input");
                if (input) {
                    input.focus();
                    input.setSelectionRange(-1, -1);
                }
            });
    }

    private setSubscriptions(): void {
        this.comboBoxValue$.pipe(takeUntilDestroyed(this.#destroyRef), distinctUntilChanged()).subscribe(value => {
            if (this.filterable) {
                // if (!value) {
                //     this.popupListService.viewListData = this.popupListService.sourceListData.toList();
                //     this.popupListService.filterModeActive = false;
                // } else {
                //     this.popupListService.viewListData = this.popupListService.sourceListData
                //         .select(g => {
                //             const filteredItems = g.source.where(i =>
                //                 i.text.toLowerCase().includes(value.toLowerCase())
                //             );
                //             return new Group<string, PopupListItem>(g.key, filteredItems.toList());
                //         })
                //         .toList();
                //     this.popupListService.filterModeActive = true;
                // }
            }
            // this.popupListService.viewListData
            //     .selectMany(g => g.source)
            //     .forEach(i => {
            //         i.highlighted.set(false);
            //         i.selected.set(false);
            //     });
            // const popupListItem = this.popupListService.viewListData
            //     .selectMany(g => g.source)
            //     .firstOrDefault(item => !item.disabled && item.text.toLowerCase().includes(value.toLowerCase()));
            // if (!this.popupRef) {
            //     this.open();
            // }
            // if (popupListItem) {
            //     popupListItem.highlighted.set(true);
            //     this.popupListService.scrollToListItem$.next(popupListItem);
            // }
            this.comboBoxValue.set(value);
        });
    }

    private updateValue(value: TData | null) {
        this.#value = value;
        // this.valuePopupListItem = this.popupListService.viewListData
        //     .selectMany(g => g.source)
        //     .singleOrDefault(d => d.dataEquals(this.value));
        this.comboBoxValue.set(this.dropdownText());
    }
}
