import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    forwardRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { PopupListService } from "../../../../services/popup-list.service";
import { PopupService } from "../../../../../popup/services/popup.service";
import { PopupListItem } from "../../../../data/PopupListItem";
import { PopupListValueChangeEvent } from "../../../../data/PopupListValueChangeEvent";
import { MultiSelectTagTemplateDirective } from "../../directives/multi-select-tag-template.directive";
import { MultiSelectItemTemplateDirective } from "../../directives/multi-select-item-template.directive";
import { MultiSelectGroupTemplateDirective } from "../../directives/multi-select-group-template.directive";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { fromEvent, Subject, take, takeUntil } from "rxjs";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { Action } from "../../../../../utils/Action";
import { faChevronDown, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";
import { AnimationState } from "../../../../../animations/AnimationState";

@Component({
    selector: "mona-multi-select",
    templateUrl: "./multi-select.component.html",
    styleUrls: ["./multi-select.component.scss"],
    providers: [
        PopupListService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiSelectComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {
    readonly #destroy$: Subject<void> = new Subject<void>();
    #propagateChange: any = () => {};
    #value: any[] = [];

    public readonly clearIcon: IconDefinition = faTimes;
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    private resizeObserver: ResizeObserver | null = null;
    public popupListValues: any[] = [];
    public popupRef: PopupRef | null = null;
    public summaryTagTemplate: TemplateRef<any> | null = null;
    public tagCount: number = -1;
    public valuePopupListItem: PopupListItem[] = [];

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

    @ContentChild(MultiSelectGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate: TemplateRef<any> | null = null;

    @Input()
    public itemDisabler?: Action<any, boolean> | string;

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
    public textField?: string;

    @Input()
    public valueField?: string;

    public constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupListService: PopupListService,
        private readonly popupService: PopupService
    ) {}

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.updateValue([]);
        this.#propagateChange(this.#value);
    }

    public close(): void {
        this.popupRef?.close();
        this.popupRef = null;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes["data"] && !changes["data"].isFirstChange()) {
            this.initialize();
        }
        if (changes["value"]) {
            this.popupListValues = [...this.value];
            this.valuePopupListItem = this.popupListService.viewListData
                .selectMany(g => g.source)
                .where(d => this.value.some(v => d.dataEquals(v)))
                .toArray();
        }
    }

    public ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
        this.resizeObserver?.disconnect();
    }

    public ngOnInit(): void {
        this.initialize();
        this.setEventListeners();
    }

    public onPopupListValueChange(event: PopupListValueChangeEvent): void {
        if (this.value && this.containsValue(event.value, this.value)) {
            return;
        }
        this.updateValue(event.value.map(v => v.data));
        this.#propagateChange(this.#value);
        this.cdr.detectChanges();
    }

    public onSelectedItemRemove(event: Event, popupListItem: PopupListItem): void {
        event.stopImmediatePropagation();
        const remainingItems = this.valuePopupListItem.filter(item => !item.dataEquals(popupListItem.data)) ?? [];
        this.updateValue(remainingItems.map(item => item.data));
        this.#propagateChange(this.#value);
    }

    public onSelectedItemGroupRemove(event: Event): void {
        event.stopImmediatePropagation();
        const remainingItems = this.valuePopupListItem.slice(0, this.visibleTagCount);
        this.updateValue(remainingItems.map(item => item.data));
        this.#propagateChange(this.#value);
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
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            (this.elementRef.nativeElement.firstElementChild as HTMLElement)?.focus();
            this.popupListService.clearFilters();
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
    }

    private containsValue(popupListItems: PopupListItem[], value: any): boolean {
        return popupListItems.some(popupListItem => popupListItem.dataEquals(value));
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
            .where(d => this.value.some(v => d.dataEquals(v)))
            .toArray();
        this.valuePopupListItem.forEach(d => d.selected.set(true));
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
            .pipe(takeUntil(this.#destroy$))
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

    private updateValue(value: any[]): void {
        this.#value = value;
        const items = this.popupListService.viewListData
            .selectMany(g => g.source)
            .where(d => (this.value as any[]).some(v => d.dataEquals(v)))
            .toArray();
        this.popupListValues = items.map(i => i.data);
        this.valuePopupListItem = items;
    }

    public get summaryTagText(): string {
        return this.tagCount < 0
            ? ""
            : this.tagCount === 0
            ? `${this.valuePopupListItem.length} item${this.valuePopupListItem.length === 1 ? "" : "s"}`
            : `+${this.valuePopupListItem.length - this.tagCount} item${
                  this.valuePopupListItem.length - this.tagCount > 1 ? "s" : ""
              }`;
    }

    public get value(): any[] {
        return this.#value;
    }

    public get visibleTagCount(): number {
        return this.tagCount < 0 ? this.valuePopupListItem.length : this.tagCount === 0 ? 0 : this.tagCount;
    }
}
