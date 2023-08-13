import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { ComboBoxItemTemplateDirective } from "./combo-box-item-template.directive";

describe("ComboBoxItemTemplateDirective", () => {
    let spectator: SpectatorDirective<ComboBoxItemTemplateDirective>;
    const createDirective = createDirectiveFactory(ComboBoxItemTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaComboBoxItemTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
