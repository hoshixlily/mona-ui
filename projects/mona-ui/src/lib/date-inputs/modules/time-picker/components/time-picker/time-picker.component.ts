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
import { IndexableList } from "@mirei/ts-collections";
import { TimePickerDropdownListDateItem } from "../../models/TimePickerDropdownListDateItem";
import { DateTime } from "luxon";

@Component({
    selector: "mona-time-picker",
    templateUrl: "./time-picker.component.html",
    styleUrls: ["./time-picker.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimePickerComponent extends AbstractDateInputComponent implements OnInit, OnChanges {
    public readonly timeIcon: IconDefinition = faClock;

    public currentDateString: string = "";

    public timeList: IndexableList<TimePickerDropdownListDateItem> =
        new IndexableList<TimePickerDropdownListDateItem>();

    @Input()
    public format: string = "HH:mm";

    @Input()
    public hourFormat: "12" | "24" = "24";

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

    public ngOnChanges(changes: SimpleChanges): void {
        const format = changes["format"];
        const hourFormat = changes["hourFormat"];
        if ((format && !format.firstChange) || (hourFormat && !hourFormat.firstChange)) {
            this.generateTimeList();
        }
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.generateTimeList();
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
            width: (this.elementRef.nativeElement.querySelector(".mona-dropdown") as HTMLElement).clientWidth,
            popupClass: "mona-date-time-picker-popup",
            hasBackdrop: false,
            closeOnOutsideClick: true
        });
    }

    // every half hour
    private generateTimeList(): void {
        if (this.timeList.isEmpty()) {
            for (let i = 0; i < 48; i++) {
                const date = new Date();
                date.setHours(Math.floor(i / 2));
                date.setMinutes((i % 2) * 30);
                this.timeList.add({
                    date,
                    text: DateTime.fromJSDate(date).toFormat(this.format),
                    disabled: false
                });
            }
        } else {
            this.timeList.forEach(item => {
                item.text = DateTime.fromJSDate(item.date).toFormat(this.format);
            });
        }
        this.timeList = this.timeList.toIndexableList();
    }
}
