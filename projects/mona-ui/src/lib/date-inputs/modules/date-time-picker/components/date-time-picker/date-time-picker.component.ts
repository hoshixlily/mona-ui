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
import { faCalendar, faClock, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { PopupService } from "../../../../../popup/services/popup.service";
import { DateTime } from "luxon";
import { AbstractDateInputComponent } from "../../../../components/abstract-date-input/abstract-date-input.component";

@Component({
    selector: "mona-date-time-picker",
    templateUrl: "./date-time-picker.component.html",
    styleUrls: ["./date-time-picker.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimePickerComponent extends AbstractDateInputComponent implements OnInit, OnDestroy {
    public readonly dateIcon: IconDefinition = faCalendar;
    public readonly timeIcon: IconDefinition = faClock;
    public readonly wrongDateIcon: IconDefinition = faTimes;
    public currentDateInvalid: boolean = false;
    public currentDateString: string = "";
    public navigatedDate: Date = new Date();

    @ViewChild("datePopupTemplate")
    public datePopupTemplateRef?: TemplateRef<void>;

    @Input()
    public format: string = "d/M/yyyy";

    @Input()
    public hourFormat: "12" | "24" = "24";

    @ViewChild("timePopupTemplate")
    public timePopupTemplateRef?: TemplateRef<void>;

    public constructor(
        protected override readonly cdr: ChangeDetectorRef,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupService: PopupService
    ) {
        super(cdr);
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.navigatedDate = this.value ?? DateTime.now().toJSDate();
        if (this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        }
    }

    public onCalendarValueChange(date: Date | null): void {
        this.setCurrentDate(date);
        this.popupRef?.close();
        this.popupRef = null;
    }

    public onDateInputBlur(): void {
        if (!this.popupRef) {
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

    public onDateInputButtonClick(): void {
        if (!this.datePopupTemplateRef || this.readonly) {
            return;
        }

        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: this.datePopupTemplateRef,
            width: this.elementRef.nativeElement.clientWidth,
            popupClass: "mona-date-time-picker-popup",
            hasBackdrop: false,
            closeOnOutsideClick: true
        });
    }

    public onDateStringEdit(dateString: string): void {
        this.currentDateString = dateString;
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

    private setCurrentDate(date: Date | null, emit: boolean = true): void {
        this.value = date;
        if (this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        } else {
            this.currentDateString = "";
        }
        if (emit) {
            this.valueChange.emit(this.value);
        }
        this.cdr.markForCheck();
    }
}
