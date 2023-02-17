import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { PopupRef } from "../../../popup/models/PopupRef";
import { DateTime } from "luxon";

@Component({
    standalone: true,
    imports: [CommonModule],
    template: "",
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class AbstractDateInputComponent implements OnInit, OnDestroy, OnChanges {
    protected readonly componentDestroy$: Subject<void> = new Subject<void>();
    protected popupRef: PopupRef | null = null;
    public currentDateString: string = "";

    public navigatedDate: Date = new Date();

    @Input()
    public disabled: boolean = false;

    @Input()
    public disabledDates: Iterable<Date> = [];

    @Input()
    public format: string = "HH:mm";

    @Input()
    public max: Date | null = null;

    @Input()
    public min: Date | null = null;

    @ViewChild("popupAnchor")
    public popupAnchor!: ElementRef<HTMLDivElement>;

    @Input()
    public readonly: boolean = false;

    @Input()
    public value: Date | null = null;

    @Output()
    public valueChange: EventEmitter<Date | null> = new EventEmitter<Date | null>();

    protected constructor(protected readonly cdr: ChangeDetectorRef) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["hourFormat"] && this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        }
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        this.navigatedDate = this.value ?? DateTime.now().toJSDate();
        if (this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        }
    }
}