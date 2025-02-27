import { Component, viewChild, ViewChild } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ButtonGroupComponent } from "../button-group/button-group.component";
import { ButtonDirective } from "./button.directive";

@Component({
    template: ` <button
        monaButton
        [primary]="primary"
        [selected]="selected"
        [tabindex]="tabIndex"
        [toggleable]="toggleable"
        (selectedChange)="selectedChange($event)">
        TEST BUTTON
    </button>`,
    imports: [ButtonDirective]
})
class TestButtonDirectiveComponent {
    public primary: boolean = true;
    public selected: boolean = false;
    public tabIndex: number = 0;
    public toggleable: boolean = false;

    public buttonDirective = viewChild.required(ButtonDirective);

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
        buttonHostComponent.buttonDirective().disabled.set(true);
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
        buttonHostFixture.componentRef.instance.tabIndex = -1;
        buttonHostFixture.detectChanges();
        const button = buttonHostFixture.debugElement.nativeElement.querySelector("button");
        const tabindex = button.getAttribute("tabindex");
        expect(tabindex).toBe("-1");
    });

    it("should have tabindex 0", () => {
        buttonHostFixture.componentRef.instance.tabIndex = 0;
        buttonHostFixture.detectChanges();
        const button = buttonHostFixture.debugElement.nativeElement.querySelector("button");
        const tabindex = button.getAttribute("tabindex");
        expect(tabindex).toBe("0");
    });

    it("should have tabindex 1", () => {
        buttonHostFixture.componentRef.instance.tabIndex = 1;
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
        buttonHostFixture.detectChanges();

        expect(button).toHaveClass("mona-selected");

        button.click();
        buttonHostFixture.detectChanges();

        expect(button).not.toHaveClass("mona-selected");
    });

    it("should not emit selectedChange when not toggleable", fakeAsync(() => {
        const spy = spyOn(buttonHostComponent, "selectedChange");
        const button = buttonHostFixture.debugElement.query(By.css("button")).nativeElement;
        button.click();
        tick();
        buttonHostFixture.detectChanges();
        expect(spy).not.toHaveBeenCalled();
    }));

    it("should have class 'mona-button'", () => {
        const button = buttonHostFixture.debugElement.query(By.css("button")).nativeElement;
        expect(button).toHaveClass("mona-button");
    });

    it("should have class 'mona-selected' when selected is true", () => {
        buttonHostComponent.selected = true;
        buttonHostFixture.detectChanges();
        const button = buttonHostFixture.debugElement.query(By.css("button")).nativeElement;
        expect(button).toHaveClass("mona-selected");
    });

    it("should not toggle when disabled", fakeAsync(() => {
        buttonHostComponent.toggleable = true;
        buttonHostComponent.buttonDirective().disabled.set(true);
        buttonHostFixture.detectChanges();

        const button = buttonHostFixture.debugElement.query(By.css("button")).nativeElement;
        button.click();
        tick();
        buttonHostFixture.detectChanges();

        expect(button).not.toHaveClass("mona-selected");
    }));
});
