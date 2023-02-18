import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit
} from "@angular/core";

@Component({
    selector: "mona-progress-bar",
    templateUrl: "./progress-bar.component.html",
    styleUrls: ["./progress-bar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent implements OnInit, AfterViewInit, OnChanges {
    public progress: number = 0;
    public progressWidth: number = 0;

    @Input()
    public set value(value: number) {
        this.progress = value;
        this.updateProgressWidth();
    }
    public constructor(private readonly elementRef: ElementRef<HTMLElement>, private readonly cdr: ChangeDetectorRef) {}

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.updateProgressWidth();
        });
    }

    public ngOnChanges(): void {
        // this.progressWidth = (this.elementRef.nativeElement.clientWidth * this.progress) / 100;
    }

    public ngOnInit(): void {}

    private updateProgressWidth(): void {
        this.progressWidth = (this.elementRef.nativeElement.clientWidth * this.progress) / 100;
        this.cdr.detectChanges();
    }
}
