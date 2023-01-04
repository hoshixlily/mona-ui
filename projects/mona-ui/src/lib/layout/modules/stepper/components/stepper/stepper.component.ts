import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Step, StepOptions } from "../../models/Step";
import { Enumerable } from "@mirei/ts-collections";
import { StepperLabelTemplateDirective } from "../../directives/stepper-label-template.directive";

@Component({
    selector: "mona-stepper",
    templateUrl: "./stepper.component.html",
    styleUrls: ["./stepper.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepperComponent implements OnInit {
    public activeStep: Step | null = null;

    @Input()
    public linear: boolean = false;

    public stepList: Step[] = [];

    @ContentChild(StepperLabelTemplateDirective)
    public labelTemplate: StepperLabelTemplateDirective | null = null;

    @Input()
    public set step(step: number) {
        if (this.stepList.length > 0) {
            this.setActiveStep(this.stepList[step]);
        }
    }

    public get step(): number {
        return this.activeStep ? this.activeStep.index : 0;
    }

    @Input()
    public set steps(steps: StepOptions[]) {
        this.stepList = steps.map((s, ix) => {
            const step = new Step(s);
            step.index = ix;
            return step;
        });
    }

    @Output()
    public stepChange: EventEmitter<number> = new EventEmitter<number>();

    public constructor() {}

    public ngOnInit(): void {
        if (!this.activeStep) {
            this.setActiveStep(this.stepList[0], true);
        }
    }

    public onStepClick(step: Step): void {
        const changed = this.setActiveStep(step);
        if (changed) {
            this.stepChange.emit(step.index);
        }
    }

    public setActiveStep(step: Step, bypassLinear: boolean = false): boolean {
        if (this.activeStep === step) {
            return false;
        }
        if (!this.linear) {
            this.activeStep = step;
            Enumerable.from(this.stepList).forEach(s => (s.active = s.index <= step.index));
            return true;
        } else {
            if (this.activeStep && (this.activeStep.index + 1 === step.index || step.index <= this.activeStep.index)) {
                this.activeStep = step;
                Enumerable.from(this.stepList).forEach(s => (s.active = s.index <= step.index));
                return true;
            } else if (!this.activeStep) {
                if (bypassLinear || (!bypassLinear && step.index === 0)) {
                    this.activeStep = step;
                    Enumerable.from(this.stepList).forEach(s => (s.active = s.index <= step.index));
                    return true;
                }
            }
        }
        return false;
    }

    public get trackGridColumns(): string | undefined {
        console.log("trackGridColumns");
        return this.activeStep ? `2/${this.stepList.length * 2}` : undefined;
    }

    public get trackItemWidth(): number {
        console.log("trackItemWidth");
        return this.stepList.length !== 0 ? 100 / this.stepList.length : 0;
    }

    public get trackWidth(): string {
        console.log("trackWidth");
        return !this.activeStep ? "0" : `${(100 / (this.stepList.length - 1)) * this.activeStep.index}`;
    }
}
