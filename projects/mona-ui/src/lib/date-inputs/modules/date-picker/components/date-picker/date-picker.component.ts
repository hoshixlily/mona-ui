import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { PopupService } from "../../../../../popup/services/popup.service";
import { DateTime } from "luxon";
import { faCalendar, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { AbstractDateInputComponent } from "../../../../components/abstract-date-input/abstract-date-input.component";

@Component({
    selector: "mona-date-picker",
    templateUrl: "./date-picker.component.html",
    styleUrls: ["./date-picker.component.scss"]
})
export class DatePickerComponent extends AbstractDateInputComponent implements OnInit {
    public readonly dateIcon: IconDefinition = faCalendar;
    public readonly wrongDateIcon: IconDefinition = faTimes;
    public currentDateInvalid: boolean = false;
    public currentDateString: string = "";

    @ViewChild("datePopupTemplate")
    public datePopupTemplateRef?: TemplateRef<void>;

    @Input()
    public format: string = "d/M/yyyy";

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
        if (this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        }
    }

    public onCalendarValueChange(date: Date): void {
        this.setCurrentDate(date);
        this.popupRef?.close();
    }

    public onDateInputBlur(): void {
        const date1 = DateTime.fromFormat(this.currentDateString, this.format);
        if (date1.isValid) {
            this.setCurrentDate(date1.toJSDate());
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

    private setCurrentDate(date: Date): void {
        this.value = date;
        this.currentDateString = DateTime.fromJSDate(date).toFormat(this.format);
        this.valueChange.emit(date);
    }
}
