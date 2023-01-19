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
    }

    public onCalendarValueChange(date: Date): void {
        this.setCurrentDate(date);
        this.popupRef?.close();
    }

    public onDateInputBlur(): void {
        const date1 = DateTime.fromFormat(this.currentDateString, this.format);
        if (date1.isValid) {
            this.setCurrentDate(date1.toJSDate());
            this.navigatedDate = date1.toJSDate();
            this.currentDateString = date1.toFormat(this.format);
        } else {
            if (this.value) {
                this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
            }
        }
        this.cdr.detectChanges();
    }

    public onDateInputButtonClick(): void {
        if (!this.datePopupTemplateRef) {
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
        if (!this.timePopupTemplateRef) {
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

    private setCurrentDate(date: Date, emit: boolean = true): void {
        this.value = date;
        this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        if (emit) {
            this.valueChange.emit(this.value);
        }
        this.cdr.markForCheck();
    }
}
