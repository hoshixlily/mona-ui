import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    ContentChild,
    contentChildren,
    ContentChildren,
    input,
    InputSignal,
    model,
    ModelSignal,
    OnInit,
    QueryList,
    Signal,
    TemplateRef
} from "@angular/core";
import { any, forEach, from } from "@mirei/ts-collections";
import { v4 } from "uuid";
import { ContextMenuComponent } from "../context-menu/context-menu.component";
import { MenuTextTemplateDirective } from "../directives/menu-text-template.directive";
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { MenuItem } from "../models/MenuItem";
import { MenuTextTemplateContext } from "../models/MenuTextTemplateContext";

@Component({
    selector: "mona-menu",
    template: "",
    styleUrls: [],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
    protected readonly menuItemComponents: Signal<readonly MenuItemComponent[]> = contentChildren(MenuItemComponent);

    public readonly menuItemList: Signal<MenuItem[]> = computed(() => {
        const menuItemComponents = this.menuItemComponents();
        const menuItems = from(this.menuItems());
        if (menuItems.any()) {
            return menuItems.toArray();
        }
        if (menuItemComponents.length !== 0) {
            const items = menuItemComponents.map(i => i.getMenuItem());
            this.initializeMenuItems(items);
            return items;
        }
        return [];
    });

    public readonly textTemplate: Signal<TemplateRef<MenuTextTemplateContext<unknown>> | undefined> = contentChild(
        MenuTextTemplateDirective,
        { read: TemplateRef }
    );
    public readonly uid: string = v4();
    public contextMenu: ContextMenuComponent | null = null;
    public disabled: InputSignal<boolean> = input(false);
    public menuItems: ModelSignal<Iterable<MenuItem>> = model<Iterable<MenuItem>>([]);
    public text: InputSignal<string> = input("");

    private initializeMenuItems(items: Iterable<MenuItem>): void {
        forEach(items, i => {
            i.visible = i.visible ?? true;
            this.initializeMenuItems(i.subMenuItems ?? []);
        });
    }
}
