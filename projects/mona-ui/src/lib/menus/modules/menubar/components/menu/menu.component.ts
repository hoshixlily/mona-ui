import { AfterContentInit, Component, ContentChildren, Input, OnInit, QueryList } from "@angular/core";
import { MenuItem } from "../../../context-menu/models/MenuItem";
import { MenuItemComponent } from "../../../shared-menu/components/menu-item/menu-item.component";

@Component({
    selector: "mona-menu",
    template: "",
    styleUrls: []
})
export class MenuComponent implements OnInit, AfterContentInit {
    @ContentChildren(MenuItemComponent)
    public menuItemComponents: QueryList<MenuItemComponent> = new QueryList<MenuItemComponent>();

    @Input()
    public menuItems: MenuItem[] = [];

    @Input()
    public text: string = "";

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
