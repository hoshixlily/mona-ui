import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
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

@Component({
    selector: "mona-multi-select",
    templateUrl: "./multi-select.component.html",
    styleUrls: ["./multi-select.component.scss"],
    providers: [PopupListService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectComponent extends AbstractDropDownListComponent implements OnInit {
    protected selectionMode: SelectionMode = "multiple";
    public summaryTagTemplate: TemplateRef<any> | null = null;
    public tagCount: number = -1;
    public override valuePopupListItem: PopupListItem[] = [];

    @ContentChild(MultiSelectGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<void>;

    @ContentChild(MultiSelectItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<void>;

    @ContentChild(MultiSelectTagTemplateDirective, { read: TemplateRef })
    public tagTemplate: TemplateRef<any> | null = null;

    @Input()
    public override value: any[] = [];

    @Output()
    public override valueChange: EventEmitter<any[]> = new EventEmitter<any[]>();

    public constructor(
        protected override readonly elementRef: ElementRef<HTMLElement>,
        protected override readonly popupListService: PopupListService,
        protected override readonly popupService: PopupService
    ) {
        super(elementRef, popupListService, popupService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
    }

    public onPopupListValueChange(event: PopupListValueChangeEvent): void {
        if (this.value && this.containsValue(event.value, this.value)) {
            if (event.via === "selection") {
                this.close();
            }
            return;
        }
        if (event.via === "selection") {
            this.close();
        }
        this.updateValue(event.value);
    }

    public onSelectedItemRemove(event: Event, popupListItem: PopupListItem): void {
        event.stopImmediatePropagation();
        const remainingItems = this.valuePopupListItem.filter(item => !item.dataEquals(popupListItem.data)) ?? [];
        this.updateValue(remainingItems);
    }

    public onSelectedItemGroupRemove(event: Event): void {
        event.stopImmediatePropagation();
    }

    private containsValue(popupListItems: PopupListItem[], value: any): boolean {
        return popupListItems.some(popupListItem => popupListItem.dataEquals(value));
    }

    public get summaryTagText(): string {
        console.log(this.tagCount);
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
