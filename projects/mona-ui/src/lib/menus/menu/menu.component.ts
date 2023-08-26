import { AfterContentInit, Component, ContentChild, ContentChildren, Input, OnInit, QueryList } from "@angular/core";
import { MenuItem } from "../models/MenuItem";
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { v4 } from "uuid";
import { ContextMenuComponent } from "../context-menu/context-menu.component";
import { MenuTextTemplateDirective } from "../directives/menu-text-template.directive";

@Component({
    selector: "mona-menu",
    template: "",
    styleUrls: [],
    standalone: true
})
export class MenuComponent implements OnInit, AfterContentInit {
    public readonly uid: string = v4();
    public contextMenu: ContextMenuComponent | null = null;

    @Input()
    public disabled: boolean = false;

    @ContentChildren(MenuItemComponent)
    public menuItemComponents: QueryList<MenuItemComponent> = new QueryList<MenuItemComponent>();

    @Input()
    public menuItems: MenuItem[] = [];

    @Input()
    public text: string = "";

    @ContentChild(MenuTextTemplateDirective)
    public textTemplate: MenuTextTemplateDirective | null = null;

    public constructor() {}

    public ngAfterContentInit(): void {
        if (this.menuItems.length > 0) {
            return;
        }
        this.createMenuItems();
        this.initializeMenuItems(this.menuItems);
        this.menuItemComponents.changes.subscribe(() => {
            this.createMenuItems();
            this.initializeMenuItems(this.menuItems);
        });
    }

    public ngOnInit(): void {}

    private createMenuItems(): void {
        this.menuItems = this.menuItemComponents.map(i => i.getMenuItem());
    }

    private initializeMenuItems(items: MenuItem[]): void {
        items.forEach(i => {
            i.visible = i.visible !== false;
            this.initializeMenuItems(i.subMenuItems ?? []);
        });
    }
}
