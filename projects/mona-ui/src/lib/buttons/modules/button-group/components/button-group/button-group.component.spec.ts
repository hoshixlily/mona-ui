import { Component, ViewChild } from "@angular/core";
import { fakeAsync } from "@angular/core/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SelectionMode } from "../../../../../models/SelectionMode";
import { ButtonDirective } from "../../../button/directives/button.directive";

import { ButtonGroupComponent } from "./button-group.component";

@Component({
    template: `
        <mona-button-group [disabled]="disabled" [selection]="selectionMode">
            <button monaButton [toggleable]="true" [selected]="selectedIndex === 0">Button 1</button>
            <button monaButton [toggleable]="true" [selected]="selectedIndex === 1">Button 2</button>
            <button monaButton [toggleable]="true" [selected]="selectedIndex === 2">Button 3</button>
        </mona-button-group>
    `
})
class ButtonGroupComponentSpecHostComponent {
    public disabled: boolean = false;
    public selectionMode: SelectionMode = "single";
    public selectedIndex: number = -1;

    @ViewChild(ButtonGroupComponent)
    public buttonGroupComponent!: ButtonGroupComponent;
}

describe("ButtonGroupComponent", () => {
    let spectator: Spectator<ButtonGroupComponent>;
    const createComponent = createComponentFactory({
        component: ButtonGroupComponent
    });
    let hostSpectator: Spectator<ButtonGroupComponentSpecHostComponent>;
    const createHostComponent = createComponentFactory({
        component: ButtonGroupComponentSpecHostComponent,
        declarations: [ButtonDirective]
    });

    beforeEach(async () => {
        spectator = createComponent();
        hostSpectator = createHostComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });

    it("should have multiple selection mode by default", () => {
        expect(spectator.component.selection).toBe("multiple");
    });

    it("should have 3 buttons", () => {
        const buttons = hostSpectator.queryAll("button");
        expect(buttons.length).toBe(3);
    });

    it("should have 3 buttons with toggleable attribute", fakeAsync(async () => {
        hostSpectator.tick(3000);
        hostSpectator.detectChanges();
        const buttons = hostSpectator.queryAll("button[monaButton]");
        expect(buttons.length).toBe(3);
    }));

    it("should not have any button selected", () => {
        const buttons = hostSpectator.queryAll("button.mona-selected");
        expect(buttons.length).toBe(0);
    });

    it("should have 1 button selected", () => {
        hostSpectator.component.selectionMode = "single";
        hostSpectator.detectChanges();
        const buttons = hostSpectator.queryAll(ButtonDirective) as ButtonDirective[];
        buttons[0].elementRef.nativeElement.click();
        buttons[1].elementRef.nativeElement.click();
        buttons[2].elementRef.nativeElement.click();
        const selectedButtons = hostSpectator.queryAll("button.mona-selected");
        expect(selectedButtons.length).toBe(1);
        expect(selectedButtons[0].textContent).toBe("Button 3");
    });

    it("should have 3 buttons selected", () => {
        hostSpectator.component.selectionMode = "multiple";
        hostSpectator.detectChanges();
        const buttons = hostSpectator.queryAll(ButtonDirective) as ButtonDirective[];
        buttons[0].elementRef.nativeElement.click();
        buttons[1].elementRef.nativeElement.click();
        buttons[2].elementRef.nativeElement.click();
        const selectedButtons = hostSpectator.queryAll("button.mona-selected");
        expect(selectedButtons.length).toBe(3);
    });

    it("should not deselect a selected button when clicked", () => {
        hostSpectator.component.selectionMode = "single";
        hostSpectator.detectChanges();
        const buttons = hostSpectator.queryAll(ButtonDirective) as ButtonDirective[];
        buttons[0].elementRef.nativeElement.click();
        buttons[0].elementRef.nativeElement.click();
        const selectedButtons = hostSpectator.queryAll("button.mona-selected");
        expect(selectedButtons.length).toBe(1);
    });

    it("should disable all buttons", () => {
        hostSpectator.setInput("disabled", true);
        hostSpectator.detectChanges();
        const buttons = hostSpectator.queryAll("button.mona-disabled");
        const disabledButtons = hostSpectator.queryAll("button[disabled]");
        expect(buttons.length).toBe(3);
        expect(disabledButtons.length).toBe(3);
    });

    it("should unselect all other buttons when a button is selected", () => {
        hostSpectator.component.selectionMode = "single";
        hostSpectator.detectChanges();
        const buttons = hostSpectator.queryAll(ButtonDirective) as ButtonDirective[];
        buttons[0].elementRef.nativeElement.click();
        expect(buttons[0].selected).toBeTrue();

        hostSpectator.component.selectedIndex = 2;
        hostSpectator.detectChanges();
        expect(buttons[0].selected).toBeFalse();
        expect(buttons[2].selected).toBeTrue();
    });
});
