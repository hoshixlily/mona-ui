import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
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

    @Input()
    public hourFormat: "12" | "24" = "24";

    @Input()
    public showSeconds: boolean = false;

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
    }

    public onTimeInputButtonClick(): void {
        if (!this.timePopupTemplateRef || this.readonly) {
            return;
        }
        this.popupRef = this.popupService.create({
            anchor: this.popupAnchor,
            content: this.timePopupTemplateRef,
            width: this.elementRef.nativeElement.clientWidth,
            popupClass: "mona-time-picker-popup",
            hasBackdrop: false,
            withPush: false,
            closeOnOutsideClick: true
        });
    }

    public onTimeSelectorValueChange(date: Date | null): void {
        this.setCurrentDate(date);
    }
}
