import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { CircularProgressBarLabelTemplateDirective } from "./circular-progress-bar-label-template.directive";

describe("CircularProgressBarLabelTemplateDirective", () => {
    let spectator: SpectatorDirective<CircularProgressBarLabelTemplateDirective>;
    const createDirective = createDirectiveFactory(CircularProgressBarLabelTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaCircularProgressBarLabelTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
