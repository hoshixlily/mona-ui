import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { MultiSelectSummaryTagDirective } from "./multi-select-summary-tag.directive";

describe("MultiSelectSummaryTagDirective", () => {
    let spectator: SpectatorDirective<MultiSelectSummaryTagDirective>;
    const createDirective = createDirectiveFactory(MultiSelectSummaryTagDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaMultiSelectSummaryTag></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
