import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AbstractDateInputComponent } from "../abstract-date-input/abstract-date-input.component";
import { faCalendar, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { take } from "rxjs";
import { FocusMonitor } from "@angular/cdk/a11y";
import { PopupService } from "../../../popup/services/popup.service";
import { DateTime } from "luxon";

@Component({
    selector: "mona-abstract-date-picker",
    standalone: true,
    imports: [CommonModule],
    template: "",
    styleUrls: []
})
export abstract class AbstractDatePickerComponent extends AbstractDateInputComponent implements OnInit {
    public readonly dateIcon: IconDefinition = faCalendar;

    @ViewChild("datePopupTemplate")
    public datePopupTemplateRef?: TemplateRef<void>;

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

    public onDateInputButtonClick(): void {
        if (!this.datePopupTemplateRef || this.readonly) {
            return;
        }

        this.popupRef = this.popupService.create({
            anchor: this.popupAnchor,
            content: this.datePopupTemplateRef,
            width: this.elementRef.nativeElement.clientWidth,
            popupClass: "mona-date-input-popup",
            hasBackdrop: false,
            withPush: false,
            closeOnOutsideClick: true
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.focusMonitor.focusVia(this.elementRef.nativeElement.querySelector("input") as HTMLElement, "program");
        });
    }

    public onDateStringEdit(dateString: string): void {
        this.currentDateString = dateString;
    }

    protected setCurrentDate(date: Date | null): void {
        this.value = date;
        if (this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        } else {
            this.currentDateString = "";
        }
        this.valueChange.emit(this.value);
    }
}
