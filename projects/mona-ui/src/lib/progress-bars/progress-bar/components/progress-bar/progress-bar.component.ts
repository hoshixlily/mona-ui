import { DecimalPipe, NgClass, NgStyle } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    input,
    signal,
    untracked
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
    readonly #color = signal("var(--mona-primary)");
    protected readonly formatted = signal(false);
    protected readonly label = computed(() => {
        const progress = this.progress();
        const labelFormat = this.labelFormat();
        return labelFormat(progress);
    });
    protected readonly progress = signal(0);
    protected readonly progressStyles = computed(() => {
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
    protected readonly rightClip = signal(-1);

    public color = input<string | Action<number, string>>("var(--mona-primary)");
    public disabled = input(false);
    public indeterminate = input(false);
    public labelFormat = input((progress: number) => `${progress}%`, {
        transform: (labelFormat: string | Action<number, string>) => {
            if (typeof labelFormat === "string") {
                return () => labelFormat;
            }
            return labelFormat;
        }
    });
    public labelPosition = input<LabelPosition>("center");
    public labelStyles = input<Partial<CSSStyleDeclaration>>({});
    public labelVisible = input(true);
    public max = input(100);
    public min = input(0);
    public value = input(0);

    public constructor() {
        effect(() => {
            const color = this.color();
            const progress = this.progress();
            untracked(() => {
                this.#color.set(typeof color === "string" ? color : color(progress));
            });
        });
        effect(() => {
            const value = this.value();
            untracked(() => this.updateProgress(value));
        });
        effect(() => {
            this.labelFormat();
            untracked(() => this.formatted.set(true));
        });
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
