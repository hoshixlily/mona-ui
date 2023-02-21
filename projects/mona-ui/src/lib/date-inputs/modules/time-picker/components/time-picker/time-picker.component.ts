import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { AbstractDateInputComponent } from "../../../../components/abstract-date-input/abstract-date-input.component";
import { faClock, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FocusMonitor } from "@angular/cdk/a11y";
import { PopupService } from "../../../../../popup/services/popup.service";
import { DateTime } from "luxon";
import { take } from "rxjs";

@Component({
    selector: "mona-time-picker",
    templateUrl: "./time-picker.component.html",
    styleUrls: ["./time-picker.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimePickerComponent extends AbstractDateInputComponent implements OnInit, OnChanges {
    public readonly timeIcon: IconDefinition = faClock;

    @Input()
    public hourFormat: "12" | "24" = "24";

    @Input()
    public showSeconds: boolean = false;

    @ViewChild("timePopupTemplate")
    public timePopupTemplateRef?: TemplateRef<void>;

    public constructor(
        protected override readonly cdr: ChangeDetectorRef,
        public readonly elementRef: ElementRef<HTMLElement>,
        private readonly focusMonitor: FocusMonitor,
        private readonly popupService: PopupService
    ) {
        super(cdr);
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
    }

    public onDateStringEdit(dateString: string): void {
        this.currentDateString = dateString;
    }

    public onTimeInputBlur(): void {
        if (this.popupRef) {
            return;
        }
        let date = DateTime.fromFormat(this.currentDateString, this.format);
        const currentDate = DateTime.fromJSDate(this.value ?? new Date());
        date = date.set({ day: currentDate.day, month: currentDate.month, year: currentDate.year });

        if (this.dateEquals(date.toJSDate(), this.value)) {
            return;
        }
        if (date.isValid) {
            this.setCurrentDate(date.toJSDate());
        } else {
            this.setCurrentDate(null);
        }
    }

    public onTimeInputButtonClick(): void {
        if (!this.timePopupTemplateRef || this.readonly) {
            return;
        }
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: this.timePopupTemplateRef,
            width: this.popupAnchor.nativeElement.clientWidth,
            popupClass: "mona-time-picker-popup",
            hasBackdrop: false,
            closeOnOutsideClick: true
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.focusMonitor.focusVia(this.elementRef.nativeElement.querySelector("input") as HTMLElement, "program");
        });
    }

    public onTimeSelectorValueChange(date: Date | null): void {
        this.setCurrentDate(date);
    }
}
