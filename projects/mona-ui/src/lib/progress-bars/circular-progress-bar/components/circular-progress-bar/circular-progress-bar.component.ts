import { NgClass, NgStyle, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChild,
    effect,
    input,
    InputSignal,
    Signal,
    signal,
    WritableSignal
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
    protected readonly center: Signal<{ x: Signal<number>; y: Signal<number> }> = computed(() => {
        return {
            x: computed(() => this.size() / 2),
            y: computed(() => this.size() / 2)
        };
    });
    protected readonly circumference: Signal<number> = computed(
        () => 2 * Math.PI * (this.size() / 2 - this.thickness())
    );
    protected readonly pixelSize: Signal<string> = computed(() => `${this.size()}px`);
    protected readonly progressValue: WritableSignal<number> = signal(0);
    protected readonly radius: Signal<number> = computed(() => this.size() / 2 - this.thickness());
    protected readonly strokeColor: Signal<string> = computed(() => {
        if (typeof this.color() === "string") {
            return this.color() as string;
        }
        const colorize = this.color() as Action<number, string>;
        return colorize(this.progressValue());
    });
    protected readonly strokeDashOffset: Signal<number> = computed(() => {
        const dashOffset = this.circumference() * (1 - this.progressValue() / 100);
        return this.indeterminate() ? this.circumference() / 1.42 : dashOffset;
    });

    /**
     * Color of progress bar. Can be string or function that takes progress value and returns color.
     */
    public color: InputSignal<string | Action<number, string>> = input<string | Action<number, string>>(
        "var(--mona-primary)"
    );
    public disabled: InputSignal<boolean> = input(false);
    public indeterminate: InputSignal<boolean> = input(false);
    public max: InputSignal<number> = input(100);
    public min: InputSignal<number> = input(0);

    /**
     * Progress value in percentage. Value must be between 0 and 100.
     * Do not use together with value input.
     * @param value Progress value in percentage.
     */
    public progress: InputSignal<number> = input(0);
    public size: InputSignal<number> = input(100);
    public thickness: InputSignal<number> = input(5);

    /**
     * Progress value in absolute value. Value must be between min and max.
     * Do not use together with progress input.
     * @param value Progress value in absolute value.
     */
    public value: InputSignal<number> = input(0);

    @ContentChild(CircularProgressBarLabelTemplateDirective)
    public labelTemplateDirective: CircularProgressBarLabelTemplateDirective | null = null;

    public constructor() {
        effect(() => this.progressValue.set(this.progress()), { allowSignalWrites: true });
        effect(() => this.updateProgress(this.value()), { allowSignalWrites: true });
    }

    private updateProgress(value: number): void {
        this.progressValue.set(Math.round(((value - this.min()) / (this.max() - this.min())) * 100));
    }
}
