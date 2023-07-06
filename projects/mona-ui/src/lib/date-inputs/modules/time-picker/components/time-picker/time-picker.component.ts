import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    HostBinding,
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
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: "mona-time-picker",
    templateUrl: "./time-picker.component.html",
    styleUrls: ["./time-picker.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TimePickerComponent),
            multi: true
        }
    ]
})
export class TimePickerComponent extends AbstractDateInputComponent implements OnInit, OnChanges {
    public readonly timeIcon: IconDefinition = faClock;

    @HostBinding("class.mona-dropdown")
    public readonly hostClass: boolean = true;

    @Input()
    public hourFormat: "12" | "24" = "24";

    @Input()
    public showSeconds: boolean = false;

    @ViewChild("timePopupTemplate")
    public timePopupTemplateRef?: TemplateRef<any>;

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
        const dateTime = DateTime.fromFormat(this.currentDateString, this.format);
        if (this.dateStringEquals(dateTime.toJSDate(), this.value)) {
            return;
        }
        if (dateTime.isValid) {
            this.setCurrentDate(dateTime.toJSDate());
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
