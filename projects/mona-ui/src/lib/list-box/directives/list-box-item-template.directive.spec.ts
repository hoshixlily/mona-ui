import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { ListBoxItemTemplateDirective } from "./list-box-item-template.directive";

describe("ListBoxItemTemplateDirective", () => {
    let spectator: SpectatorDirective<ListBoxItemTemplateDirective>;
    const createDirective = createDirectiveFactory(ListBoxItemTemplateDirective);

    beforeEach(() => (spectator = createDirective(`<ng-template monaListBoxItemTemplate></ng-template>`)));

    it("should create an instance", () => {
        expect(spectator.directive).toBeTruthy();
    });
});
