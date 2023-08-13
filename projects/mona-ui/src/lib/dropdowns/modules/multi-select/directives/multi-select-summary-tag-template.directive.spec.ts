import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { MultiSelectSummaryTagTemplateDirective } from "./multi-select-summary-tag-template.directive";

describe("MultiSelectSummaryTagTemplateDirective", () => {
    let spectator: SpectatorDirective<MultiSelectSummaryTagTemplateDirective>;
    const createDirective = createDirectiveFactory({
        directive: MultiSelectSummaryTagTemplateDirective
    });

    beforeEach(() => (spectator = createDirective(`<ng-template monaMultiSelectSummaryTagTemplate></ng-template>`)));

    it("should create an instance", () => {
        expect(spectator.directive).toBeTruthy();
    });
});
