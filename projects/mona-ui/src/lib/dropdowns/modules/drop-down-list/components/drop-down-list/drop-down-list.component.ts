import { Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef } from "@angular/core";
import { AbstractDropDownListComponent } from "../../../../components/abstract-drop-down-list/abstract-drop-down-list.component";
import { PopupService } from "../../../../../popup/services/popup.service";
import { PopupListService } from "../../../../services/popup-list.service";
import { SelectionMode } from "../../../../../models/SelectionMode";
import { PopupListValueChangeEvent } from "../../../../data/PopupListValueChangeEvent";
import { DropDownListItemTemplateDirective } from "../../directives/drop-down-list-item-template.directive";
import { DropDownListValueTemplateDirective } from "../../directives/drop-down-list-value-template.directive";
import { PopupListItem } from "../../../../data/PopupListItem";
import { DropDownListGroupTemplateDirective } from "../../directives/drop-down-list-group-template.directive";

@Component({
    selector: "mona-drop-down-list",
    templateUrl: "./drop-down-list.component.html",
    styleUrls: ["./drop-down-list.component.scss"],
    providers: [PopupListService]
})
export class DropDownListComponent extends AbstractDropDownListComponent implements OnInit {
    protected override openOnEnter: boolean = true;
    protected selectionMode: SelectionMode = "single";
    public override valuePopupListItem?: PopupListItem;

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

    @ContentChild(DropDownListValueTemplateDirective, { read: TemplateRef })
    public valueTemplate?: TemplateRef<void>;

    public constructor(
        protected override readonly elementRef: ElementRef<HTMLElement>,
        protected override readonly popupListService: PopupListService,
        protected override readonly popupService: PopupService
    ) {
        super(elementRef, popupListService, popupService);
    }

    public clearValue(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.updateValue(undefined);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
    }

    public onPopupListValueChange(event: PopupListValueChangeEvent): void {
        if (!event.value || event.value.length === 0) {
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
}
