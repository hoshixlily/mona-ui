import { ApplicationRef, Component } from "@angular/core";
import { fakeAsync } from "@angular/core/testing";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ContextMenuModule } from "../../../../../menus/modules/context-menu/context-menu.module";

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
            <mona-menu-item text="Item 4" *ngIf="menuVisible"></mona-menu-item>
        </mona-split-button>
    `
})
class TestHostComponent {
    public menuVisible: boolean = false;
    public constructor(public readonly appRef: ApplicationRef) {}
    public onItemClick(event: any): void {
        console.log(event);
    }
}

describe("SplitButtonComponent", () => {
    let spectator: Spectator<SplitButtonComponent>;
    const createComponent = createComponentFactory({
        component: SplitButtonComponent,
        imports: [ContextMenuModule, FontAwesomeTestingModule]
    });
    let hostSpectator: Spectator<TestHostComponent>;
    const createHostComponent = createComponentFactory({
        component: TestHostComponent,
        imports: [ContextMenuModule, FontAwesomeTestingModule]
    });

    beforeEach(() => {
        spectator = createComponent();
        hostSpectator = createHostComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });

    it("should have a menu icon", () => {
        const buttons = spectator.queryAll("button");
        expect(buttons.length).toBe(2);
        expect(buttons[1].querySelector("fa-icon")).not.toBeNull();
    });

    it("should have the text 'Split Button'", () => {
        const buttons = hostSpectator.queryAll("button");
        expect(buttons.length).toBe(2);
        expect(buttons[0].textContent).toBe("Split Button");
    });

    it("should show the menu when the menu icon is clicked", () => {
        const buttons = hostSpectator.queryAll("button") as HTMLButtonElement[];
        expect(buttons.length).toBe(2);
        buttons[1].click();
        hostSpectator.detectChanges();
        const menu = document.querySelector("ul.mona-contextmenu-list");
        expect(menu).not.toBeNull();
        const menuItems = menu?.querySelectorAll("li.mona-contextmenu-list-item");
        expect(menuItems?.length).toBe(3);
        expect(menuItems?.item(0)?.textContent).toBe("Item 1");
        expect(menuItems?.item(1)?.textContent).toBe("Item 2");
        expect(menuItems?.item(2)?.textContent).toBe("Item 3");
    });

    it("should show the sub menu when the third menu item is hovered", fakeAsync(() => {
        const buttons = hostSpectator.queryAll("button") as HTMLButtonElement[];
        expect(buttons.length).toBe(2);
        buttons[1].click();
        hostSpectator.detectChanges();
        const menu = document.querySelector("ul.mona-contextmenu-list");
        expect(menu).not.toBeNull();
        const thirdMenuItem = menu?.querySelectorAll("li.mona-contextmenu-list-item")[2] as HTMLLIElement;
        thirdMenuItem.dispatchEvent(new MouseEvent("mouseenter"));
        hostSpectator.tick();
        hostSpectator.detectChanges();
        hostSpectator.tick();
        const subMenu = document.querySelectorAll("ul.mona-contextmenu-list")[1];
        expect(subMenu).not.toBeNull();

        const subMenuItems = subMenu?.querySelectorAll("li.mona-contextmenu-list-item");
        expect(subMenuItems?.length).toBe(3);
        expect(subMenuItems?.item(0)?.textContent).toBe("Item 3.1");
        expect(subMenuItems?.item(1)?.textContent).toBe("Item 3.2");
        expect(subMenuItems?.item(2)?.textContent).toBe("Item 3.3");
    }));

    it("should show the hidden menu item when condition is true", fakeAsync(() => {
        const buttons = hostSpectator.queryAll("button") as HTMLButtonElement[];
        expect(buttons.length).toBe(2);
        buttons[1].click();
        hostSpectator.detectChanges();
        const menu = document.querySelector("ul.mona-contextmenu-list");
        expect(menu).not.toBeNull();
        const menuItems = menu?.querySelectorAll("li.mona-contextmenu-list-item");
        expect(menuItems?.length).toBe(3);
        expect(menuItems?.item(0)?.textContent).toBe("Item 1");
        expect(menuItems?.item(1)?.textContent).toBe("Item 2");
        expect(menuItems?.item(2)?.textContent).toBe("Item 3");
        hostSpectator.component.menuVisible = true;
        document.body.click();
        hostSpectator.detectChanges();
        buttons[1].click();
        hostSpectator.tick();
        hostSpectator.detectChanges();
        hostSpectator.tick();
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
