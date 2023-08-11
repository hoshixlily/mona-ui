import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { StepperStepTemplateDirective } from "./stepper-step-template.directive";

describe("StepperStepTemplateDirective", () => {
    let spectator: SpectatorDirective<StepperStepTemplateDirective>;
    const createDirective = createDirectiveFactory(StepperStepTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaStepperStepTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
