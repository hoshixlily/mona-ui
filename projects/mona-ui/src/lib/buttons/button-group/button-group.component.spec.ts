import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { SelectionMode } from "../../models/SelectionMode";
import { ButtonDirective } from "../button/button.directive";

import { ButtonGroupComponent } from "./button-group.component";

@Component({
    template: `
        <mona-button-group [disabled]="disabled" [selection]="selectionMode">
            <button monaButton [toggleable]="true" [selected]="selectedIndex === 0">Button 1</button>
            <button monaButton [toggleable]="true" [selected]="selectedIndex === 1">Button 2</button>
            <button monaButton [toggleable]="true" [selected]="selectedIndex === 2">Button 3</button>
        </mona-button-group>
    `,
    standalone: true,
    imports: [ButtonGroupComponent, ButtonDirective]
})
class ButtonGroupComponentSpecHostComponent {
    public disabled: boolean = false;
    public selectionMode: SelectionMode = "single";
    public selectedIndex: number = -1;

    @ViewChild(ButtonGroupComponent)
    public buttonGroupComponent!: ButtonGroupComponent;
}

describe("ButtonGroupComponent", () => {
    let component: ButtonGroupComponent;
    let hostComponent: ButtonGroupComponentSpecHostComponent;
    let fixture: ComponentFixture<ButtonGroupComponent>;
    let hostFixture: ComponentFixture<ButtonGroupComponentSpecHostComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [ButtonGroupComponent, ButtonGroupComponentSpecHostComponent, ButtonDirective]
        });
        fixture = TestBed.createComponent(ButtonGroupComponent);
        hostFixture = TestBed.createComponent(ButtonGroupComponentSpecHostComponent);
        component = fixture.componentInstance;
        hostComponent = hostFixture.componentInstance;
        fixture.detectChanges();
        hostFixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have multiple selection mode by default", () => {
        expect(component.selection).toBe("multiple");
    });

    it("should have 3 buttons", () => {
        const buttons = hostFixture.debugElement.queryAll(By.css("button"));
        expect(buttons.length).toBe(3);
    });

    it("should have 3 buttons with toggleable attribute", fakeAsync(async () => {
        tick();
        hostFixture.detectChanges();
        const buttons = hostFixture.debugElement.queryAll(By.css("button"));
        expect(buttons.length).toBe(3);
    }));

    it("should not have any button selected", () => {
        const buttons = hostFixture.debugElement.queryAll(By.css("button.mona-selected"));
        expect(buttons.length).toBe(0);
    });

    it("should have 1 button selected", () => {
        hostComponent.selectionMode = "single";
        hostFixture.detectChanges();
        const buttons = hostFixture.debugElement
            .queryAll(By.directive(ButtonDirective))
            .map(button => button.injector.get(ButtonDirective)) as ButtonDirective[];
        buttons[0].elementRef.nativeElement.click();
        buttons[1].elementRef.nativeElement.click();
        buttons[2].elementRef.nativeElement.click();
        const selectedButtons = hostFixture.debugElement
            .queryAll(By.css("button.mona-selected"))
            .map(button => button.nativeElement) as HTMLButtonElement[];
        expect(selectedButtons.length).toBe(1);
        expect(selectedButtons[0].textContent).toBe("Button 3");
    });

    it("should have 3 buttons selected", () => {
        hostComponent.selectionMode = "multiple";
        hostFixture.detectChanges();
        const buttons = hostFixture.debugElement
            .queryAll(By.directive(ButtonDirective))
            .map(button => button.injector.get(ButtonDirective)) as ButtonDirective[];
        buttons[0].elementRef.nativeElement.click();
        buttons[1].elementRef.nativeElement.click();
        buttons[2].elementRef.nativeElement.click();
        const selectedButtons = hostFixture.debugElement
            .queryAll(By.css("button.mona-selected"))
            .map(button => button.nativeElement) as HTMLButtonElement[];
        expect(selectedButtons.length).toBe(3);
    });

    it("should not deselect a selected button when clicked", () => {
        hostComponent.selectionMode = "single";
        hostFixture.detectChanges();
        const buttons = hostFixture.debugElement
            .queryAll(By.directive(ButtonDirective))
            .map(button => button.injector.get(ButtonDirective)) as ButtonDirective[];
        buttons[0].elementRef.nativeElement.click();
        buttons[0].elementRef.nativeElement.click();
        const selectedButtons = hostFixture.debugElement
            .queryAll(By.css("button.mona-selected"))
            .map(button => button.nativeElement) as HTMLButtonElement[];
        expect(selectedButtons.length).toBe(1);
    });

    it("should disable all buttons", () => {
        hostComponent.disabled = true;
        hostFixture.detectChanges();
        const buttons = hostFixture.debugElement
            .queryAll(By.css("button.mona-disabled"))
            .map(button => button.nativeElement) as HTMLButtonElement[];
        const disabledButtons = hostFixture.debugElement
            .queryAll(By.css("button[disabled]"))
            .map(button => button.injector.get(ButtonDirective)) as ButtonDirective[];
        expect(buttons.length).toBe(3);
        expect(disabledButtons.length).toBe(3);
    });

    it("should unselect all other buttons when a button is selected", () => {
        hostComponent.selectionMode = "single";
        hostFixture.detectChanges();
        const buttons = hostFixture.debugElement
            .queryAll(By.directive(ButtonDirective))
            .map(button => button.injector.get(ButtonDirective)) as ButtonDirective[];
        buttons[0].elementRef.nativeElement.click();
        expect(buttons[0].selected).toBeTrue();

        hostComponent.selectedIndex = 2;
        hostFixture.detectChanges();
        expect(buttons[0].selected).toBeFalse();
        expect(buttons[2].selected).toBeTrue();
    });
});
