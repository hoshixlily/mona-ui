import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    contentChildren,
    effect,
    signal,
    untracked,
    viewChildren
} from "@angular/core";
import { Collections, List, zip } from "@mirei/ts-collections";
import { ContextMenuComponent } from "../context-menu/context-menu.component";
import { MenuComponent } from "../menu/menu.component";
import { ContextMenuCloseEvent } from "../models/ContextMenuCloseEvent";
import { ContextMenuNavigationEvent } from "../models/ContextMenuNavigationEvent";
import { ContextMenuOpenEvent } from "../models/ContextMenuOpenEvent";

@Component({
    selector: "mona-menubar",
    templateUrl: "./menubar.component.html",
    styleUrls: ["./menubar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, NgTemplateOutlet, ContextMenuComponent],
    host: {
        class: "mona-menubar"
    }
})
export class MenubarComponent {
    protected readonly contextMenuComponents = viewChildren(ContextMenuComponent);
    protected readonly currentContextMenu = signal<ContextMenuComponent | null>(null);
    protected readonly menuList = contentChildren(MenuComponent);

    public constructor() {
        effect(() => {
            const contextMenuComponents = this.contextMenuComponents();
            untracked(() => {
                contextMenuComponents.forEach(c => c.setPrecise(false));
                zip(this.menuList(), contextMenuComponents).forEach(([menu, context]) => {
                    menu.contextMenu = context;
                });
            });
        });
        effect(() => {
            this.menuList();
            untracked(() => {
                this.currentContextMenu()?.closeMenu();
                this.currentContextMenu.set(null);
            });
        });
    }

    public onContextMenuClose(event: ContextMenuCloseEvent): void {
        if (event.uid === this.currentContextMenu()?.uid) {
            this.currentContextMenu.set(null);
        }
    }

    public onContextMenuNavigate(event: ContextMenuNavigationEvent): void {
        if (event.direction === "right") {
            if (event.currentItem == null) {
                const index = this.findNextNonDisabledMenuIndex();
                if (index >= 0) {
                    this.currentContextMenu()?.closeMenu();
                    this.currentContextMenu.set(this.menuList()[index].contextMenu);
                    this.currentContextMenu()?.openMenu();
                }
            }
        } else if (event.direction === "left") {
            if (event.currentItem == null) {
                const index = this.findPreviousNonDisabledMenuIndex();
                if (index >= 0) {
                    this.currentContextMenu()?.closeMenu();
                    this.currentContextMenu.set(this.menuList()[index].contextMenu);
                    this.currentContextMenu()?.openMenu();
                }
            }
        }
    }

    public onContextMenuOpen(event: ContextMenuOpenEvent): void {
        if (this.currentContextMenu()?.uid === event.uid) {
            return;
        }
        this.contextMenuComponents().forEach(c => {
            if (c.uid !== event.uid) {
                c.closeMenu();
            }
        });
        const contextMenu = this.contextMenuComponents().find(c => c.uid === event.uid) ?? null;
        this.currentContextMenu.set(contextMenu);
    }

    public onMenuClick(ctx: ContextMenuComponent): void {
        if (this.currentContextMenu()?.uid === ctx.uid) {
            this.currentContextMenu()?.closeMenu();
            this.currentContextMenu.set(null);
            return;
        }
        this.contextMenuComponents().forEach(c => {
            if (c !== ctx) {
                c.closeMenu();
            }
        });
        this.currentContextMenu.set(ctx);
    }

    public onMenuMouseEnter(ctx: ContextMenuComponent): void {
        if (!this.currentContextMenu()) {
            return;
        }
        if (this.currentContextMenu() !== ctx) {
            this.currentContextMenu()?.closeMenu();
            this.currentContextMenu.set(ctx);
            this.currentContextMenu()?.openMenu();
        }
    }

    private findNextNonDisabledMenuIndex(): number {
        const index = this.menuList().findIndex(n => n.contextMenu === this.currentContextMenu());
        if (index < 0) {
            return -1;
        }
        const list = new List(this.menuList());
        Collections.rotate(list, -index);
        const next = list.skip(1).firstOrDefault(m => !m.disabled());
        if (next) {
            return this.menuList().findIndex(m => m === next);
        }
        return -1;
    }

    private findPreviousNonDisabledMenuIndex(): number {
        const index = this.menuList().findIndex(n => n.contextMenu === this.currentContextMenu());
        if (index < 0) {
            return -1;
        }
        const list = new List(this.menuList());
        Collections.rotate(list, -index);
        const next = list.reverse().firstOrDefault(m => !m.disabled());
        if (next) {
            return this.menuList().findIndex(m => m === next);
        }
        return -1;
    }
}
