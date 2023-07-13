import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef
} from "@angular/core";
import { AbstractDropDownListComponent } from "../../../../components/abstract-drop-down-list/abstract-drop-down-list.component";
import { PopupListService } from "../../../../services/popup-list.service";
import { PopupService } from "../../../../../popup/services/popup.service";
import { SelectionMode } from "../../../../../models/SelectionMode";
import { PopupListItem } from "../../../../data/PopupListItem";
import { PopupListValueChangeEvent } from "../../../../data/PopupListValueChangeEvent";
import { MultiSelectTagTemplateDirective } from "../../directives/multi-select-tag-template.directive";
import { MultiSelectItemTemplateDirective } from "../../directives/multi-select-item-template.directive";
import { MultiSelectGroupTemplateDirective } from "../../directives/multi-select-group-template.directive";
import { PopupSettings } from "../../../../../popup/models/PopupSettings";
import { PopupRef } from "../../../../../popup/models/PopupRef";

@Component({
    selector: "mona-multi-select",
    templateUrl: "./multi-select.component.html",
    styleUrls: ["./multi-select.component.scss"],
    providers: [PopupListService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectComponent extends AbstractDropDownListComponent implements OnInit, OnDestroy {
    private resizeObserver: ResizeObserver | null = null;
    protected selectionMode: SelectionMode = "multiple";
    public popupListValues: any[] = [];
    public summaryTagTemplate: TemplateRef<any> | null = null;
    public tagCount: number = -1;
    public override valuePopupListItem: PopupListItem[] = [];

    @Input()
    public filterable: boolean = false;

    @ContentChild(MultiSelectGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<any>;

    @ContentChild(MultiSelectItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<any>;

    @ContentChild(MultiSelectTagTemplateDirective, { read: TemplateRef })
    public tagTemplate: TemplateRef<any> | null = null;

    @Input()
    public override value: any[] = [];

    @Output()
    public override valueChange: EventEmitter<any[]> = new EventEmitter<any[]>();

    public constructor(
        protected override readonly elementRef: ElementRef<HTMLElement>,
        protected override readonly popupListService: PopupListService,
        protected override readonly popupService: PopupService,
        private readonly cdr: ChangeDetectorRef
    ) {
        super(elementRef, popupListService, popupService);
    }

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.updateValue(undefined);
    }

    public override ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (changes["value"]) {
            this.popupListValues = this.value;
            this.valuePopupListItem = this.popupListService.viewListData
                .selectMany(g => g.source)
                .where(d => (this.value as any[]).some(v => d.dataEquals(v)))
                .toArray();
        }
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        this.resizeObserver?.disconnect();
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.setEventListeners();
    }

    public onPopupListValueChange(event: PopupListValueChangeEvent): void {
        if (this.value && this.containsValue(event.value, this.value)) {
            if (event.via === "selection") {
                this.close();
            }
            return;
        }
        if (event.via === "selection" && this.selectionMode === "single") {
            this.close();
        }
        this.updateValue(event.value);
        this.popupListValues = event.value;
    }

    public onSelectedItemRemove(event: Event, popupListItem: PopupListItem): void {
        event.stopImmediatePropagation();
        const remainingItems = this.valuePopupListItem.filter(item => !item.dataEquals(popupListItem.data)) ?? [];
        this.updateValue(remainingItems);
    }

    public onSelectedItemGroupRemove(event: Event): void {
        event.stopImmediatePropagation();
        const remainingItems = this.valuePopupListItem.slice(0, this.visibleTagCount);
        this.updateValue(remainingItems);
    }

    private containsValue(popupListItems: PopupListItem[], value: any): boolean {
        return popupListItems.some(popupListItem => popupListItem.dataEquals(value));
    }

    private setEventListeners(): void {
        this.resizeObserver = new ResizeObserver(() => {
            window.setTimeout(() => {
                this.popupRef?.overlayRef.updatePosition();
                this.popupRef?.overlayRef.updateSize({ width: this.elementRef.nativeElement.clientWidth });
            });
        });
        this.resizeObserver.observe(this.elementRef.nativeElement);
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

    public get visibleTagCount(): number {
        return this.tagCount < 0 ? this.valuePopupListItem.length : this.tagCount === 0 ? 0 : this.tagCount;
    }
}
