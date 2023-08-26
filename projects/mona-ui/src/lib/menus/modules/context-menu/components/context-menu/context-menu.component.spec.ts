import { Component } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ContextMenuService } from "../../services/context-menu.service";

import { ContextMenuComponent } from "./context-menu.component";

@Component({
    template: `
        <button #target>Context Menu Anchor</button>
        <mona-contextmenu [target]="target"></mona-contextmenu>
    `,
    standalone: true,
    imports: [ContextMenuComponent]
})
class ContextMenuComponentTestComponent {}

describe("ContextMenuComponent", () => {
    let hostComponent: ContextMenuComponentTestComponent;
    let hostFixture: ComponentFixture<ContextMenuComponentTestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContextMenuComponent, ContextMenuComponentTestComponent, BrowserAnimationsModule],
            providers: [ContextMenuService]
        });
        hostFixture = TestBed.createComponent(ContextMenuComponentTestComponent);
        hostComponent = hostFixture.componentInstance;
        hostFixture.detectChanges();
    });

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
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
});
