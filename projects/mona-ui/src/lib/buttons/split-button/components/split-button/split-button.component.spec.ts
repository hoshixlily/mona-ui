import { CommonModule } from "@angular/common";
import { ApplicationRef, Component } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { BrowserModule, By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ContextMenuComponent } from "../../../../menus/context-menu/context-menu.component";
import { MenuItemComponent } from "../../../../menus/menu-item/menu-item.component";
import { ButtonDirective } from "../../../button/button.directive";

import { SplitButtonComponent } from "./split-button.component";

@Component({
    template: `
        <mona-split-button [text]="'Split Button'">
            <mona-menu-item text="Item 1"></mona-menu-item>
            <mona-menu-item text="Item 2" (menuClick)="onItemClick($event)"></mona-menu-item>
            <mona-menu-item text="Item 3">
                <mona-menu-item text="Item 3.1"></mona-menu-item>
                <mona-menu-item text="Item 3.2" (menuClick)="onItemClick($event)"></mona-menu-item>
                <mona-menu-item text="Item 3.3"></mona-menu-item>
            </mona-menu-item>
            @if (menuVisible) {
                <mona-menu-item text="Item 4"></mona-menu-item>
            }
        </mona-split-button>
    `,
    imports: [SplitButtonComponent, MenuItemComponent, CommonModule]
})
class TestHostComponent {
    public menuVisible: boolean = false;

    public constructor(public readonly appRef: ApplicationRef) {}

    public onItemClick(event: any): void {
        console.log(event);
    }
}

describe("SplitButtonComponent", () => {
    let component: SplitButtonComponent;
    let hostComponent: TestHostComponent;
    let fixture: ComponentFixture<SplitButtonComponent>;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let appRef: ApplicationRef;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SplitButtonComponent,
                TestHostComponent,
                BrowserAnimationsModule,
                CommonModule,
                BrowserModule,
                ContextMenuComponent,
                ButtonDirective
            ],
            providers: [ApplicationRef]
        });
        fixture = TestBed.createComponent(SplitButtonComponent);
        hostFixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        hostComponent = hostFixture.componentInstance;
        appRef = TestBed.inject(ApplicationRef);
        fixture.detectChanges();
        hostFixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a menu icon", () => {
        const buttons = fixture.debugElement
            .queryAll(By.css("button"))
            .map(button => button.nativeElement) as HTMLButtonElement[];
        expect(buttons.length).toBe(2);
        expect(buttons[1].querySelector("fa-icon")).not.toBeNull();
    });

    it("should have the text 'Split Button'", () => {
        const buttons = hostFixture.debugElement
            .queryAll(By.css("button"))
            .map(button => button.nativeElement) as HTMLButtonElement[];
        expect(buttons.length).toBe(2);
        expect(buttons[0].textContent).toBe("Split Button");
    });

    it("should show the menu when the menu icon is clicked", () => {
        const buttons = hostFixture.debugElement
            .queryAll(By.css("button"))
            .map(button => button.nativeElement) as HTMLButtonElement[];
        expect(buttons.length).toBe(2);
        buttons[1].click();
        appRef.tick();
        const menu = document.querySelector("ul.mona-contextmenu-list");
        expect(menu).not.toBeNull();
        const menuItems = menu?.querySelectorAll("li.mona-contextmenu-list-item");
        expect(menuItems?.length).toBe(3);
        expect(menuItems?.item(0)?.textContent).toBe("Item 1");
        expect(menuItems?.item(1)?.textContent).toBe("Item 2");
        expect(menuItems?.item(2)?.textContent).toBe("Item 3");
    });

    it("should show the sub menu when the third menu item is hovered", fakeAsync(() => {
        const buttons = hostFixture.debugElement
            .queryAll(By.css("button"))
            .map(button => button.nativeElement) as HTMLButtonElement[];
        expect(buttons.length).toBe(2);
        buttons[1].click();
        appRef.tick();
        const menu = document.querySelector("ul.mona-contextmenu-list");
        expect(menu).not.toBeNull();
        const thirdMenuItem = menu?.querySelectorAll("li.mona-contextmenu-list-item")[2] as HTMLLIElement;
        thirdMenuItem.dispatchEvent(new MouseEvent("mouseenter"));
        appRef.tick();
        const subMenu = document.querySelectorAll("ul.mona-contextmenu-list")[1];
        expect(subMenu).not.toBeNull();

        const subMenuItems = subMenu?.querySelectorAll("li.mona-contextmenu-list-item");
        expect(subMenuItems?.length).toBe(3);
        expect(subMenuItems?.item(0)?.textContent).toBe("Item 3.1");
        expect(subMenuItems?.item(1)?.textContent).toBe("Item 3.2");
        expect(subMenuItems?.item(2)?.textContent).toBe("Item 3.3");
    }));

    it("should show the hidden menu item when condition is true", fakeAsync(() => {
        const buttons = hostFixture.debugElement
            .queryAll(By.css("button"))
            .map(button => button.nativeElement) as HTMLButtonElement[];
        expect(buttons.length).toBe(2);
        buttons[1].click();
        appRef.tick();
        const menu = document.querySelector("ul.mona-contextmenu-list");
        expect(menu).not.toBeNull();
        const menuItems = menu?.querySelectorAll("li.mona-contextmenu-list-item");
        expect(menuItems?.length).toBe(3);
        expect(menuItems?.item(0)?.textContent).toBe("Item 1");
        expect(menuItems?.item(1)?.textContent).toBe("Item 2");
        expect(menuItems?.item(2)?.textContent).toBe("Item 3");
        hostComponent.menuVisible = true;
        document.body.click();
        tick();
        hostFixture.detectChanges();
        buttons[1].click();
        appRef.tick();
        const menu2 = document.querySelector("ul.mona-contextmenu-list") as HTMLUListElement;
        expect(menu2).not.toBeNull();
        const menuItems2 = menu2.querySelectorAll("li.mona-contextmenu-list-item") as NodeListOf<HTMLLIElement>;
        expect(menuItems2.length).toBe(4);
        expect(menuItems2.item(0)?.textContent).toBe("Item 1");
        expect(menuItems2.item(1)?.textContent).toBe("Item 2");
        expect(menuItems2.item(2)?.textContent).toBe("Item 3");
        expect(menuItems2.item(3)?.textContent).toBe("Item 4");
    }));
});
