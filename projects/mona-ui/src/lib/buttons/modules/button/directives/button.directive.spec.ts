import { ButtonDirective } from "./button.directive";
import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";

describe("ButtonDirective", () => {
    let spectator: SpectatorDirective<ButtonDirective>;
    const createDirective = createDirectiveFactory(ButtonDirective);

    beforeEach(() => {
        spectator = createDirective(`<button monaButton>TEST BUTTON</button>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });

    it("should have class disabled", () => {
        spectator.setInput("disabled", true);
        expect(spectator.element).toHaveClass("disabled");
    });

    it("should have class primary", () => {
        spectator.setInput("primary", true);
        expect(spectator.element).toHaveClass("primary");
    });

    it("should contain text TEST BUTTON", () => {
        expect(spectator.element).toHaveText("TEST BUTTON");
    });

    it("should emit selectedChange", () => {
        const outputSpy = spyOn(spectator.directive.selectedChange, "emit");
        spectator.setInput("toggleable", true);
        spectator.setInput("selected", true);
        spectator.click();
        expect(outputSpy).toHaveBeenCalledWith(false);
    });
});
