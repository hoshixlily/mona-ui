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
    public currentDateInvalid: boolean = false;

    public constructor(
        protected override readonly cdr: ChangeDetectorRef,
        protected override readonly elementRef: ElementRef<HTMLElement>,
        protected override readonly focusMonitor: FocusMonitor,
        protected override readonly popupService: PopupService
    ) {
        super(cdr, elementRef, focusMonitor, popupService);
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        if (this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        }
    }

    public onDateInputBlur(): void {
        if (this.popupRef) {
            return;
        }
        if (!this.currentDateString && this.value) {
            this.setCurrentDate(null);
            return;
        }
        const date1 = DateTime.fromFormat(this.currentDateString, this.format);
        if (date1.isValid) {
            if (this.value && DateTime.fromJSDate(this.value).equals(date1)) {
                return;
            }
            if (this.min && date1.startOf("day") < DateTime.fromJSDate(this.min).startOf("day")) {
                this.setCurrentDate(this.min);
                return;
            }
            if (this.max && date1.startOf("day") > DateTime.fromJSDate(this.max).startOf("day")) {
                this.setCurrentDate(this.max);
                return;
            }
            this.setCurrentDate(date1.toJSDate());
        } else {
            if (this.value) {
                this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
            } else {
                this.currentDateString = "";
            }
        }
        this.cdr.detectChanges();
    }
}
