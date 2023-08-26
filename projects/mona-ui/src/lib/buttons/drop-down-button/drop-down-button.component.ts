import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChildren,
    DestroyRef,
    inject,
    Input,
    QueryList,
    ViewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ContextMenuComponent } from "../../menus/context-menu/context-menu.component";
import { MenuItem } from "../../menus/models/MenuItem";
import { MenuItemComponent } from "../../menus/menu-item/menu-item.component";
import { NgIf } from "@angular/common";
import { ButtonDirective } from "../button/button.directive";

@Component({
    selector: "mona-drop-down-button",
    templateUrl: "./drop-down-button.component.html",
    styleUrls: ["./drop-down-button.component.scss"],
    standalone: true,
    imports: [ButtonDirective, NgIf, ContextMenuComponent]
})
export class DropDownButtonComponent implements AfterViewInit, AfterContentInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    public menuItems: MenuItem[] = [];

    @ViewChild("contextMenuComponent")
    private readonly contextMenuComponent!: ContextMenuComponent;

    @Input()
    public disabled: boolean = false;

    @ContentChildren(MenuItemComponent)
    public menuItemComponents: QueryList<MenuItemComponent> = new QueryList<MenuItemComponent>();

    public ngAfterContentInit(): void {
        this.menuItems = this.menuItemComponents.map(m => m.getMenuItem());
        this.menuItemComponents.changes.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
            this.menuItems = this.menuItemComponents.map(m => m.getMenuItem());
        });
    }

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.contextMenuComponent.setPrecise(false);
        });
    }
}
