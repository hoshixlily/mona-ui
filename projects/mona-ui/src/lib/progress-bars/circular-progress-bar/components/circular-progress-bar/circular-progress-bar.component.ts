import { NgClass, NgStyle, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    effect,
    input,
    signal,
    TemplateRef,
    untracked
} from "@angular/core";
import { Action } from "../../../../utils/Action";
import { CircularProgressBarLabelTemplateDirective } from "../../directives/circular-progress-bar-label-template.directive";

@Component({
    selector: "mona-circular-progress-bar",
    templateUrl: "./circular-progress-bar.component.html",
    styleUrls: ["./circular-progress-bar.component.scss"],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgStyle, NgClass, NgTemplateOutlet],
    host: {
        class: "mona-circular-progress-bar",
        "[class.mon-disabled]": "disabled()",
        "[style.width]": "pixelSize()",
        "[style.height]": "pixelSize()"
    }
})
export class CircularProgressBarComponent {
    protected readonly center = computed(() => {
        return {
            x: computed(() => this.size() / 2),
            y: computed(() => this.size() / 2)
        };
    });
    protected readonly circumference = computed(() => 2 * Math.PI * (this.size() / 2 - this.thickness()));
    protected readonly labelTemplate = contentChild(CircularProgressBarLabelTemplateDirective, {
        read: TemplateRef
    });
    protected readonly pixelSize = computed(() => `${this.size()}px`);
    protected readonly progressValue = signal(0);
    protected readonly radius = computed(() => this.size() / 2 - this.thickness());
    protected readonly strokeColor = computed(() => {
        if (typeof this.color() === "string") {
            return this.color() as string;
        }
        const colorize = this.color() as Action<number, string>;
        return colorize(this.progressValue());
    });
    protected readonly strokeDashOffset = computed(() => {
        const dashOffset = this.circumference() * (1 - this.progressValue() / 100);
        return this.indeterminate() ? this.circumference() / 1.42 : dashOffset;
    });

    /**
     * Color of progress bar. Can be string or function that takes progress value and returns color.
     */
    public color = input<string | Action<number, string>>("var(--mona-primary)");
    public disabled = input(false);
    public indeterminate = input(false);
    public max = input(100);
    public min = input(0);

    /**
     * Progress value in percentage. Value must be between 0 and 100.
     * Do not use together with the {@link value} input.
     */
    public progress = input(0);
    public size = input(100);
    public thickness = input(5);

    /**
     * Progress value in absolute value. Value must be between min and max.
     * Do not use together with the {@link progress} input.
     */
    public value = input(0);

    public constructor() {
        effect(() => {
            const progress = this.progress();
            untracked(() => this.progressValue.set(progress));
        });
        effect(() => {
            const value = this.value();
            untracked(() => this.updateProgress(value));
        });
    }

    private updateProgress(value: number): void {
        this.progressValue.set(Math.round(((value - this.min()) / (this.max() - this.min())) * 100));
    }
}
