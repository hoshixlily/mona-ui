import { DecimalPipe, NgClass, NgStyle } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    input,
    InputSignal,
    InputSignalWithTransform,
    Signal,
    signal,
    WritableSignal
} from "@angular/core";
import { Action } from "../../../../utils/Action";
import { LabelPosition } from "../../models/LabelPosition";

@Component({
    selector: "mona-progress-bar",
    templateUrl: "./progress-bar.component.html",
    styleUrls: ["./progress-bar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass, NgStyle, DecimalPipe],
    host: {
        class: "mona-progress-bar",
        "[class.mon-disabled]": "disabled()"
    }
})
export class ProgressBarComponent implements AfterViewInit {
    readonly #color: WritableSignal<string> = signal("var(--mona-primary)");
    protected readonly formatted: WritableSignal<boolean> = signal(false);
    protected readonly label: Signal<string> = computed(() => {
        const progress = this.progress();
        const labelFormat = this.labelFormat();
        return labelFormat(progress);
    });
    protected readonly progress: WritableSignal<number> = signal(0);
    protected readonly progressStyles: Signal<Partial<CSSStyleDeclaration>> = computed(() => {
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
    protected readonly rightClip: WritableSignal<number> = signal(-1);

    public color: InputSignal<string | Action<number, string>> = input<string | Action<number, string>>(
        "var(--mona-primary)"
    );
    public disabled: InputSignal<boolean> = input(false);
    public indeterminate: InputSignal<boolean> = input(false);
    public labelFormat: InputSignalWithTransform<Action<number, string>, Action<number, string> | string> = input(
        (progress: number) => `${progress}%`,
        {
            transform: (labelFormat: string | Action<number, string>) => {
                if (typeof labelFormat === "string") {
                    return () => labelFormat;
                }
                return labelFormat;
            }
        }
    );
    public labelPosition: InputSignal<LabelPosition> = input<LabelPosition>("center");
    public labelStyles: InputSignal<Partial<CSSStyleDeclaration>> = input<Partial<CSSStyleDeclaration>>({});
    public labelVisible: InputSignal<boolean> = input(true);
    public max: InputSignal<number> = input(100);
    public min: InputSignal<number> = input(0);
    public value: InputSignal<number> = input(0);

    public constructor() {
        effect(
            () => {
                const color = this.color();
                if (typeof color === "string") {
                    this.#color.set(color);
                } else {
                    this.#color.set(color(this.progress()));
                }
            },
            { allowSignalWrites: true }
        );
        effect(() => this.updateProgress(this.value()), { allowSignalWrites: true });
        effect(
            () => {
                this.labelFormat();
                this.formatted.set(true);
            },
            { allowSignalWrites: true }
        );
    }

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.updateProgress(this.progress());
        });
    }

    private updateProgress(value: number): void {
        const oldProgress = this.progress();
        this.progress.set(((value - this.min()) / (this.max() - this.min())) * 100);
        this.updateProgressStyle(oldProgress, this.progress());
    }

    private updateProgressStyle(oldProgress: number, newProgress: number): void {
        if (oldProgress !== 100 && newProgress === 100) {
            this.rightClip.set(1);
        } else {
            this.rightClip.set(-1);
        }
    }
}
