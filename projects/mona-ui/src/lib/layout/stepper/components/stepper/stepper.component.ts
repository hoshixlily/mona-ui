import { NgClass, NgStyle, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    ContentChild,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    input,
    InputSignal,
    InputSignalWithTransform,
    model,
    ModelSignal,
    OnInit,
    Output,
    Signal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent } from "rxjs";
import { StepperIndicatorTemplateDirective } from "../../directives/stepper-indicator-template.directive";
import { StepperLabelTemplateDirective } from "../../directives/stepper-label-template.directive";
import { StepperStepTemplateDirective } from "../../directives/stepper-step-template.directive";
import { Step, StepOptions } from "../../models/Step";

@Component({
    selector: "mona-stepper",
    templateUrl: "./stepper.component.html",
    styleUrls: ["./stepper.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgStyle, NgClass, NgTemplateOutlet],
    host: {
        class: "mona-stepper",
        "[class.mona-stepper-horizontal]": "orientation() === 'horizontal'",
        "[class.mona-stepper-vertical]": "orientation() === 'vertical'",
        "[class.mona-stepper-linear]": "linear()",
        "[attr.tabindex]": "0",
        "[style]": "hostStyles()"
    }
})
export class StepperComponent implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #trackItemSize: Signal<number> = computed(() => {
        const stepCount = this.steps().length;
        return stepCount !== 0 ? 100 / stepCount : 0;
    });
    readonly #trackLength: Signal<string> = computed(() => {
        const step = this.activeStep();
        return step ? `${(100 / (this.steps().length - 1)) * step.index}%` : "0%";
    });
    protected readonly activeStep: Signal<Step> = computed(() => {
        const step = this.step();
        return this.steps()[step];
    });
    protected readonly hostStyles: Signal<Partial<CSSStyleDeclaration>> = computed(() => {
        const orientation = this.orientation();
        const stepCount = this.steps().length;
        return {
            gridTemplateColumns: orientation === "horizontal" ? `repeat(${stepCount * 2}, 1fr)` : undefined,
            gridTemplateRows: orientation === "vertical" ? `repeat(${stepCount * 2}, 1fr)` : undefined
        };
    });
    protected readonly trackInnerStyles: Signal<Partial<CSSStyleDeclaration>> = computed(() => {
        const orientation = this.orientation();
        const length = this.#trackLength();
        return {
            [orientation === "horizontal" ? "width" : "height"]: length
        };
    });

    protected readonly trackItemStyles: Signal<Partial<CSSStyleDeclaration>> = computed(() => {
        const orientation = this.orientation();
        const itemSize = this.#trackItemSize();
        return {
            [orientation === "horizontal" ? "maxWidth" : "maxHeight"]: `${itemSize}%`
        };
    });

    protected readonly trackStyles: Signal<Partial<CSSStyleDeclaration>> = computed(() => {
        const orientation = this.orientation();
        const step = this.activeStep();
        const stepCount = this.steps().length;
        const gridColumn = orientation === "horizontal" && step != null ? `2/${stepCount * 2}` : undefined;
        const gridRow = orientation === "vertical" && step != null ? `2/${stepCount * 2}` : undefined;
        return { gridColumn, gridRow };
    });

    public linear: InputSignal<boolean> = input(false);
    public orientation: InputSignal<"horizontal" | "vertical"> = input<"horizontal" | "vertical">("horizontal");
    public step: ModelSignal<number> = model(0);
    public steps: InputSignalWithTransform<Step[], Iterable<StepOptions>> = input([], {
        transform: (steps: Iterable<StepOptions>) => {
            return Array.from(steps).map((s, ix) => {
                const step = new Step(s);
                step.index = ix;
                return step;
            });
        }
    });

    @ContentChild(StepperIndicatorTemplateDirective)
    public indicatorTemplateDirective: StepperIndicatorTemplateDirective | null = null;

    @ContentChild(StepperLabelTemplateDirective)
    public labelTemplateDirective: StepperLabelTemplateDirective | null = null;

    @ContentChild(StepperStepTemplateDirective)
    public stepTemplateDirective: StepperStepTemplateDirective | null = null;

    @Output()
    public stepChange: EventEmitter<number> = new EventEmitter<number>();

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly cdr: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        this.setSubscriptions();
        window.setTimeout(() => {
            this.setActiveStep(this.activeStep(), true);
        });
    }

    public onStepClick(step: Step): void {
        const changed = this.setActiveStep(step);
        if (changed) {
            this.stepChange.emit(step.index);
        }
    }

    public setActiveStep(step: Step, bypassLinear: boolean = false): boolean {
        const setActive = (): void => {
            this.step.set(step.index);
            for (const [ix, s] of this.steps().entries()) {
                s.active.set(ix <= step.index);
            }
        };
        const linear = this.linear();
        const activeStep = this.activeStep();
        const isFirstStep = step.index === 0;

        if (
            !linear ||
            (activeStep && (this.activeStep().index + 1 === step.index || step.index <= this.activeStep().index)) ||
            (!activeStep && (bypassLinear || (!bypassLinear && isFirstStep)))
        ) {
            setActive();
            return true;
        }
        return false;
    }

    private setSubscriptions(): void {
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((event: KeyboardEvent) => {
                if (!this.activeStep) {
                    this.step.set(0);
                    return;
                }
                if (event.key === "ArrowLeft") {
                    const index = this.activeStep().index - 1;
                    if (index >= 0) {
                        this.setActiveStep(this.steps()[index]);
                    }
                } else if (event.key === "ArrowRight") {
                    const index = this.activeStep().index + 1;
                    if (index < this.steps().length) {
                        this.setActiveStep(this.steps()[index]);
                    }
                }
            });
    }
}
