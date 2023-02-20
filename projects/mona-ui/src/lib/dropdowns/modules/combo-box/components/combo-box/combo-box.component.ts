import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef
} from "@angular/core";
import { AbstractDropDownListComponent } from "../../../../components/abstract-drop-down-list/abstract-drop-down-list.component";
import { PopupListService } from "../../../../services/popup-list.service";
import { PopupService } from "../../../../../popup/services/popup.service";
import { PopupListItem } from "../../../../data/PopupListItem";
import { SelectionMode } from "../../../../../models/SelectionMode";
import { PopupListValueChangeEvent } from "../../../../data/PopupListValueChangeEvent";
import { PopupSettings } from "../../../../../popup/models/PopupSettings";
import { distinctUntilChanged, fromEvent, map, Observable, of, Subject, take, takeUntil } from "rxjs";
import { Group } from "@mirei/ts-collections";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { Action } from "../../../../../utils/Action";
import { ComboBoxGroupTemplateDirective } from "../../directives/combo-box-group-template.directive";
import { ComboBoxItemTemplateDirective } from "../../directives/combo-box-item-template.directive";

@Component({
    selector: "mona-combo-box",
    templateUrl: "./combo-box.component.html",
    styleUrls: ["./combo-box.component.scss"],
    providers: [PopupListService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComboBoxComponent extends AbstractDropDownListComponent implements OnInit {
    protected selectionMode: SelectionMode = "single";
    public readonly comboBoxValue$: Subject<string> = new Subject<string>();
    public comboBoxValue: string = "";
    public override valuePopupListItem?: PopupListItem;

    @Input()
    public allowCustomValue: boolean = true;

    @Input()
    public filterable: boolean = false;

    @ContentChild(ComboBoxGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<void>;

    @ContentChild(ComboBoxItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<void>;

    @Input()
    public override value?: any;

    @Output()
    public override valueChange: EventEmitter<any | any[]> = new EventEmitter<any>();

    @Input()
    public valueNormalizer: Action<Observable<string>, Observable<any>> = (text$: Observable<string>) =>
        text$.pipe(map(value => value));

    public constructor(
        protected override readonly elementRef: ElementRef<HTMLElement>,
        protected override readonly popupListService: PopupListService,
        protected override readonly popupService: PopupService
    ) {
        super(elementRef, popupListService, popupService);
    }

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.comboBoxValue = "";
        this.updateValue(undefined);
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes["data"] && !changes["data"].isFirstChange()) {
            this.comboBoxValue = this.valuePopupListItem?.text ?? "";
        }
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.setEventListeners();
        this.setSubscriptions();
        this.comboBoxValue = this.valuePopupListItem?.text ?? "";
    }

    public onKeydown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            const item = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(i => i.text.toLowerCase() === this.comboBoxValue.toLowerCase());
            if (item) {
                this.popupListService.selectItem(item, this.selectionMode);
                this.updateValue(item);
            } else {
                if (this.allowCustomValue) {
                    this.valueNormalizer(of(this.comboBoxValue)).subscribe(normalizedValue => {
                        this.data = [...this.data, normalizedValue];
                        this.popupListService.initializeListData({
                            data: [...this.data],
                            valueField: this.valueField,
                            disabler: this.itemDisabler,
                            textField: this.textField,
                            groupField: this.groupField
                        });
                        const item = this.popupListService.viewListData
                            .selectMany(g => g.source)
                            .firstOrDefault(i => i.text.toLowerCase() === this.comboBoxValue.toLowerCase());
                        if (item) {
                            this.popupListService.selectItem(item, this.selectionMode);
                            this.updateValue(item);
                        }
                    });
                } else {
                    this.comboBoxValue = "";
                }
            }
        } else if (event.key === "Escape") {
            this.close();
        }
    }

    public onPopupListValueChange(event: PopupListValueChangeEvent): void {
        if (!event.value || event.value.length === 0) {
            this.comboBoxValue = "";
            this.updateValue(undefined);
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
        this.updateValue(event.value[0]);
    }

    public override open(options: Partial<PopupSettings> = {}): PopupRef {
        this.popupRef = super.open({
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
        this.popupRef?.closed.pipe(take(1)).subscribe(() => {
            const item = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(i => i.text.toLowerCase() === this.comboBoxValue.toLowerCase());
            if (!item) {
                this.comboBoxValue = "";
            }
        });
        return this.popupRef;
    }

    protected override updateValue(listItem?: PopupListItem) {
        super.updateValue(listItem);
        this.comboBoxValue = listItem?.text ?? "";
    }

    private setEventListeners(): void {
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(event => {
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
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusin")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(() => {
                const input = this.elementRef.nativeElement.querySelector("input");
                if (input) {
                    input.focus();
                    input.setSelectionRange(-1, -1);
                }
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
            this.comboBoxValue = value;
        });
    }
}
