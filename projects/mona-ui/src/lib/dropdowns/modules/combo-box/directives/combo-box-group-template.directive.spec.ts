import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { ComboBoxGroupTemplateDirective } from "./combo-box-group-template.directive";

describe("ComboBoxGroupTemplateDirective", () => {
    let spectator: SpectatorDirective<ComboBoxGroupTemplateDirective>;
    const createDirective = createDirectiveFactory(ComboBoxGroupTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaComboBoxGroupTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
