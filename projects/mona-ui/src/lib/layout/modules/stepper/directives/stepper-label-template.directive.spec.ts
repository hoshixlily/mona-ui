import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { StepperLabelTemplateDirective } from "./stepper-label-template.directive";

describe("StepperLabelTemplateDirective", () => {
    let spectator: SpectatorDirective<StepperLabelTemplateDirective>;
    const createDirective = createDirectiveFactory(StepperLabelTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaStepperLabelTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
