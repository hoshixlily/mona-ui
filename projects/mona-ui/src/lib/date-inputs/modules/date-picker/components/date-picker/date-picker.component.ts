import { ChangeDetectorRef, Component, ElementRef, OnInit } from "@angular/core";
import { PopupService } from "../../../../../popup/services/popup.service";
import { DateTime } from "luxon";
import { FocusMonitor } from "@angular/cdk/a11y";
import { AbstractDatePickerComponent } from "../../../../components/abstract-date-picker/abstract-date-picker.component";

@Component({
    selector: "mona-date-picker",
    templateUrl: "./date-picker.component.html",
    styleUrls: ["./date-picker.component.scss"]
})
export class DatePickerComponent extends AbstractDatePickerComponent implements OnInit {
    public constructor(
        protected override readonly cdr: ChangeDetectorRef,
        protected override readonly elementRef: ElementRef<HTMLElement>,
        protected override readonly focusMonitor: FocusMonitor,
        protected override readonly popupService: PopupService
    ) {
        super(cdr, elementRef, focusMonitor, popupService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        if (this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        }
    }
}
