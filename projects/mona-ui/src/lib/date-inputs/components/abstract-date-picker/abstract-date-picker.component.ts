import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    OnInit,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { AbstractDateInputComponent } from "../abstract-date-input/abstract-date-input.component";
import { faCalendar, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { take } from "rxjs";
import { FocusMonitor } from "@angular/cdk/a11y";
import { PopupService } from "../../../popup/services/popup.service";
import { DateTime } from "luxon";
import { ConnectionPositionPair } from "@angular/cdk/overlay";

@Component({
    selector: "mona-abstract-date-picker",
    standalone: true,
    imports: [CommonModule],
    template: "",
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class AbstractDatePickerComponent extends AbstractDateInputComponent implements OnInit {
    public readonly dateIcon: IconDefinition = faCalendar;

    @HostBinding("class.mona-dropdown")
    public readonly hostClass: boolean = true;

    @ViewChild("datePopupTemplate")
    public datePopupTemplateRef?: TemplateRef<any>;

    protected constructor(
        protected override readonly cdr: ChangeDetectorRef,
        protected readonly elementRef: ElementRef,
        protected readonly focusMonitor: FocusMonitor,
        protected readonly popupService: PopupService
    ) {
        super(cdr);
    }

    public onCalendarValueChange(date: Date | null): void {
        this.setCurrentDate(date);
        this.popupRef?.close();
    }

    public onDateInputBlur(): void {
        if (this.popupRef) {
            return;
        }
        if (!this.currentDateString && this.value) {
            this.setCurrentDate(null);
            return;
        }

        const dateTime = DateTime.fromFormat(this.currentDateString, this.format);
        if (this.dateStringEquals(this.value, dateTime.toJSDate())) {
            return;
        }
        if (dateTime.isValid) {
            if (this.value && DateTime.fromJSDate(this.value).equals(dateTime)) {
                return;
            }
            if (this.min && dateTime.startOf("day") < DateTime.fromJSDate(this.min).startOf("day")) {
                this.setCurrentDate(this.min);
                return;
            }
            if (this.max && dateTime.startOf("day") > DateTime.fromJSDate(this.max).startOf("day")) {
                this.setCurrentDate(this.max);
                return;
            }
            this.setCurrentDate(dateTime.toJSDate());
        } else {
            if (this.value) {
                this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
            } else {
                this.currentDateString = "";
            }
        }
        this.cdr.detectChanges();
    }

    public onDateInputButtonClick(): void {
        if (!this.datePopupTemplateRef || this.readonly) {
            return;
        }

        const input = this.elementRef.nativeElement.querySelector("input") as HTMLElement;
        this.popupRef = this.popupService.create({
            anchor: this.popupAnchor,
            content: this.datePopupTemplateRef,
            width: this.elementRef.nativeElement.offsetWidth,
            minWidth: 200,
            popupClass: "mona-date-input-popup",
            hasBackdrop: false,
            withPush: false,
            closeOnOutsideClick: true,
            positions: [
                new ConnectionPositionPair(
                    { originX: "start", originY: "bottom" },
                    { overlayX: "start", overlayY: "top" },
                    -1,
                    0,
                    "mona-dropdown-popup-content-bottom"
                ),
                new ConnectionPositionPair(
                    { originX: "start", originY: "top" },
                    { overlayX: "start", overlayY: "bottom" },
                    -1,
                    -1,
                    "mona-dropdown-popup-content-top"
                )
            ]
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.focusMonitor.focusVia(input, "program");
        });
    }

    public onDateStringEdit(dateString: string): void {
        this.currentDateString = dateString;
    }
}
