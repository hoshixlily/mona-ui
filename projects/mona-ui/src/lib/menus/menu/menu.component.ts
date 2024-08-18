import {
    ChangeDetectionStrategy,
    Component,
    contentChild,
    contentChildren,
    effect,
    input,
    model,
    TemplateRef,
    untracked
} from "@angular/core";
import { any, forEach } from "@mirei/ts-collections";
import { v4 } from "uuid";
import { ContextMenuComponent } from "../context-menu/context-menu.component";
import { MenuTextTemplateDirective } from "../directives/menu-text-template.directive";
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { MenuItem } from "../models/MenuItem";

@Component({
    selector: "mona-menu",
    template: "",
    styleUrls: [],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
    protected readonly menuItemComponents = contentChildren(MenuItemComponent);

    public readonly textTemplate = contentChild(MenuTextTemplateDirective, { read: TemplateRef });
    public readonly uid: string = v4();

    public contextMenu: ContextMenuComponent | null = null;
    public disabled = input(false);
    public menuItems = model<Iterable<MenuItem>>([]);
    public text = input("");

    public constructor() {
        effect(() => {
            const menuItemComponents = this.menuItemComponents();
            untracked(() => {
                const menuItems = this.menuItems();
                if (any(menuItems)) {
                    return;
                }
                this.menuItems.set(menuItemComponents.map(i => i.getMenuItem()));
                this.initializeMenuItems(this.menuItems());
            });
        });
    }

    private initializeMenuItems(items: Iterable<MenuItem>): void {
        forEach(items, i => {
            i.visible = i.visible !== false;
            this.initializeMenuItems(i.subMenuItems ?? []);
        });
    }
}
