import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from "@angular/core";
import { MenuComponent } from "../menu/menu.component";
import { ContextMenuComponent } from "../../../context-menu/components/context-menu/context-menu.component";
import { ContextMenuCloseEvent } from "../../../context-menu/models/ContextMenuCloseEvent";
import { ContextMenuOpenEvent } from "../../../context-menu/models/ContextMenuOpenEvent";

@Component({
    selector: "mona-menubar",
    templateUrl: "./menubar.component.html",
    styleUrls: ["./menubar.component.scss"]
})
export class MenubarComponent implements OnInit, AfterViewInit {
    @ViewChildren(ContextMenuComponent)
    public readonly contextMenuComponents: QueryList<ContextMenuComponent> = new QueryList<ContextMenuComponent>();
    public currentContextMenu: ContextMenuComponent | null = null;

    @ContentChildren(MenuComponent)
    public menuList: QueryList<MenuComponent> = new QueryList<MenuComponent>();

    public constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.contextMenuComponents.forEach(c => c.setPrecise(false));
            this.cdr.detectChanges();
        });
    }
    public ngOnInit(): void {}

    public onContextMenuClose(event: ContextMenuCloseEvent): void {
        if (event.uid === this.currentContextMenu?.uid) {
            this.currentContextMenu = null;
            this.cdr.detectChanges();
        }
    }

    public onContextMenuOpen(event: ContextMenuOpenEvent): void {
        if (this.currentContextMenu?.uid !== event.uid) {
            this.contextMenuComponents.forEach(c => {
                if (c.uid !== event.uid) {
                    c.closeMenu();
                }
            });
        }
        this.currentContextMenu = this.contextMenuComponents.find(c => c.uid === event.uid) ?? null;
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
        }
    }
}
