import { Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef } from "@angular/core";
import { AbstractDropDownListComponent } from "../../../../components/abstract-drop-down-list/abstract-drop-down-list.component";
import { PopupListService } from "../../../../services/popup-list.service";
import { PopupService } from "../../../../../popup/services/popup.service";
import { SelectionMode } from "../../../../../models/SelectionMode";
import { debounceTime, distinctUntilChanged, fromEvent, Subject, take, takeUntil } from "rxjs";
import { PopupListItem } from "../../../../data/PopupListItem";
import { ComboBoxGroupTemplateDirective } from "../../../combo-box/directives/combo-box-group-template.directive";
import { ComboBoxItemTemplateDirective } from "../../../combo-box/directives/combo-box-item-template.directive";
import { PopupListValueChangeEvent } from "../../../../data/PopupListValueChangeEvent";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { PopupSettings } from "../../../../../popup/models/PopupSettings";
import { Group } from "@mirei/ts-collections";

@Component({
    selector: "mona-auto-complete",
    templateUrl: "./auto-complete.component.html",
    styleUrls: ["./auto-complete.component.scss"],
    providers: [PopupListService]
})
export class AutoCompleteComponent extends AbstractDropDownListComponent implements OnInit {
    protected override navigateWhileClosed: boolean = false;
    protected selectionMode: SelectionMode = "single";
    public readonly autoCompleteValue$: Subject<string> = new Subject<string>();
    public autoCompleteValue: string = "";
    public override valuePopupListItem?: PopupListItem;

    @Input()
    public filterable: boolean = false;

    @ContentChild(ComboBoxGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<void>;

    @ContentChild(ComboBoxItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<void>;

    @Input()
    public override value?: string;

    @Output()
    public override valueChange: EventEmitter<string> = new EventEmitter<string>();

    public constructor(
        protected override readonly elementRef: ElementRef<HTMLElement>,
        protected override readonly popupListService: PopupListService,
        protected override readonly popupService: PopupService
    ) {
        super(elementRef, popupListService, popupService);
    }

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.value = "";
        this.autoCompleteValue = "";
        this.valueChange.emit(this.value);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.setEventListeners();
        this.setSubscriptions();
        this.autoCompleteValue = this.value ?? "";
    }

    public onKeydown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            const item = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(i => i.selected || i.highlighted);
            if (item) {
                this.value = item.text;
                this.valuePopupListItem = item;
                this.autoCompleteValue = this.valuePopupListItem?.text ?? "";
                this.valueChange.emit(this.value);
            } else {
                this.value = this.autoCompleteValue;
                this.valuePopupListItem = undefined;
                this.valueChange.emit(this.value);
            }
            this.close();
        } else if (event.key === "Escape") {
            this.close();
        }
    }

    public onPopupListValueChange(event: PopupListValueChangeEvent): void {
        if (event?.via === "navigation") {
            return;
        }
        if (!event.value || event.value.length === 0) {
            this.value = "";
            this.valuePopupListItem = undefined;
            this.autoCompleteValue = "";
            this.valueChange.emit(this.value);
            return;
        }
        if (this.value && event.value[0].dataEquals(this.value)) {
            if (event.via === "selection") {
                this.close();
            }
            return;
        }
        if (event.via === "selection") {
            this.value = event.value[0].text;
            this.valuePopupListItem = event.value[0];
            this.autoCompleteValue = this.valuePopupListItem?.text ?? "";
            this.valueChange.emit(this.value);
            this.close();
        }
    }

    public override open(options: Partial<PopupSettings> = {}): PopupRef {
        this.popupRef = super.open(options);
        window.setTimeout(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
                input.setSelectionRange(-1, -1);
            }
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
            }
        });
        return this.popupRef;
    }

    private setEventListeners(): void {
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusin")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(() => {
                const input = this.elementRef.nativeElement.querySelector("input");
                if (input) {
                    input.focus();
                    input.setSelectionRange(-1, -1);
                }
            });
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(event => {
                const target = event.relatedTarget as HTMLElement;
                if (
                    !(
                        target &&
                        (this.elementRef.nativeElement.contains(target) ||
                            this.popupRef?.overlayRef.overlayElement.contains(target))
                    )
                ) {
                    this.value = this.autoCompleteValue;
                    this.valuePopupListItem = undefined;
                    this.valueChange.emit(this.value);
                }
            });
    }

    private setSubscriptions(): void {
        this.autoCompleteValue$
            .pipe(takeUntil(this.componentDestroy$), debounceTime(50), distinctUntilChanged())
            .subscribe((value: string) => {
                if (value) {
                    if (this.filterable) {
                        this.popupListService.viewListData = this.popupListService.sourceListData
                            .select(g => {
                                const filteredItems = g.source.where(i =>
                                    i.text.toLowerCase().startsWith(value.toLowerCase())
                                );
                                return new Group<string, PopupListItem>(g.key, filteredItems.toList());
                            })
                            .toList();
                        this.popupListService.filterModeActive = true;
                    }
                    this.popupListService.viewListData
                        .selectMany(g => g.source)
                        .forEach(i => (i.selected = i.highlighted = false));
                    const popupListItem = this.popupListService.viewListData
                        .selectMany(g => g.source)
                        .firstOrDefault(
                            item => !item.disabled && item.text.toLowerCase().startsWith(value.toLowerCase())
                        );
                    if (popupListItem) {
                        popupListItem.highlighted = true;
                        this.popupListService.scrollToListItem$.next(popupListItem);
                    }
                    if (!this.popupRef) {
                        this.open();
                    }
                    this.autoCompleteValue = value;
                } else {
                    this.close();
                    this.autoCompleteValue = value;
                }
            });
    }
}
