import { Component, ViewChild } from "@angular/core";
import { fakeAsync } from "@angular/core/testing";
import { createComponentFactory, createDirectiveFactory, Spectator, SpectatorDirective } from "@ngneat/spectator";
import { ButtonGroupModule } from "../../button-group/button-group.module";
import { ButtonDirective } from "./button.directive";

@Component({
    template: `<button
        monaButton
        [selected]="selected"
        [toggleable]="toggleable"
        (selectedChange)="selectedChange($event)">
        TEST BUTTON
    </button>`,
    styles: []
})
class TestButtonDirectiveComponent {
    public selected: boolean = false;
    public toggleable: boolean = false;

    @ViewChild(ButtonDirective)
    public buttonDirective!: ButtonDirective;

    public selectedChange(selected: boolean): void {
        this.selected = selected;
    }
}

@Component({
    template: `
        <mona-button-group selection="single">
            <button monaButton [toggleable]="true">A</button>
            <button monaButton [toggleable]="true">B</button>
            <button monaButton [toggleable]="true">C</button>
        </mona-button-group>
    `
})
class TestButtonGroupButtonComponent {}

describe("ButtonDirective", () => {
    let spectator: SpectatorDirective<ButtonDirective>;
    const createDirective = createDirectiveFactory(ButtonDirective);
    let testComponentSpectator: Spectator<TestButtonDirectiveComponent>;
    const createTestComponent = createComponentFactory({
        component: TestButtonDirectiveComponent
    });
    let testButtonGroupSpectator: Spectator<TestButtonGroupButtonComponent>;
    const createTestButtonGroupComponent = createComponentFactory({
        component: TestButtonGroupButtonComponent,
        imports: [ButtonGroupModule]
    });

    beforeEach(() => {
        spectator = createDirective(`<button monaButton>TEST BUTTON</button>`);
        testComponentSpectator = createTestComponent();
        testButtonGroupSpectator = createTestButtonGroupComponent();
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });

    it("should have class disabled", () => {
        spectator.setInput("disabled", true);
        expect(spectator.element).toHaveClass("mona-disabled");
    });

    it("should have class primary", () => {
        spectator.setInput("primary", true);
        expect(spectator.element).toHaveClass("mona-primary");
    });

    it("should contain text TEST BUTTON", () => {
        expect(spectator.element).toHaveText("TEST BUTTON");
    });

    it("should emit selectedChange", fakeAsync(() => {
        const spy = spyOn(testComponentSpectator.component, "selectedChange").and.callThrough();
        expect(testComponentSpectator.component.selected).toBeFalse();
        expect(testComponentSpectator.component.toggleable).toBeFalse();
        testComponentSpectator.component.toggleable = true;
        testComponentSpectator.detectChanges();
        const button = testComponentSpectator.query("button") as HTMLButtonElement;
        button.click();
        testComponentSpectator.tick();
        testComponentSpectator.detectChanges();
        testComponentSpectator.tick();
        expect(spy).toHaveBeenCalledWith(true);
        testComponentSpectator.tick();
        testComponentSpectator.detectChanges();
        testComponentSpectator.tick();
        expect(testComponentSpectator.component.selected).toBeTrue();
    }));

    it("should have tabindex -1", () => {
        spectator.setInput("disabled", true);
        expect(spectator.element).toHaveAttribute("tabindex", "-1");
    });

    it("should have tabindex 0", () => {
        spectator.setInput("tabindex", 0);
        expect(spectator.element).toHaveAttribute("tabindex", "0");
    });

    it("should have tabindex 1", () => {
        spectator.setInput("tabindex", 1);
        expect(spectator.element).toHaveAttribute("tabindex", "1");
    });

    it("should update selected attribute of buttons of a button group", fakeAsync(() => {
        const buttons = testButtonGroupSpectator.queryAll("button") as HTMLButtonElement[];
        buttons[0].click();
        testComponentSpectator.tick();
        testButtonGroupSpectator.detectChanges();
        testButtonGroupSpectator.tick();
        expect(buttons[0]).toHaveClass("mona-selected");
        expect(buttons[1]).not.toHaveClass("mona-selected");
        expect(buttons[2]).not.toHaveClass("mona-selected");

        buttons[1].click();
        testComponentSpectator.tick();
        testButtonGroupSpectator.detectChanges();
        testButtonGroupSpectator.tick();
        expect(buttons[0]).not.toHaveClass("mona-selected");
        expect(buttons[1]).toHaveClass("mona-selected");
        expect(buttons[2]).not.toHaveClass("mona-selected");

        buttons[2].click();
        testComponentSpectator.tick();
        testButtonGroupSpectator.detectChanges();
        testButtonGroupSpectator.tick();
        expect(buttons[0]).not.toHaveClass("mona-selected");
        expect(buttons[1]).not.toHaveClass("mona-selected");
        expect(buttons[2]).toHaveClass("mona-selected");
    }));
});
