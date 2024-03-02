import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    DestroyRef,
    inject,
    QueryList,
    ViewChildren
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Collections, Enumerable, List } from "@mirei/ts-collections";
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
    standalone: true,
    imports: [NgClass, NgTemplateOutlet, ContextMenuComponent],
    host: {
        class: "mona-menubar"
    }
})
export class MenubarComponent implements AfterViewInit, AfterContentInit {
    readonly #cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    readonly #destroyRef: DestroyRef = inject(DestroyRef);

    @ViewChildren(ContextMenuComponent)
    public readonly contextMenuComponents: QueryList<ContextMenuComponent> = new QueryList<ContextMenuComponent>();
    public currentContextMenu: ContextMenuComponent | null = null;

    @ContentChildren(MenuComponent)
    public menuList: QueryList<MenuComponent> = new QueryList<MenuComponent>();

    public ngAfterContentInit(): void {
        this.menuList.changes.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
            this.#cdr.detectChanges();
            this.currentContextMenu?.closeMenu();
            this.currentContextMenu = null;
        });
    }

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.contextMenuComponents.forEach(c => c.setPrecise(false));
            this.#cdr.detectChanges();
        });
        const pairContext = () => {
            Enumerable.from(this.menuList)
                .zip(Enumerable.from(this.contextMenuComponents))
                .forEach(([menu, context]) => {
                    menu.contextMenu = context;
                });
        };
        pairContext();
        this.contextMenuComponents.changes.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
            this.contextMenuComponents.forEach(c => c.setPrecise(false));
            this.#cdr.detectChanges();
            pairContext();
        });
    }

    public onContextMenuClose(event: ContextMenuCloseEvent): void {
        if (event.uid === this.currentContextMenu?.uid) {
            this.currentContextMenu = null;
            this.#cdr.detectChanges();
        }
    }

    public onContextMenuNavigate(event: ContextMenuNavigationEvent): void {
        if (event.direction === "right") {
            if (event.currentItem == null) {
                const index = this.findNextNonDisabledMenuIndex();
                if (index >= 0) {
                    this.currentContextMenu?.closeMenu();
                    this.currentContextMenu = this.menuList.toArray()[index].contextMenu;
                    this.currentContextMenu?.openMenu();
                }
            }
        } else if (event.direction === "left") {
            if (event.currentItem == null) {
                const index = this.findPreviousNonDisabledMenuIndex();
                if (index >= 0) {
                    this.currentContextMenu?.closeMenu();
                    this.currentContextMenu = this.menuList.toArray()[index].contextMenu;
                    this.currentContextMenu?.openMenu();
                }
            }
        }
    }

    public onContextMenuOpen(event: ContextMenuOpenEvent): void {
        if (this.currentContextMenu?.uid === event.uid) {
            return;
        }
        this.contextMenuComponents.forEach(c => {
            if (c.uid !== event.uid) {
                c.closeMenu();
            }
        });
        this.currentContextMenu = this.contextMenuComponents.find(c => c.uid === event.uid) ?? null;
        this.#cdr.detectChanges();
    }

    public onMenuClick(ctx: ContextMenuComponent): void {
        if (this.currentContextMenu?.uid === ctx.uid) {
            this.currentContextMenu.closeMenu();
            this.currentContextMenu = null;
            return;
        }
        this.contextMenuComponents.forEach(c => {
            if (c !== ctx) {
                c.closeMenu();
            }
        });
        this.currentContextMenu = ctx;
    }

    public onMenuMouseEnter(ctx: ContextMenuComponent): void {
        if (!this.currentContextMenu) {
            return;
        }
        if (this.currentContextMenu !== ctx) {
            this.currentContextMenu.closeMenu();
            this.currentContextMenu = ctx;
            this.currentContextMenu.openMenu();
            this.#cdr.detectChanges();
        }
    }

    private findNextNonDisabledMenuIndex(): number {
        const index = Enumerable.from(this.menuList)
            .toArray()
            .findIndex(n => n.contextMenu === this.currentContextMenu);
        if (index < 0) {
            return -1;
        }
        const list = new List(this.menuList.toArray());
        Collections.rotate(list, -index);
        const next = list.skip(1).firstOrDefault(m => !m.disabled());
        if (next) {
            return this.menuList.toArray().findIndex(m => m === next);
        }
        return -1;
    }

    private findPreviousNonDisabledMenuIndex(): number {
        const index = Enumerable.from(this.menuList)
            .toArray()
            .findIndex(n => n.contextMenu === this.currentContextMenu);
        if (index < 0) {
            return -1;
        }
        const list = new List(this.menuList.toArray());
        Collections.rotate(list, -index);
        const next = list.reverse().firstOrDefault(m => !m.disabled());
        if (next) {
            return this.menuList.toArray().findIndex(m => m === next);
        }
        return -1;
    }
}
