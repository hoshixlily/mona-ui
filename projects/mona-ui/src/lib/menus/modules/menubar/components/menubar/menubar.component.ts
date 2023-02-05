import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren
} from "@angular/core";
import { MenuComponent } from "../menu/menu.component";
import { ContextMenuComponent } from "../../../context-menu/components/context-menu/context-menu.component";
import { ContextMenuCloseEvent } from "../../../context-menu/models/ContextMenuCloseEvent";
import { ContextMenuOpenEvent } from "../../../context-menu/models/ContextMenuOpenEvent";
import { ContextMenuNavigationEvent } from "../../../context-menu/models/ContextMenuNavigationEvent";
import { Enumerable } from "@mirei/ts-collections";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "mona-menubar",
    templateUrl: "./menubar.component.html",
    styleUrls: ["./menubar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenubarComponent implements OnInit, AfterViewInit, OnDestroy, AfterContentInit {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();

    @ViewChildren(ContextMenuComponent)
    public readonly contextMenuComponents: QueryList<ContextMenuComponent> = new QueryList<ContextMenuComponent>();
    public currentContextMenu: ContextMenuComponent | null = null;

    @ContentChildren(MenuComponent)
    public menuList: QueryList<MenuComponent> = new QueryList<MenuComponent>();

    public constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngAfterContentInit(): void {
        this.menuList.changes.pipe(takeUntil(this.componentDestroy$)).subscribe(() => {
            this.cdr.detectChanges();
            const menuComponent = this.menuList.find(m => m.contextMenu === this.currentContextMenu);
            if (!menuComponent) {
                this.currentContextMenu?.closeMenu();
                this.currentContextMenu = null;
            }
        });
    }

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.contextMenuComponents.forEach(c => c.setPrecise(false));
            this.cdr.detectChanges();
        });
        const pairContext = () => {
            Enumerable.from(this.menuList)
                .zip(Enumerable.from(this.contextMenuComponents))
                .forEach(([menu, context]) => {
                    menu.contextMenu = context;
                });
        };
        pairContext();
        this.contextMenuComponents.changes.pipe(takeUntil(this.componentDestroy$)).subscribe(() => {
            this.contextMenuComponents.forEach(c => c.setPrecise(false));
            this.cdr.detectChanges();
            pairContext();
        });
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {}

    public onContextMenuClose(event: ContextMenuCloseEvent): void {
        if (event.uid === this.currentContextMenu?.uid) {
            this.currentContextMenu = null;
            this.cdr.detectChanges();
        }
    }

    public onContextMenuNavigate(event: ContextMenuNavigationEvent): void {
        if (event.direction === "right") {
            if (event.currentItem == null) {
                const index = this.menuList.toArray().findIndex(n => n.contextMenu === this.currentContextMenu);
                if (index >= 0) {
                    const newIndex = index === this.menuList.length - 1 ? 0 : index + 1;
                    this.currentContextMenu?.closeMenu();
                    this.currentContextMenu = this.menuList.toArray()[newIndex].contextMenu;
                    this.currentContextMenu?.openMenu();
                }
            }
        } else if (event.direction === "left") {
            if (event.currentItem == null) {
                const index = this.menuList.toArray().findIndex(n => n.contextMenu === this.currentContextMenu);
                if (index >= 0) {
                    const newIndex = index === 0 ? this.menuList.length - 1 : index - 1;
                    this.currentContextMenu?.closeMenu();
                    this.currentContextMenu = this.menuList.toArray()[newIndex].contextMenu;
                    this.currentContextMenu?.openMenu();
                }
            }
        }
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
            this.cdr.detectChanges();
        }
    }
}
