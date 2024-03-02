import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChildren,
    DestroyRef,
    EventEmitter,
    inject,
    input,
    Input,
    InputSignal,
    Output,
    QueryList,
    Signal,
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
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuItemComponent implements AfterContentInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #menuItem: Signal<MenuItem> = computed(() => {
        return {
            data: this.data(),
            disabled: this.disabled(),
            divider: this.divider(),
            iconClass: this.iconClass(),
            parent: null,
            subMenuItems: [],
            text: this.text(),
            visible: this.visible()
        };
    });

    public data: InputSignal<unknown> = input<unknown>({});
    public disabled: InputSignal<boolean> = input<boolean>(false);
    public divider: InputSignal<boolean> = input<boolean>(false);
    public iconClass: InputSignal<string> = input<string>("");
    public text: InputSignal<string> = input<string>("");
    public visible: InputSignal<boolean> = input<boolean>(true);

    @ContentChildren(MenuItemIconTemplateDirective, { read: TemplateRef, descendants: false })
    public iconTemplate: QueryList<TemplateRef<any>> = new QueryList<TemplateRef<any>>();

    @Output()
    public menuClick: EventEmitter<void> = new EventEmitter<void>();

    @ContentChildren(MenuItemComponent)
    public submenuItems: QueryList<MenuItemComponent> = new QueryList<MenuItemComponent>();

    @ContentChildren(MenuItemTextTemplateDirective, { read: TemplateRef, descendants: false })
    public textTemplate: QueryList<TemplateRef<any>> = new QueryList<TemplateRef<any>>();

    public getMenuItem(): MenuItem {
        return this.getMenuItemWithDepth(0);
    }

    public ngAfterContentInit(): void {
        this.submenuItems.changes.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
            this.#menuItem().subMenuItems = this.submenuItems.map(si => si.getMenuItem());
        });
    }

    private getMenuItemWithDepth(depth: number = 0): MenuItem {
        this.#menuItem().iconTemplate = this.iconTemplate.get(0);
        this.#menuItem().menuClick = (): void => this.menuClick.emit();
        this.#menuItem().subMenuItems = this.submenuItems.map(si => {
            const subMenuItem = si.getMenuItemWithDepth(depth + 1);
            subMenuItem.parent = this.#menuItem();
            return subMenuItem;
        });
        this.#menuItem().depth = depth;
        this.#menuItem().textTemplate = this.textTemplate.get(0);
        return this.#menuItem();
    }
}
