import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { StepperIndicatorTemplateDirective } from "./stepper-indicator-template.directive";

describe("StepperIndicatorTemplateDirective", () => {
    let spectator: SpectatorDirective<StepperIndicatorTemplateDirective>;
    const createDirective = createDirectiveFactory(StepperIndicatorTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaStepperIndicatorTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
