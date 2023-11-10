import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    ElementRef,
    Input,
    OnInit,
    Signal,
    signal,
    WritableSignal
} from "@angular/core";
import { asapScheduler } from "rxjs";
import { LabelPosition } from "../../models/LabelPosition";
import { Action } from "../../../../utils/Action";
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
    readonly #color: WritableSignal<string> = signal("var(--mona-primary)");
    readonly #labelFormat: WritableSignal<Action<number, string>> = signal((progress: number) => `${progress}%`);
    public readonly formatted: WritableSignal<boolean> = signal(false);
    public label: Signal<string> = signal("");
    public progress: WritableSignal<number> = signal(0);
    public progressStyles: Signal<Partial<CSSStyleDeclaration>> = signal({});
    public rightClip: number = -1;

    @Input()
    public set color(color: string | Action<number, string>) {
        if (typeof color === "string") {
            this.#color.set(color);
        } else {
            this.#color.set(color(this.progress()));
        }
    }

    @Input()
    public disabled: boolean = false;

    @Input()
    public indeterminate: boolean = false;

    @Input()
    public set labelFormat(labelFormat: string | Action<number, string>) {
        if (typeof labelFormat === "string") {
            this.#labelFormat.set(() => labelFormat);
        } else {
            this.#labelFormat.set(labelFormat);
        }
        this.formatted.set(true);
    }

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
            this.updateProgress(this.progress());
        });
    }

    public ngOnInit(): void {
        this.setComputedSignals();
    }

    private setComputedSignals(): void {
        this.label = computed(() => {
            const progress = this.progress();
            const labelFormat = this.#labelFormat();
            return labelFormat(progress);
        });
        this.progressStyles = computed(() => {
            const progress = this.progress();
            const color = this.#color();
            const progressColor = progress === 0 ? "transparent" : color;
            return {
                borderTopRightRadius:
                    progress === 100 ? "var(--mona-border-radius)" : "calc(var(--mona-border-radius) * 2)",
                borderBottomRightRadius:
                    progress === 100 ? "var(--mona-border-radius)" : "calc(var(--mona-border-radius) * 2)",
                backgroundColor: progressColor
            } as Partial<CSSStyleDeclaration>;
        });
    }

    private updateProgress(value: number): void {
        const oldProgress = this.progress();
        this.progress.set(((value - this.min) / (this.max - this.min)) * 100);
        this.updateProgressStyle(oldProgress, this.progress());
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
}
