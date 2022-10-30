import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AbstractDropDownListComponent } from "../../../../components/abstract-drop-down-list/abstract-drop-down-list.component";
import { PopupService } from "../../../../../popup/services/popup.service";
import { PopupSettings } from "../../../../../popup/models/PopupSettings";
import { PopupListService } from "../../../../services/popup-list.service";
import { SelectionMode } from "../../../../../models/SelectionMode";
import { PopupListValueChangeEvent } from "../../../../data/PopupListValueChangeEvent";

@Component({
    selector: "mona-drop-down-list",
    templateUrl: "./drop-down-list.component.html",
    styleUrls: ["./drop-down-list.component.scss"],
    providers: [PopupListService]
})
export class DropDownListComponent extends AbstractDropDownListComponent implements OnInit {
    protected selectionMode: SelectionMode = "single";

    @Input()
    public override value?: any;

    @Output()
    public override valueChange: EventEmitter<any | any[]> = new EventEmitter<any>();

    public constructor(
        protected override readonly cdr: ChangeDetectorRef,
        protected override readonly elementRef: ElementRef<HTMLElement>,
        protected override readonly popupListService: PopupListService,
        protected override readonly popupService: PopupService
    ) {
        super(cdr, elementRef, popupListService, popupService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
    }

    public onPopupListValueChange(event: PopupListValueChangeEvent): void {
        if (event.value[0].dataEquals(this.value)) {
            return;
        }
        this.value = event.value[0].data;
        if (event.via === "selection") {
            this.close();
        }
        this.valueChange.emit(this.value);
    }

    public override open(options: Partial<PopupSettings> = {}): void {
        super.open(options);
    }
}
