import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ContentChildren,
    input,
    InputSignal,
    model,
    ModelSignal,
    OnInit,
    QueryList
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
export class MenuComponent implements OnInit, AfterContentInit {
    public readonly uid: string = v4();
    public contextMenu: ContextMenuComponent | null = null;
    public disabled: InputSignal<boolean> = input(false);
    public menuItems: ModelSignal<Iterable<MenuItem>> = model<Iterable<MenuItem>>([]);
    public text: InputSignal<string> = input("");

    @ContentChildren(MenuItemComponent)
    public menuItemComponents: QueryList<MenuItemComponent> = new QueryList<MenuItemComponent>();

    @ContentChild(MenuTextTemplateDirective)
    public textTemplate: MenuTextTemplateDirective | null = null;

    public ngAfterContentInit(): void {
        if (any(this.menuItems())) {
            return;
        }
        this.createMenuItems();
        this.initializeMenuItems(this.menuItems());
        this.menuItemComponents.changes.subscribe(() => {
            this.createMenuItems();
            this.initializeMenuItems(this.menuItems());
        });
    }

    public ngOnInit(): void {}

    private createMenuItems(): void {
        this.menuItems.set(this.menuItemComponents.map(i => i.getMenuItem()));
    }

    private initializeMenuItems(items: Iterable<MenuItem>): void {
        forEach(items, i => {
            i.visible = i.visible !== false;
            this.initializeMenuItems(i.subMenuItems ?? []);
        });
    }
}
