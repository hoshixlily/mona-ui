import {
    AfterContentInit,
    Component,
    ContentChildren,
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    Output,
    QueryList,
    TemplateRef
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MenuItemIconTemplateDirective } from "../directives/menu-item-icon-template.directive";
import { MenuItemTextTemplateDirective } from "../directives/menu-item-text-template.directive";
import { MenuItem } from "../models/MenuItem";

@Component({
    selector: "mona-menu-item",
    template: "",
    styleUrls: [],
    standalone: true
})
export class MenuItemComponent implements AfterContentInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    private menuItem: MenuItem = {
        disabled: false,
        divider: false,
        parent: null,
        subMenuItems: [],
        text: "",
        visible: true
    };

    @Input()
    public set data(data: unknown) {
        this.menuItem.data = data;
    }

    @Input()
    public set disabled(disabled: boolean) {
        this.menuItem.disabled = disabled;
    }

    @Input()
    public set divider(divider: boolean) {
        this.menuItem.divider = divider;
    }

    @Input()
    public set iconClass(iconClass: string) {
        this.menuItem.iconClass = iconClass;
    }

    @ContentChildren(MenuItemIconTemplateDirective, { read: TemplateRef, descendants: false })
    public iconTemplate: QueryList<TemplateRef<any>> = new QueryList<TemplateRef<any>>();

    @Output()
    public menuClick: EventEmitter<void> = new EventEmitter<void>();

    @ContentChildren(MenuItemComponent)
    public submenuItems: QueryList<MenuItemComponent> = new QueryList<MenuItemComponent>();

    @Input()
    public set text(text: string) {
        this.menuItem.text = text;
    }

    @ContentChildren(MenuItemTextTemplateDirective, { read: TemplateRef, descendants: false })
    public textTemplate: QueryList<TemplateRef<any>> = new QueryList<TemplateRef<any>>();

    @Input()
    public set visible(visible: boolean) {
        this.menuItem.visible = visible;
    }

    public constructor() {}

    public getMenuItem(): MenuItem {
        return this.getMenuItemWithDepth(0);
    }

    public ngAfterContentInit(): void {
        this.submenuItems.changes.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
            this.menuItem.subMenuItems = this.submenuItems.map(si => si.getMenuItem());
        });
    }

    private getMenuItemWithDepth(depth: number = 0): MenuItem {
        this.menuItem.iconTemplate = this.iconTemplate.get(0);
        this.menuItem.menuClick = (): void => this.menuClick.emit();
        this.menuItem.subMenuItems = this.submenuItems.map(si => {
            const subMenuItem = si.getMenuItemWithDepth(depth + 1);
            subMenuItem.parent = this.menuItem;
            return subMenuItem;
        });
        this.menuItem.depth = depth;
        this.menuItem.textTemplate = this.textTemplate.get(0);
        return this.menuItem;
    }
}
