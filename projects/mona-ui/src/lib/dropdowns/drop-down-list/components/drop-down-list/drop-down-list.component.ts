import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { NgClass, NgIf, NgTemplateOutlet } from "@angular/common";
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
    OnInit,
    Signal,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Predicate } from "@mirei/ts-collections";
import { fromEvent, take } from "rxjs";
import { v4 } from "uuid";
import { AnimationState } from "../../../../animations/models/AnimationState";
import { PopupAnimationService } from "../../../../animations/services/popup-animation.service";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { ListComponent } from "../../../../common/list/components/list/list.component";
import { ListGroupHeaderTemplateDirective } from "../../../../common/list/directives/list-group-header-template.directive";
import { ListItemTemplateDirective } from "../../../../common/list/directives/list-item-template.directive";
import { ListSelectableDirective } from "../../../../common/list/directives/list-selectable.directive";
import { ListItem } from "../../../../common/list/models/ListItem";
import { SelectableOptions } from "../../../../common/list/models/SelectableOptions";
import { ListService } from "../../../../common/list/services/list.service";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { PopupService } from "../../../../popup/services/popup.service";
import { Action } from "../../../../utils/Action";
import { DropDownService } from "../../../services/drop-down.service";
import { DropDownListGroupTemplateDirective } from "../../directives/drop-down-list-group-template.directive";
import { DropDownListItemTemplateDirective } from "../../directives/drop-down-list-item-template.directive";
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
        NgIf,
        NgTemplateOutlet,
        FormsModule,
        FontAwesomeModule,
        ButtonDirective,
        ListComponent,
        ListItemTemplateDirective,
        ListGroupHeaderTemplateDirective,
        ListSelectableDirective
    ]
})
export class DropDownListComponent<TData> implements OnInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #popupUidClass: string = `mona-dropdown-popup-${v4()}`;
    #popupRef: PopupRef | null = null;
    #propagateChange: Action<TData | null> | null = null;
    #value: TData | null = null;

    protected readonly clearIcon: IconDefinition = faTimes;
    protected readonly dropdownIcon: IconDefinition = faChevronDown;
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

    @ContentChild(DropDownListGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate: TemplateRef<any> | null = null;

    @Input()
    public set itemDisabled(value: string | Predicate<TData> | null | undefined) {
        this.listService.setDisabledBy(value ?? "");
    }

    @ContentChild(DropDownListItemTemplateDirective, { read: TemplateRef })
    public itemTemplate: TemplateRef<any> | null = null;

    @Input()
    public placeholder?: string;

    @ViewChild("popupTemplate")
    public popupTemplate!: TemplateRef<any>;

    @Input()
    public showClearButton: boolean = false;

    @Input()
    public set textField(textField: string | null | undefined) {
        this.listService.setTextField(textField ?? "");
    }

    @Input()
    public set valueField(valueField: string | null | undefined) {
        this.listService.setValueField(valueField ?? "");
    }

    @ContentChild(DropDownListValueTemplateDirective, { read: TemplateRef })
    public valueTemplate: TemplateRef<any> | null = null;

    public constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly dropDownService: DropDownService,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly listService: ListService<TData>,
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupService: PopupService
    ) {}

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.updateValue(null);
        this.listService.clearSelections();
        this.#propagateChange?.(this.#value);
    }

    public close(): void {
        this.#popupRef?.close();
        this.#popupRef = null;
    }

    public ngOnInit(): void {
        this.initialize();
        this.setEventListeners();
    }

    public onItemSelect(item: ListItem<TData>): void {
        this.close();
    }

    public onSelectedKeysChange(keys: Array<any>): void {
        const item = this.selectedDataItem();
        this.updateValue(item);
    }

    public open(): void {
        if (this.#popupRef) {
            return;
        }
        this.#popupRef = this.popupService.create({
            anchor: this.dropdownWrapper,
            content: this.popupTemplate,
            hasBackdrop: false,
            withPush: false,
            width: this.elementRef.nativeElement.getBoundingClientRect().width,
            popupClass: ["mona-dropdown-popup-content", this.#popupUidClass],
            closeOnOutsideClick: false,
            positions: DropDownService.getDefaultPositions()
        });

        this.popupAnimationService.setupDropdownOutsideClickCloseAnimation(this.#popupRef);
        this.popupAnimationService.animateDropdown(this.#popupRef, AnimationState.Show);
        this.dropDownService.focusPopup(this.#popupUidClass);
        const previousItem = this.selectedListItem();
        this.#popupRef.closed.pipe(take(1)).subscribe(() => {
            this.#popupRef = null;
            this.focus();
            this.listService.clearFilter();
            if (previousItem !== this.selectedListItem()) {
                this.notifyValueChange();
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

    public setValue(value: any): void {
        this.updateValue(value);
        this.cdr.markForCheck();
    }

    public writeValue(obj: TData): void {
        this.updateValue(obj);
        if (obj != null) {
            this.listService.setSelectedDataItems([obj]);
        }
    }

    private focus(): void {
        (this.elementRef.nativeElement.firstElementChild as HTMLElement)?.focus();
    }

    private handleArrowKeys(event: KeyboardEvent): void {
        if (this.#popupRef) {
            return;
        }
        const previousItem = this.selectedListItem();
        const item = this.listService.navigate(event.key === "ArrowDown" ? "next" : "previous", "select");
        if (item) {
            if (previousItem === item) {
                return;
            }
            this.updateValue(item.data);
            this.notifyValueChange();
        }
    }

    private handleEnterKey(): void {
        if (this.#popupRef) {
            this.close();
            return;
        }
        this.open();
    }

    private handleEscapeKey(): void {
        if (this.#popupRef) {
            this.close();
        }
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            this.handleEnterKey();
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            this.handleArrowKeys(event);
        } else if (event.key === "Escape") {
            this.handleEscapeKey();
        }
    }

    private initialize(): void {
        this.listService.setNavigableOptions({ enabled: true, mode: "select" });
        this.listService.setSelectableOptions(this.selectableOptions);
    }

    private notifyValueChange(): void {
        this.#propagateChange?.(this.#value);
    }

    private setEventListeners(): void {
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => {
                this.handleKeyDown(event);
            });
    }

    private updateValue(value: TData | null): void {
        this.#value = value;
    }
}
