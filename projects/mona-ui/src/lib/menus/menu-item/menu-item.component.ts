import {
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    effect,
    input,
    InputSignal,
    output,
    OutputEmitterRef,
    Signal,
    TemplateRef,
    untracked
} from "@angular/core";
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
export class MenuItemComponent {
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

    protected readonly iconTemplate = contentChild(MenuItemIconTemplateDirective, { read: TemplateRef });
    protected readonly submenuItems = contentChildren(MenuItemComponent);
    protected readonly textTemplate = contentChild(MenuItemTextTemplateDirective, { read: TemplateRef });

    public readonly menuClick: OutputEmitterRef<void> = output();

    public data: InputSignal<unknown> = input<unknown>({});
    public disabled: InputSignal<boolean> = input<boolean>(false);
    public divider: InputSignal<boolean> = input<boolean>(false);
    public iconClass: InputSignal<string> = input<string>("");
    public text: InputSignal<string> = input<string>("");
    public visible: InputSignal<boolean> = input<boolean>(true);

    public constructor() {
        effect(() => {
            const submenuItems = this.submenuItems();
            untracked(() => {
                this.#menuItem().subMenuItems = submenuItems.map(si => si.getMenuItem());
            });
        });
    }

    public getMenuItem(): MenuItem {
        return this.getMenuItemWithDepth(0);
    }

    private getMenuItemWithDepth(depth: number = 0): MenuItem {
        this.#menuItem().iconTemplate = this.iconTemplate();
        this.#menuItem().menuClick = (): void => this.menuClick.emit();
        this.#menuItem().subMenuItems = this.submenuItems().map(si => {
            const subMenuItem = si.getMenuItemWithDepth(depth + 1);
            subMenuItem.parent = this.#menuItem();
            return subMenuItem;
        });
        this.#menuItem().depth = depth;
        this.#menuItem().textTemplate = this.textTemplate();
        return this.#menuItem();
    }
}
