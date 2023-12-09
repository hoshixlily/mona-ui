import { NgClass, NgStyle, NgTemplateOutlet } from "@angular/common";
import { Component, computed, ContentChild, Input, Signal, signal, WritableSignal } from "@angular/core";
import { Action } from "../../../../utils/Action";
import { CircularProgressBarLabelTemplateDirective } from "../../directives/circular-progress-bar-label-template.directive";

@Component({
    selector: "mona-circular-progress-bar",
    templateUrl: "./circular-progress-bar.component.html",
    styleUrls: ["./circular-progress-bar.component.scss"],
    standalone: true,
    imports: [NgStyle, NgClass, NgTemplateOutlet]
})
export class CircularProgressBarComponent {
    public center: Signal<{ x: Signal<number>; y: Signal<number> }> = computed(() => {
        return {
            x: computed(() => this.circleSize() / 2),
            y: computed(() => this.circleSize() / 2)
        };
    });
    public circleSize: WritableSignal<number> = signal(100);
    public circleThickness: WritableSignal<number> = signal(5);
    public circumference: Signal<number> = computed(
        () => 2 * Math.PI * (this.circleSize() / 2 - this.circleThickness())
    );
    public indeterminateProgress: WritableSignal<boolean> = signal(false);
    public pixelSize: Signal<string> = computed(() => `${this.circleSize()}px`);
    public progressColor: WritableSignal<string | Action<number, string>> = signal("var(--mona-primary)");
    public progressValue: WritableSignal<number> = signal(0);
    public radius: Signal<number> = computed(() => this.circleSize() / 2 - this.circleThickness());
    public strokeColor: Signal<string> = computed(() => {
        if (typeof this.progressColor() === "string") {
            return this.progressColor() as string;
        }
        const colorize = this.progressColor() as Action<number, string>;
        return colorize(this.progressValue());
    });
    public strokeDashOffset: Signal<number> = computed(() => {
        const dashOffset = this.circumference() * (1 - this.progressValue() / 100);
        return this.indeterminateProgress() ? this.circumference() / 1.42 : dashOffset;
    });

    /**
     * Color of progress bar. Can be string or function that takes progress value and returns color.
     * @param value Color of progress bar.
     */
    @Input()
    public set color(value: string | Action<number, string>) {
        this.progressColor.set(value);
    }

    @Input()
    public disabled: boolean = false;

    @Input()
    public set indeterminate(value: boolean) {
        this.indeterminateProgress.set(value);
    }

    @ContentChild(CircularProgressBarLabelTemplateDirective)
    public labelTemplateDirective: CircularProgressBarLabelTemplateDirective | null = null;

    @Input()
    public max: number = 100;

    @Input()
    public min: number = 0;

    /**
     * Progress value in percentage. Value must be between 0 and 100.
     * Do not use together with value input.
     * @param value Progress value in percentage.
     */
    @Input()
    public set progress(value: number) {
        this.progressValue.set(value);
    }

    @Input()
    public set size(value: number) {
        this.circleSize.set(value);
    }

    @Input()
    public set thickness(value: number) {
        this.circleThickness.set(value);
    }

    /**
     * Progress value in absolute value. Value must be between min and max.
     * Do not use together with progress input.
     * @param value Progress value in absolute value.
     */
    @Input()
    public set value(value: number) {
        this.updateProgress(value);
    }

    private updateProgress(value: number): void {
        this.progressValue.set(Math.round(((value - this.min) / (this.max - this.min)) * 100));
    }
}
