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
    TemplateRef,
    ViewChild
} from "@angular/core";
import { PopupService } from "../../../../../popup/services/popup.service";
import { PopupListService } from "../../../../services/popup-list.service";
import { PopupListValueChangeEvent } from "../../../../data/PopupListValueChangeEvent";
import { DropDownListItemTemplateDirective } from "../../directives/drop-down-list-item-template.directive";
import { DropDownListValueTemplateDirective } from "../../directives/drop-down-list-value-template.directive";
import { PopupListItem } from "../../../../data/PopupListItem";
import { DropDownListGroupTemplateDirective } from "../../directives/drop-down-list-group-template.directive";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../../../../utils/Action";
import { faChevronDown, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { fromEvent, Subject, take, takeUntil } from "rxjs";
import { AnimationService } from "../../../../../animations/animation.service";

@Component({
    selector: "mona-drop-down-list",
    templateUrl: "./drop-down-list.component.html",
    styleUrls: ["./drop-down-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        PopupListService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropDownListComponent),
            multi: true
        }
    ]
})
export class DropDownListComponent implements OnInit, OnDestroy, ControlValueAccessor {
    readonly #destroy$: Subject<void> = new Subject<void>();
    #propagateChange: any = () => {};
    #value: any;
    public readonly clearIcon: IconDefinition = faTimes;
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    public popupRef: PopupRef | null = null;
    public valuePopupListItem?: PopupListItem;

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

    @ContentChild(DropDownListGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<any>;

    @Input()
    public itemDisabler?: Action<any, boolean> | string;

    @ContentChild(DropDownListItemTemplateDirective, { read: TemplateRef })
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

    @ContentChild(DropDownListValueTemplateDirective, { read: TemplateRef })
    public valueTemplate?: TemplateRef<any>;

    public constructor(
        private readonly animationService: AnimationService,
        private readonly cdr: ChangeDetectorRef,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupListService: PopupListService,
        private readonly popupService: PopupService
    ) {}

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.updateValue(undefined);
        this.#propagateChange?.(this.value);
    }

    public close(): void {
        this.popupRef?.close();
        this.popupRef = null;
    }

    public ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
    }

    public ngOnInit(): void {
        this.initialize();
        this.setEventListeners();
    }

    public onPopupListValueChange(event: PopupListValueChangeEvent): void {
        if (!event.value || event.value.length === 0) {
            if (this.#value === undefined) {
                return;
            }
            this.#value = undefined;
            this.valuePopupListItem = undefined;
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
        this.#value = event.value[0].data;
        this.valuePopupListItem = event.value[0];
        this.#propagateChange?.(this.value);
    }

    public open(): void {
        this.dropdownWrapper.nativeElement.focus();
        this.popupRef = this.popupService.create({
            anchor: this.dropdownWrapper,
            content: this.popupTemplate,
            hasBackdrop: true,
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
        this.animationService.slideDown(this.popupRef.overlayRef.overlayElement.firstElementChild as HTMLElement);
        this.animationService.animate({
            element: this.popupRef.overlayRef.overlayElement as HTMLElement,
            duration: 200,
            delay: 150,
            startStyles: { boxShadow: "none" },
            endStyles: { boxShadow: "var(--mona-popup-shadow)" }
        });
        this.cdr.markForCheck();

        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            (this.elementRef.nativeElement.firstElementChild as HTMLElement)?.focus();
            this.popupListService.clearFilters();
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
    }

    private setEventListeners(): void {
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(takeUntil(this.#destroy$))
            .subscribe(event => {
                if (event.key === "Enter") {
                    if (this.popupRef) {
                        this.close();
                        return;
                    }
                    this.open();
                } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    if (this.popupRef) {
                        return;
                    }
                    const listItem = this.popupListService.navigate(event, "single");
                    if (listItem) {
                        if (!listItem.dataEquals(this.value)) {
                            this.updateValue(listItem.data);
                            this.#propagateChange?.(this.value);
                        }
                    }
                } else if (event.key === "Escape") {
                    this.close();
                }
            });
    }

    private updateValue(value: any): void {
        this.#value = value;
        this.valuePopupListItem = this.popupListService.viewListData
            .selectMany(g => g.source)
            .singleOrDefault(d => d.dataEquals(this.value));
    }

    public get value(): any {
        return this.#value;
    }
}
