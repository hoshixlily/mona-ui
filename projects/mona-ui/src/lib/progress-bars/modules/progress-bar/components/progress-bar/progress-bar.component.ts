import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit
} from "@angular/core";
import { asapScheduler } from "rxjs";
import { LabelPosition } from "../../models/LabelPosition";
import { Action } from "../../../../../utils/Action";
import { NgClass, NgStyle, NgIf, DecimalPipe } from "@angular/common";

@Component({
    selector: "mona-progress-bar",
    templateUrl: "./progress-bar.component.html",
    styleUrls: ["./progress-bar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass, NgStyle, NgIf, DecimalPipe]
})
export class ProgressBarComponent implements OnInit, AfterViewInit {
    public progress: number = 0;
    public rightClip: number = -1;

    @Input()
    public color: string | Action<number, string> = "var(--mona-primary)";

    @Input()
    public disabled: boolean = false;

    @Input()
    public indeterminate: boolean = false;

    @Input()
    public labelFormat?: Action<number, string>;

    @Input()
    public labelPosition: LabelPosition = "center";

    @Input()
    public labelStyles: Partial<CSSStyleDeclaration> = {};

    @Input()
    public labelVisible: boolean = true;

    @Input()
    public max: number = 100;

    @Input()
    public min: number = 0;

    @Input()
    public set value(value: number) {
        this.updateProgress(value);
    }
    public constructor(private readonly elementRef: ElementRef<HTMLElement>, private readonly cdr: ChangeDetectorRef) {}

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.updateProgress(this.progress);
        });
    }

    public ngOnInit(): void {}

    private updateProgress(value: number): void {
        const oldProgress = this.progress;
        this.progress = ((value - this.min) / (this.max - this.min)) * 100;
        this.updateProgressStyle(oldProgress, this.progress);
    }

    private updateProgressStyle(oldProgress: number, newProgress: number): void {
        if (oldProgress !== 100 && newProgress === 100) {
            asapScheduler.schedule(() => {
                this.rightClip = 1;
                this.cdr.detectChanges();
            }, 350);
        } else {
            this.rightClip = -1;
            this.cdr.detectChanges();
            asapScheduler.schedule(() => {
                this.cdr.detectChanges();
            });
        }
    }

    public get label(): string {
        return this.labelFormat?.(this.progress) ?? `${this.progress}%`;
    }

    public get progressColor(): string {
        return typeof this.color === "function" ? this.color(this.progress) : this.color;
    }
}
