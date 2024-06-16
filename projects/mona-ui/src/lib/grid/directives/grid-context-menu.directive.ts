import { contentChildren, Directive, effect, inject, untracked } from "@angular/core";
import { MenuItemComponent } from "../../menus/menu-item/menu-item.component";
import { GridService } from "../services/grid.service";

@Directive({
    selector: "[monaGridContextMenu]",
    standalone: true
})
export class GridContextMenuDirective {
    readonly #gridService = inject(GridService);
    private readonly menuItems = contentChildren(MenuItemComponent);

    public constructor() {
        effect(() => {
            const menuItems = this.menuItems();
            untracked(() =>
                this.#gridService.contextMenuItems.update(set =>
                    set.clear().addAll(menuItems.map(m => m.getMenuItem()))
                )
            );
        });
    }
}
