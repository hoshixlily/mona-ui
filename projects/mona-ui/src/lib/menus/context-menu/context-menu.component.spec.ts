import { ApplicationRef, Component } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { MenuItem } from "../models/MenuItem";
import { ContextMenuService } from "../services/context-menu.service";

import { ContextMenuComponent } from "./context-menu.component";

@Component({
    template: `
        <button #target>Context Menu Anchor</button>
        <mona-contextmenu [target]="target">
            <mona-menu-item text="First Item"></mona-menu-item>
            <mona-menu-item text="Second Item">
                <mona-menu-item text="Second Item 1"></mona-menu-item>
                <mona-menu-item text="Second Item 2"></mona-menu-item>
                <mona-menu-item text="Second Item 3"></mona-menu-item>
            </mona-menu-item>
            <mona-menu-item text="Third Item"></mona-menu-item>
        </mona-contextmenu>
    `,
    standalone: true,
    imports: [ContextMenuComponent, MenuItemComponent]
})
class ContextMenuComponentTestComponent {}

@Component({
    template: `
        <button #target>Context Menu Anchor</button>
        <mona-contextmenu [target]="target" [menuItems]="menuItems">
            <mona-menu-item text="First Item"></mona-menu-item>
            <mona-menu-item text="Second Item"></mona-menu-item>
        </mona-contextmenu>
    `,
    standalone: true,
    imports: [ContextMenuComponent, MenuItemComponent]
})
class ContextMenuComponentTestComponentWithMenuItems {
    public menuItems: MenuItem[] = [
        {
            text: "First dynamic item",
            parent: null
        },
        {
            text: "Second dynamic item",
            parent: null
        }
    ];
}

describe("ContextMenuComponent", () => {
    let hostComponent: ContextMenuComponentTestComponent;
    let hostFixture: ComponentFixture<ContextMenuComponentTestComponent>;

    let hostComponentWithMenuItems: ContextMenuComponentTestComponentWithMenuItems;
    let hostFixtureWithMenuItems: ComponentFixture<ContextMenuComponentTestComponentWithMenuItems>;

    let appRef: ApplicationRef;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ContextMenuComponent,
                ContextMenuComponentTestComponent,
                NoopAnimationsModule,
                ContextMenuComponentTestComponentWithMenuItems
            ],
            providers: [ContextMenuService, ApplicationRef]
        });
        hostFixture = TestBed.createComponent(ContextMenuComponentTestComponent);
        hostComponent = hostFixture.componentInstance;
        hostFixtureWithMenuItems = TestBed.createComponent(ContextMenuComponentTestComponentWithMenuItems);
        hostComponentWithMenuItems = hostFixtureWithMenuItems.componentInstance;
        appRef = TestBed.inject(ApplicationRef);
        hostFixture.detectChanges();
        hostFixtureWithMenuItems.detectChanges();
    });

    afterEach(() => {
        hostFixture.destroy();
    });

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
        expect(hostComponentWithMenuItems).toBeTruthy();
    });

    it("should show context menu on right click", fakeAsync(() => {
        const target = hostFixture.nativeElement.querySelector("button");
        target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));
        tick();
        hostFixture.detectChanges();
        tick();
        const contextMenuList = document.querySelector("ul.mona-contextmenu-list");
        expect(contextMenuList).not.toBeNull();
    }));
    it("should show a menu with 3 items", fakeAsync(() => {
        const target = hostFixture.nativeElement.querySelector("button");
        target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));
        tick();
        hostFixture.detectChanges();
        appRef.tick();
        const contextMenuList = document.querySelector("ul.mona-contextmenu-list") as HTMLUListElement;
        expect(contextMenuList.children.length).toBe(3);
    }));
    it("should show a submenu with 3 items", fakeAsync(() => {
        const target = hostFixture.nativeElement.querySelector("button");
        target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));
        tick();
        hostFixture.detectChanges();
        appRef.tick();
        const contextMenuList = document.querySelector("ul.mona-contextmenu-list") as HTMLUListElement;
        const secondItem = contextMenuList.children[1] as HTMLLIElement;
        secondItem.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
        tick();
        hostFixture.detectChanges();
        appRef.tick();
        const subMenuLists = document.querySelectorAll("ul.mona-contextmenu-list") as NodeListOf<HTMLUListElement>;
        expect(subMenuLists[1].children.length).toBe(3);
        expect(subMenuLists[1].children[0].textContent).toBe("Second Item 1");
        expect(subMenuLists[1].children[1].textContent).toBe("Second Item 2");
        expect(subMenuLists[1].children[2].textContent).toBe("Second Item 3");
    }));
    it("should hide context menu on click outside", fakeAsync(() => {
        const target = hostFixture.nativeElement.querySelector("button");
        target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));
        tick();
        hostFixture.detectChanges();
        tick();
        const contextMenuList = document.querySelector("ul.mona-contextmenu-list");
        expect(contextMenuList).not.toBeNull();
        document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        tick();
        hostFixture.detectChanges();
        tick();
        const contextMenuListAfterClick = document.querySelector("ul.mona-contextmenu-list");
        expect(contextMenuListAfterClick).toBeNull();
    }));
    it("should not close the context menu on click inside", fakeAsync(() => {
        const target = hostFixture.nativeElement.querySelector("button");
        target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));
        tick();
        hostFixture.detectChanges();
        tick();
        const contextMenuList = document.querySelector("ul.mona-contextmenu-list");
        expect(contextMenuList).not.toBeNull();
        contextMenuList!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        tick();
        hostFixture.detectChanges();
        tick();
        const contextMenuListAfterClick = document.querySelector("ul.mona-contextmenu-list");
        expect(contextMenuListAfterClick).not.toBeNull();
    }));
    it("should hide context menu on escape key", fakeAsync(() => {
        const target = hostFixture.nativeElement.querySelector("button");
        target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));
        tick();
        hostFixture.detectChanges();
        tick();
        const contextMenuList = document.querySelector("ul.mona-contextmenu-list");
        expect(contextMenuList).not.toBeNull();
        document.body.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));
        tick();
        hostFixture.detectChanges();
        tick();
        const contextMenuListAfterClick = document.querySelector("ul.mona-contextmenu-list");
        expect(contextMenuListAfterClick).toBeNull();
    }));
    it("should close the context menu on click on a menu item", fakeAsync(() => {
        const target = hostFixture.nativeElement.querySelector("button");
        target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));
        tick();
        hostFixture.detectChanges();
        appRef.tick();
        const contextMenuList = document.querySelector("ul.mona-contextmenu-list") as HTMLUListElement;
        const firstItem = contextMenuList.children[0] as HTMLLIElement;
        firstItem.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        tick();
        hostFixture.detectChanges();
        tick();
        const contextMenuListAfterClick = document.querySelector("ul.mona-contextmenu-list");
        expect(contextMenuListAfterClick).toBeNull();
    }));
    it("should ignore the menu-item components if menuItems are provided", fakeAsync(() => {
        const target = hostFixtureWithMenuItems.nativeElement.querySelector("button");
        target.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));
        tick();
        hostFixtureWithMenuItems.detectChanges();
        appRef.tick();
        const contextMenuList = document.querySelector("ul.mona-contextmenu-list") as HTMLUListElement;
        expect(contextMenuList.children.length).toBe(2);
        expect(contextMenuList.children[0].textContent).toBe("First dynamic item");
        expect(contextMenuList.children[1].textContent).toBe("Second dynamic item");
    }));
});
