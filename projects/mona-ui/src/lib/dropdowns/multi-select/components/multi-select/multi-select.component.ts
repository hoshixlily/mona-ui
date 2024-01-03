import { NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    ContentChild,
    DestroyRef,
    ElementRef,
    forwardRef,
    HostBinding,
    inject,
    Input,
    OnDestroy,
    OnInit,
    signal,
    Signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ImmutableDictionary, ImmutableSet, Predicate } from "@mirei/ts-collections";
import { fromEvent, take } from "rxjs";
import { v4 } from "uuid";
import { AnimationState } from "../../../../animations/models/AnimationState";
import { PopupAnimationService } from "../../../../animations/services/popup-animation.service";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { ChipComponent } from "../../../../buttons/chip/chip.component";
import { ListComponent } from "../../../../common/list/components/list/list.component";
import { ListGroupHeaderTemplateDirective } from "../../../../common/list/directives/list-group-header-template.directive";
import { ListItemTemplateDirective } from "../../../../common/list/directives/list-item-template.directive";
import { ListItem } from "../../../../common/list/models/ListItem";
import { ListService } from "../../../../common/list/services/list.service";
import { SlicePipe } from "../../../../pipes/slice.pipe";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { PopupService } from "../../../../popup/services/popup.service";
import { Action } from "../../../../utils/Action";
import { PopupListService } from "../../../popup-list/services/popup-list.service";
import { DropDownService } from "../../../services/drop-down.service";
import { MultiSelectGroupTemplateDirective } from "../../directives/multi-select-group-template.directive";
import { MultiSelectItemTemplateDirective } from "../../directives/multi-select-item-template.directive";
import { MultiSelectTagTemplateDirective } from "../../directives/multi-select-tag-template.directive";

@Component({
    selector: "mona-multi-select",
    templateUrl: "./multi-select.component.html",
    styleUrls: ["./multi-select.component.scss"],
    providers: [
        PopupListService,
        ListService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiSelectComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
        NgFor,
        ChipComponent,
        NgIf,
        NgTemplateOutlet,
        FontAwesomeModule,
        ButtonDirective,
        SlicePipe,
        ListComponent,
        ListGroupHeaderTemplateDirective,
        ListItemTemplateDirective
    ]
})
export class MultiSelectComponent<TData> implements OnInit, OnDestroy, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #popupUidClass: string = `mona-dropdown-popup-${v4()}`;
    #propagateChange: Action<TData | null> | null = null;
    #value: TData[] = [];

    protected readonly selectedDataItems: Signal<ImmutableSet<TData>> = computed(() => {
        return this.selectedListItems()
            .select(i => i.data)
            .toImmutableSet();
    });
    protected readonly selectedListItems: Signal<ImmutableSet<ListItem<TData>>> = computed(() => {
        return this.listService.selectedListItems();
    });
    protected readonly summaryTagText: Signal<string> = computed(() => {
        const tagCount = this.tagCount();
        const itemCount = this.selectedListItems().size();
        if (tagCount < 0) {
            return "";
        } else if (tagCount === 0) {
            return `${itemCount} item${itemCount === 1 ? "" : "s"}`;
        } else {
            return `+${itemCount - tagCount} item${itemCount - tagCount > 1 ? "s" : ""}`;
        }
    });
    protected readonly valueTextMap: Signal<ImmutableDictionary<ListItem<TData>, string>> = computed(() => {
        const tagCount = this.visibleTagCount();
        return this.selectedListItems()
            .take(tagCount)
            .toImmutableDictionary(
                i => i,
                i => this.listService.getItemText(i)
            );
    });
    protected readonly visibleTagCount: Signal<number> = computed(() => {
        const tagCount = this.tagCount();
        const itemCount = this.selectedListItems().size();
        return tagCount < 0 ? itemCount : tagCount === 0 ? 0 : tagCount;
    });

    public readonly clearIcon: IconDefinition = faTimes;
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    public readonly tagCount: WritableSignal<number> = signal(-1);
    private resizeObserver: ResizeObserver | null = null;
    public popupRef: PopupRef | null = null;
    public summaryTagTemplate: TemplateRef<any> | null = null;

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

    @Input()
    public filterable: boolean = false;

    @ContentChild(MultiSelectGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate: TemplateRef<any> | null = null;

    @Input()
    public set itemDisabled(value: string | Predicate<TData> | null | undefined) {
        this.listService.setDisabledBy(value ?? "");
    }

    @ContentChild(MultiSelectItemTemplateDirective, { read: TemplateRef })
    public itemTemplate: TemplateRef<any> | null = null;

    @Input()
    public placeholder?: string;

    @ViewChild("popupTemplate")
    public popupTemplate!: TemplateRef<any>;

    @Input()
    public showClearButton: boolean = false;

    @ContentChild(MultiSelectTagTemplateDirective, { read: TemplateRef })
    public tagTemplate: TemplateRef<any> | null = null;

    @Input()
    public set textField(textField: string | null | undefined) {
        this.listService.setTextField(textField ?? "");
    }

    @Input()
    public set valueField(valueField: string | null | undefined) {
        this.listService.setValueField(valueField ?? "");
    }

    public constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly listService: ListService<TData>,
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupService: PopupService
    ) {}

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.updateValue([]);
        this.listService.clearSelections();
        // this.#propagateChange(this.#value);
    }

    public close(): void {
        this.popupRef?.close();
        this.popupRef = null;
    }

    public ngOnDestroy(): void {
        this.resizeObserver?.disconnect();
    }

    public ngOnInit(): void {
        this.initialize();
        this.setEventListeners();
    }

    // public onPopupListValueChange(event: PopupListValueChangeEvent): void {
    //     if (this.value && this.containsValue(event.value, this.value)) {
    //         return;
    //     }
    //     this.updateValue(event.value.map(v => v.data));
    //     this.#propagateChange(this.#value);
    //     this.cdr.detectChanges();
    // }

    public onSelectedItemRemove(event: Event, listItem: ListItem<TData>): void {
        event.stopImmediatePropagation();
        // const remainingItems = this.valuePopupListItem.filter(item => !item.dataEquals(popupListItem.data)) ?? [];
        this.listService.deselectItems([listItem]);
        this.updateValue(this.selectedDataItems().toArray());
        // this.#propagateChange(this.#value);
    }

    public onSelectedItemGroupRemove(event: Event): void {
        event.stopImmediatePropagation();
        const selectedItemCount = this.selectedListItems().size();
        const removedItems = this.selectedListItems()
            .takeLast(selectedItemCount - this.visibleTagCount())
            .toArray();
        // const remainingItems = this.selectedListItems().skipLast(this.visibleTagCount()).toArray();
        this.listService.deselectItems(removedItems);
        this.updateValue(this.selectedDataItems().toArray());
        // this.#propagateChange(this.#value);
    }

    public open(): void {
        if (this.popupRef) {
            return;
        }
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
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.listService.highlightedItem.set(null);
            (this.elementRef.nativeElement.firstElementChild as HTMLElement)?.focus();
            this.listService.clearFilter();
        });
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {}

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public writeValue(data: any[]): void {
        this.updateValue(data ?? []);
        if (data != null) {
            this.listService.setSelectedDataItems(data);
        }
    }

    // private containsValue(popupListItems: PopupListItem[], value: any): boolean {
    //     return popupListItems.some(popupListItem => popupListItem.dataEquals(value));
    // }

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
        //     .where(d => this.value.some(v => d.dataEquals(v)))
        //     .toArray();
        // this.valuePopupListItem.forEach(d => d.selected.set(true));
        this.listService.setNavigableOptions({ enabled: true, mode: "highlight" });
        this.listService.setSelectableOptions({
            enabled: true,
            mode: "multiple"
        });
    }

    private setEventListeners(): void {
        this.resizeObserver = new ResizeObserver(() => {
            window.setTimeout(() => {
                this.popupRef?.overlayRef.updatePosition();
                this.popupRef?.overlayRef.updateSize({
                    width: this.elementRef.nativeElement.getBoundingClientRect().width
                });
            });
        });
        this.resizeObserver.observe(this.elementRef.nativeElement);

        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((event: KeyboardEvent) => {
                if (event.key === "Enter") {
                    if (this.popupRef) {
                        return;
                    }
                } else if (event.key === "Escape") {
                    this.close();
                }
            });
    }

    private updateValue(value: TData[]): void {
        this.#value = value;
        // const items = this.popupListService.sourceListData
        //     .selectMany(g => g.source)
        //     .where(d => (this.value as any[]).some(v => d.dataEquals(v)))
        //     .toArray();
        // this.popupListValues = items.map(i => i.data);
        // this.valuePopupListItem = items;
    }
}
