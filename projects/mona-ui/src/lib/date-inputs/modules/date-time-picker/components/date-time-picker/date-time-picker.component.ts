import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { faClock, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { PopupService } from "../../../../../popup/services/popup.service";
import { DateTime } from "luxon";
import { FocusMonitor } from "@angular/cdk/a11y";
import { AbstractDatePickerComponent } from "../../../../components/abstract-date-picker/abstract-date-picker.component";

@Component({
    selector: "mona-date-time-picker",
    templateUrl: "./date-time-picker.component.html",
    styleUrls: ["./date-time-picker.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimePickerComponent extends AbstractDatePickerComponent implements OnInit {
    public readonly timeIcon: IconDefinition = faClock;
    public currentDateInvalid: boolean = false;

    @Input()
    public hourFormat: "12" | "24" = "24";

    @ViewChild("timePopupTemplate")
    public timePopupTemplateRef?: TemplateRef<void>;

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
        this.navigatedDate = this.value ?? DateTime.now().toJSDate();
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

    public onTimeInputButtonClick(): void {
        if (!this.timePopupTemplateRef || this.readonly) {
            return;
        }
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: this.timePopupTemplateRef,
            width: this.elementRef.nativeElement.clientWidth,
            popupClass: "mona-date-time-picker-popup",
            hasBackdrop: false,
            closeOnOutsideClick: true
        });
    }

    public onTimeSelectorValueChange(date: Date): void {
        this.setCurrentDate(date);
    }
}
