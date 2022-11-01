import { Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef } from "@angular/core";
import { AbstractDropDownListComponent } from "../../../../components/abstract-drop-down-list/abstract-drop-down-list.component";
import { PopupListService } from "../../../../services/popup-list.service";
import { PopupService } from "../../../../../popup/services/popup.service";
import { PopupListItem } from "../../../../data/PopupListItem";
import { SelectionMode } from "../../../../../models/SelectionMode";
import { DropDownListGroupTemplateDirective } from "../../../drop-down-list/directives/drop-down-list-group-template.directive";
import { DropDownListItemTemplateDirective } from "../../../drop-down-list/directives/drop-down-list-item-template.directive";
import { PopupListValueChangeEvent } from "../../../../data/PopupListValueChangeEvent";
import { PopupSettings } from "../../../../../popup/models/PopupSettings";
import { distinctUntilChanged, fromEvent, Subject, takeUntil } from "rxjs";
import { Group } from "@mirei/ts-collections";

@Component({
    selector: "mona-combo-box",
    templateUrl: "./combo-box.component.html",
    styleUrls: ["./combo-box.component.scss"],
    providers: [PopupListService]
})
export class ComboBoxComponent extends AbstractDropDownListComponent implements OnInit {
    protected selectionMode: SelectionMode = "single";
    public readonly comboBoxValue$: Subject<string> = new Subject<string>();
    public override valuePopupListItem?: PopupListItem;
    public comboBoxValue: string = "";

    @Input()
    public filterable: boolean = false;

    @ContentChild(DropDownListGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<void>;

    @ContentChild(DropDownListItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<void>;

    @Input()
    public override value?: any;

    @Output()
    public override valueChange: EventEmitter<any | any[]> = new EventEmitter<any>();

    public constructor(
        protected override readonly elementRef: ElementRef<HTMLElement>,
        protected override readonly popupListService: PopupListService,
        protected override readonly popupService: PopupService
    ) {
        super(elementRef, popupListService, popupService);
    }

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.value = undefined;
        this.valuePopupListItem = undefined;
        this.comboBoxValue = "";
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.setEventListeners();
        this.setSubscriptions();
        this.comboBoxValue = this.valuePopupListItem?.text ?? "";
    }

    public onPopupListValueChange(event: PopupListValueChangeEvent): void {
        if (this.value && event.value[0].dataEquals(this.value)) {
            if (event.via === "selection") {
                this.close();
            }
            return;
        }
        if (event.via === "selection") {
            this.close();
        }
        this.updateValue(event.value[0]);
    }

    public override open(options: Partial<PopupSettings> = {}): void {
        if (this.popupRef) {
            return;
        }
        super.open({
            ...options,
            hasBackdrop: false,
            closeOnOutsideClick: false
        });
        window.setTimeout(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
                input.setSelectionRange(-1, -1);
            }
        });
    }

    protected override updateValue(listItem: PopupListItem) {
        super.updateValue(listItem);
        this.comboBoxValue = listItem.text;
    }

    private setEventListeners(): void {
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusout").subscribe(event => {
            const target = event.relatedTarget as HTMLElement;
            if (
                target &&
                (this.elementRef.nativeElement.contains(target) ||
                    this.popupRef?.overlayRef.overlayElement.contains(target))
            ) {
                return;
            }
            this.close();
        });
    }

    private setSubscriptions(): void {
        this.comboBoxValue$.pipe(takeUntil(this.componentDestroy$), distinctUntilChanged()).subscribe(value => {
            if (this.filterable) {
                if (!value) {
                    this.popupListService.viewListData = this.popupListService.sourceListData.toList();
                    this.popupListService.filterModeActive = false;
                } else {
                    this.popupListService.viewListData = this.popupListService.sourceListData
                        .select(g => {
                            const filteredItems = g.source.where(i =>
                                i.text.toLowerCase().includes(value.toLowerCase())
                            );
                            return new Group<string, PopupListItem>(g.key, filteredItems.toList());
                        })
                        .toList();
                    this.popupListService.filterModeActive = true;
                }
            }
            this.popupListService.viewListData
                .selectMany(g => g.source)
                .forEach(i => (i.selected = i.highlighted = false));
            const popupListItem = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(item => !item.disabled && item.text.toLowerCase().includes(value.toLowerCase()));
            if (!this.popupRef) {
                this.open();
            }
            if (popupListItem) {
                popupListItem.highlighted = true;
                this.popupListService.scrollToListItem$.next(popupListItem);
            }
        });
    }
}
