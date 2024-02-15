import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ButtonGroupComponent } from "../button-group/button-group.component";
import { ButtonDirective } from "./button.directive";

@Component({
    template: ` <button
        monaButton
        [primary]="primary"
        [selected]="selected"
        [toggleable]="toggleable"
        (selectedChange)="selectedChange($event)">
        TEST BUTTON
    </button>`,
    standalone: true,
    imports: [ButtonDirective]
})
class TestButtonDirectiveComponent {
    public primary: boolean = true;
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
    `,
    standalone: true,
    imports: [ButtonDirective, ButtonGroupComponent]
})
class TestButtonGroupButtonComponent {}

describe("ButtonDirective", () => {
    let buttonHostComponent: TestButtonDirectiveComponent;
    let buttonGroupHostComponent: TestButtonGroupButtonComponent;
    let buttonHostFixture: ComponentFixture<TestButtonDirectiveComponent>;
    let buttonGroupHostFixture: ComponentFixture<TestButtonGroupButtonComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestButtonDirectiveComponent]
        });
        buttonHostFixture = TestBed.createComponent(TestButtonDirectiveComponent);
        buttonGroupHostFixture = TestBed.createComponent(TestButtonGroupButtonComponent);
        buttonHostComponent = buttonHostFixture.componentInstance;
        buttonGroupHostComponent = buttonGroupHostFixture.componentInstance;
        buttonHostFixture.detectChanges();
        buttonGroupHostFixture.detectChanges();
    });

    it("should create", () => {
        expect(buttonHostComponent).toBeTruthy();
    });

    it("should have class disabled", () => {
        buttonHostComponent.buttonDirective.disabled = true;
        buttonHostFixture.detectChanges();
        const button = buttonHostFixture.debugElement.nativeElement.querySelector("button");
        expect(button).toHaveClass("mona-disabled");
    });

    it("should have class primary", () => {
        buttonHostComponent.primary = true;
        buttonHostFixture.detectChanges();
        const button = buttonHostFixture.debugElement.nativeElement.querySelector("button");
        expect(button).toHaveClass("mona-primary");
    });

    it("should contain text TEST BUTTON", () => {
        const button = buttonHostFixture.debugElement.nativeElement.querySelector("button");
        expect(button.textContent).toContain("TEST BUTTON");
    });

    it("should emit selectedChange", fakeAsync(() => {
        const spy = spyOn(buttonHostComponent, "selectedChange").and.callThrough();
        expect(buttonHostComponent.selected).toBeFalse();
        expect(buttonHostComponent.toggleable).toBeFalse();
        buttonHostComponent.toggleable = true;
        tick();
        buttonHostFixture.detectChanges();
        tick();
        const button = buttonHostFixture.debugElement.query(By.css("button")).nativeElement as HTMLButtonElement;
        button.click();
        tick();
        buttonHostFixture.detectChanges();
        tick();
        expect(spy).toHaveBeenCalledWith(true);
        tick();
        buttonHostFixture.detectChanges();
        tick();
        expect(buttonHostComponent.selected).toBeTrue();
    }));

    it("should have tabindex -1", () => {
        buttonHostComponent.buttonDirective.tabindex = -1;
        buttonHostFixture.detectChanges();
        const button = buttonHostFixture.debugElement.nativeElement.querySelector("button");
        const tabindex = button.getAttribute("tabindex");
        expect(tabindex).toBe("-1");
    });

    it("should have tabindex 0", () => {
        buttonHostComponent.buttonDirective.tabindex = 0;
        buttonHostFixture.detectChanges();
        const button = buttonHostFixture.debugElement.nativeElement.querySelector("button");
        const tabindex = button.getAttribute("tabindex");
        expect(tabindex).toBe("0");
    });

    it("should have tabindex 1", () => {
        buttonHostComponent.buttonDirective.tabindex = 1;
        buttonHostFixture.detectChanges();
        const button = buttonHostFixture.debugElement.nativeElement.querySelector("button");
        const tabindex = button.getAttribute("tabindex");
        expect(tabindex).toBe("1");
    });

    it("should update selected attribute of buttons of a button group", fakeAsync(() => {
        tick();
        buttonGroupHostFixture.detectChanges();
        const buttons = buttonGroupHostFixture.debugElement
            .queryAll(By.css("button"))
            .map(button => button.nativeElement) as HTMLButtonElement[];
        buttons[0].click();
        tick();
        buttonGroupHostFixture.detectChanges();
        tick();
        expect(buttons[0]).toHaveClass("mona-selected");
        expect(buttons[1]).not.toHaveClass("mona-selected");
        expect(buttons[2]).not.toHaveClass("mona-selected");

        buttons[1].click();
        tick();
        buttonGroupHostFixture.detectChanges();
        tick();
        expect(buttons[0]).not.toHaveClass("mona-selected");
        expect(buttons[1]).toHaveClass("mona-selected");
        expect(buttons[2]).not.toHaveClass("mona-selected");

        buttons[2].click();
        tick();
        buttonGroupHostFixture.detectChanges();
        tick();
        expect(buttons[0]).not.toHaveClass("mona-selected");
        expect(buttons[1]).not.toHaveClass("mona-selected");
        expect(buttons[2]).toHaveClass("mona-selected");
    }));

    it("should change selected status of a toggleable button when clicked", () => {
        buttonHostComponent.toggleable = true;
        buttonHostFixture.detectChanges();
        const button = buttonHostFixture.debugElement.query(By.css("button")).nativeElement as HTMLButtonElement;
        button.click();
        expect(button).toHaveClass("mona-selected");
        button.click();
        expect(button).not.toHaveClass("mona-selected");
    });
});
