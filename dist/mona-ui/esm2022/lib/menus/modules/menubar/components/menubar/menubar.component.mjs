import { ChangeDetectionStrategy, Component, ContentChildren, QueryList, ViewChildren } from "@angular/core";
import { MenuComponent } from "../menu/menu.component";
import { ContextMenuComponent } from "../../../context-menu/components/context-menu/context-menu.component";
import { Collections, Enumerable, List } from "@mirei/ts-collections";
import { Subject, takeUntil } from "rxjs";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../../../context-menu/components/context-menu/context-menu.component";
export class MenubarComponent {
    constructor(cdr) {
        this.cdr = cdr;
        this.componentDestroy$ = new Subject();
        this.contextMenuComponents = new QueryList();
        this.currentContextMenu = null;
        this.menuList = new QueryList();
    }
    ngAfterContentInit() {
        this.menuList.changes.pipe(takeUntil(this.componentDestroy$)).subscribe(event => {
            this.cdr.detectChanges();
            this.currentContextMenu?.closeMenu();
            this.currentContextMenu = null;
        });
    }
    ngAfterViewInit() {
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
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() { }
    onContextMenuClose(event) {
        if (event.uid === this.currentContextMenu?.uid) {
            this.currentContextMenu = null;
            this.cdr.detectChanges();
        }
    }
    onContextMenuNavigate(event) {
        if (event.direction === "right") {
            if (event.currentItem == null) {
                const index = this.findNextNonDisabledMenuIndex();
                if (index >= 0) {
                    this.currentContextMenu?.closeMenu();
                    this.currentContextMenu = this.menuList.toArray()[index].contextMenu;
                    this.currentContextMenu?.openMenu();
                }
            }
        }
        else if (event.direction === "left") {
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
    onContextMenuOpen(event) {
        if (this.currentContextMenu?.uid === event.uid) {
            return;
        }
        this.contextMenuComponents.forEach(c => {
            if (c.uid !== event.uid) {
                c.closeMenu();
            }
        });
        this.currentContextMenu = this.contextMenuComponents.find(c => c.uid === event.uid) ?? null;
        this.cdr.detectChanges();
    }
    onMenuClick(ctx) {
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
    onMenuMouseEnter(ctx) {
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
    findNextNonDisabledMenuIndex() {
        const index = Enumerable.from(this.menuList)
            .toArray()
            .findIndex(n => n.contextMenu === this.currentContextMenu);
        if (index < 0) {
            return -1;
        }
        const list = new List(this.menuList.toArray());
        Collections.rotate(list, -index);
        const next = list.skip(1).firstOrDefault(m => !m.disabled);
        if (next) {
            return this.menuList.toArray().findIndex(m => m === next);
        }
        return -1;
    }
    findPreviousNonDisabledMenuIndex() {
        const index = Enumerable.from(this.menuList)
            .toArray()
            .findIndex(n => n.contextMenu === this.currentContextMenu);
        if (index < 0) {
            return -1;
        }
        const list = new List(this.menuList.toArray());
        Collections.rotate(list, -index);
        const next = list.reverse().firstOrDefault(m => !m.disabled);
        if (next) {
            return this.menuList.toArray().findIndex(m => m === next);
        }
        return -1;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenubarComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MenubarComponent, selector: "mona-menubar", queries: [{ propertyName: "menuList", predicate: MenuComponent }], viewQueries: [{ propertyName: "contextMenuComponents", predicate: ContextMenuComponent, descendants: true }], ngImport: i0, template: "<ul class=\"mona-menubar\">\n    <ng-container *ngFor=\"let item of menuList\">\n        <li [attr.data-uid]=\"item.uid\" (click)=\"onMenuClick(contextMenuComponent)\" (mouseenter)=\"onMenuMouseEnter(contextMenuComponent)\"\n            [ngClass]=\"{'mona-active': currentContextMenu?.uid===contextMenuComponent.uid, 'mona-disabled': item.disabled}\" #listItemElement>\n            <span *ngIf=\"!item.textTemplate\">{{item.text}}</span>\n            <ng-container [ngTemplateOutlet]=\"item.textTemplate?.templateRef ?? null\" [ngTemplateOutletContext]=\"{$implicit: item.text, items: item.menuItems}\"\n                          *ngIf=\"!!item.textTemplate?.templateRef\"></ng-container>\n            <mona-contextmenu [target]=\"listItemElement\" [menuItems]=\"item.menuItems\" trigger=\"click\"\n                              (navigate)=\"onContextMenuNavigate($event)\"\n                              (close)=\"onContextMenuClose($event)\" (open)=\"onContextMenuOpen($event)\" #contextMenuComponent></mona-contextmenu>\n        </li>\n    </ng-container>\n</ul>\n", styles: ["ul.mona-menubar{width:100%;height:var(--mona-input-height);list-style:none;display:flex;align-items:center;cursor:default;-webkit-user-select:none;user-select:none}ul.mona-menubar li{height:100%;display:flex;align-items:center;justify-content:center;padding:0 10px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i2.ContextMenuComponent, selector: "mona-contextmenu", inputs: ["menuItems", "minWidth", "offset", "popupClass", "target", "trigger", "width"], outputs: ["close", "navigate", "open"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenubarComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-menubar", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ul class=\"mona-menubar\">\n    <ng-container *ngFor=\"let item of menuList\">\n        <li [attr.data-uid]=\"item.uid\" (click)=\"onMenuClick(contextMenuComponent)\" (mouseenter)=\"onMenuMouseEnter(contextMenuComponent)\"\n            [ngClass]=\"{'mona-active': currentContextMenu?.uid===contextMenuComponent.uid, 'mona-disabled': item.disabled}\" #listItemElement>\n            <span *ngIf=\"!item.textTemplate\">{{item.text}}</span>\n            <ng-container [ngTemplateOutlet]=\"item.textTemplate?.templateRef ?? null\" [ngTemplateOutletContext]=\"{$implicit: item.text, items: item.menuItems}\"\n                          *ngIf=\"!!item.textTemplate?.templateRef\"></ng-container>\n            <mona-contextmenu [target]=\"listItemElement\" [menuItems]=\"item.menuItems\" trigger=\"click\"\n                              (navigate)=\"onContextMenuNavigate($event)\"\n                              (close)=\"onContextMenuClose($event)\" (open)=\"onContextMenuOpen($event)\" #contextMenuComponent></mona-contextmenu>\n        </li>\n    </ng-container>\n</ul>\n", styles: ["ul.mona-menubar{width:100%;height:var(--mona-input-height);list-style:none;display:flex;align-items:center;cursor:default;-webkit-user-select:none;user-select:none}ul.mona-menubar li{height:100%;display:flex;align-items:center;justify-content:center;padding:0 10px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { contextMenuComponents: [{
                type: ViewChildren,
                args: [ContextMenuComponent]
            }], menuList: [{
                type: ContentChildren,
                args: [MenuComponent]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvbWVudXMvbW9kdWxlcy9tZW51YmFyL2NvbXBvbmVudHMvbWVudWJhci9tZW51YmFyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9tZW51cy9tb2R1bGVzL21lbnViYXIvY29tcG9uZW50cy9tZW51YmFyL21lbnViYXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdILHVCQUF1QixFQUV2QixTQUFTLEVBQ1QsZUFBZSxFQUdmLFNBQVMsRUFDVCxZQUFZLEVBQ2YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNFQUFzRSxDQUFDO0FBSTVHLE9BQU8sRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7O0FBUTFDLE1BQU0sT0FBTyxnQkFBZ0I7SUFVekIsWUFBb0MsR0FBc0I7UUFBdEIsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFUekMsc0JBQWlCLEdBQWtCLElBQUksT0FBTyxFQUFRLENBQUM7UUFHeEQsMEJBQXFCLEdBQW9DLElBQUksU0FBUyxFQUF3QixDQUFDO1FBQ3hHLHVCQUFrQixHQUFnQyxJQUFJLENBQUM7UUFHdkQsYUFBUSxHQUE2QixJQUFJLFNBQVMsRUFBaUIsQ0FBQztJQUVkLENBQUM7SUFFdkQsa0JBQWtCO1FBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxT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aEIsb0JBQW9CLGdEQzdCdEMsNmlDQWFBOzsyRkRhYSxnQkFBZ0I7a0JBTjVCLFNBQVM7K0JBQ0ksY0FBYyxtQkFHUCx1QkFBdUIsQ0FBQyxNQUFNO3dHQU0vQixxQkFBcUI7c0JBRHBDLFlBQVk7dUJBQUMsb0JBQW9CO2dCQUszQixRQUFRO3NCQURkLGVBQWU7dUJBQUMsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBBZnRlclZpZXdJbml0LFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgT25EZXN0cm95LFxuICAgIE9uSW5pdCxcbiAgICBRdWVyeUxpc3QsXG4gICAgVmlld0NoaWxkcmVuXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBNZW51Q29tcG9uZW50IH0gZnJvbSBcIi4uL21lbnUvbWVudS5jb21wb25lbnRcIjtcbmltcG9ydCB7IENvbnRleHRNZW51Q29tcG9uZW50IH0gZnJvbSBcIi4uLy4uLy4uL2NvbnRleHQtbWVudS9jb21wb25lbnRzL2NvbnRleHQtbWVudS9jb250ZXh0LW1lbnUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDb250ZXh0TWVudUNsb3NlRXZlbnQgfSBmcm9tIFwiLi4vLi4vLi4vY29udGV4dC1tZW51L21vZGVscy9Db250ZXh0TWVudUNsb3NlRXZlbnRcIjtcbmltcG9ydCB7IENvbnRleHRNZW51T3BlbkV2ZW50IH0gZnJvbSBcIi4uLy4uLy4uL2NvbnRleHQtbWVudS9tb2RlbHMvQ29udGV4dE1lbnVPcGVuRXZlbnRcIjtcbmltcG9ydCB7IENvbnRleHRNZW51TmF2aWdhdGlvbkV2ZW50IH0gZnJvbSBcIi4uLy4uLy4uL2NvbnRleHQtbWVudS9tb2RlbHMvQ29udGV4dE1lbnVOYXZpZ2F0aW9uRXZlbnRcIjtcbmltcG9ydCB7IENvbGxlY3Rpb25zLCBFbnVtZXJhYmxlLCBMaXN0IH0gZnJvbSBcIkBtaXJlaS90cy1jb2xsZWN0aW9uc1wiO1xuaW1wb3J0IHsgU3ViamVjdCwgdGFrZVVudGlsIH0gZnJvbSBcInJ4anNcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibW9uYS1tZW51YmFyXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9tZW51YmFyLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL21lbnViYXIuY29tcG9uZW50LnNjc3NcIl0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTWVudWJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBBZnRlckNvbnRlbnRJbml0IHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBvbmVudERlc3Ryb3kkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAgIEBWaWV3Q2hpbGRyZW4oQ29udGV4dE1lbnVDb21wb25lbnQpXG4gICAgcHVibGljIHJlYWRvbmx5IGNvbnRleHRNZW51Q29tcG9uZW50czogUXVlcnlMaXN0PENvbnRleHRNZW51Q29tcG9uZW50PiA9IG5ldyBRdWVyeUxpc3Q8Q29udGV4dE1lbnVDb21wb25lbnQ+KCk7XG4gICAgcHVibGljIGN1cnJlbnRDb250ZXh0TWVudTogQ29udGV4dE1lbnVDb21wb25lbnQgfCBudWxsID0gbnVsbDtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oTWVudUNvbXBvbmVudClcbiAgICBwdWJsaWMgbWVudUxpc3Q6IFF1ZXJ5TGlzdDxNZW51Q29tcG9uZW50PiA9IG5ldyBRdWVyeUxpc3Q8TWVudUNvbXBvbmVudD4oKTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLm1lbnVMaXN0LmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5jb21wb25lbnREZXN0cm95JCkpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb250ZXh0TWVudT8uY2xvc2VNZW51KCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb250ZXh0TWVudSA9IG51bGw7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnVDb21wb25lbnRzLmZvckVhY2goYyA9PiBjLnNldFByZWNpc2UoZmFsc2UpKTtcbiAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHBhaXJDb250ZXh0ID0gKCkgPT4ge1xuICAgICAgICAgICAgRW51bWVyYWJsZS5mcm9tKHRoaXMubWVudUxpc3QpXG4gICAgICAgICAgICAgICAgLnppcChFbnVtZXJhYmxlLmZyb20odGhpcy5jb250ZXh0TWVudUNvbXBvbmVudHMpKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChbbWVudSwgY29udGV4dF0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbWVudS5jb250ZXh0TWVudSA9IGNvbnRleHQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHBhaXJDb250ZXh0KCk7XG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVDb21wb25lbnRzLmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5jb21wb25lbnREZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51Q29tcG9uZW50cy5mb3JFYWNoKGMgPT4gYy5zZXRQcmVjaXNlKGZhbHNlKSk7XG4gICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICBwYWlyQ29udGV4dCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50RGVzdHJveSQubmV4dCgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudERlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge31cblxuICAgIHB1YmxpYyBvbkNvbnRleHRNZW51Q2xvc2UoZXZlbnQ6IENvbnRleHRNZW51Q2xvc2VFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoZXZlbnQudWlkID09PSB0aGlzLmN1cnJlbnRDb250ZXh0TWVudT8udWlkKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb250ZXh0TWVudSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgb25Db250ZXh0TWVudU5hdmlnYXRlKGV2ZW50OiBDb250ZXh0TWVudU5hdmlnYXRpb25FdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoZXZlbnQuZGlyZWN0aW9uID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5jdXJyZW50SXRlbSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmZpbmROZXh0Tm9uRGlzYWJsZWRNZW51SW5kZXgoKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDb250ZXh0TWVudT8uY2xvc2VNZW51KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudENvbnRleHRNZW51ID0gdGhpcy5tZW51TGlzdC50b0FycmF5KClbaW5kZXhdLmNvbnRleHRNZW51O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDb250ZXh0TWVudT8ub3Blbk1lbnUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGlyZWN0aW9uID09PSBcImxlZnRcIikge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmN1cnJlbnRJdGVtID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZmluZFByZXZpb3VzTm9uRGlzYWJsZWRNZW51SW5kZXgoKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDb250ZXh0TWVudT8uY2xvc2VNZW51KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudENvbnRleHRNZW51ID0gdGhpcy5tZW51TGlzdC50b0FycmF5KClbaW5kZXhdLmNvbnRleHRNZW51O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDb250ZXh0TWVudT8ub3Blbk1lbnUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgb25Db250ZXh0TWVudU9wZW4oZXZlbnQ6IENvbnRleHRNZW51T3BlbkV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRDb250ZXh0TWVudT8udWlkID09PSBldmVudC51aWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRleHRNZW51Q29tcG9uZW50cy5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgaWYgKGMudWlkICE9PSBldmVudC51aWQpIHtcbiAgICAgICAgICAgICAgICBjLmNsb3NlTWVudSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jdXJyZW50Q29udGV4dE1lbnUgPSB0aGlzLmNvbnRleHRNZW51Q29tcG9uZW50cy5maW5kKGMgPT4gYy51aWQgPT09IGV2ZW50LnVpZCkgPz8gbnVsbDtcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbk1lbnVDbGljayhjdHg6IENvbnRleHRNZW51Q29tcG9uZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRDb250ZXh0TWVudT8udWlkID09PSBjdHgudWlkKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb250ZXh0TWVudS5jbG9zZU1lbnUoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENvbnRleHRNZW51ID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRleHRNZW51Q29tcG9uZW50cy5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgaWYgKGMgIT09IGN0eCkge1xuICAgICAgICAgICAgICAgIGMuY2xvc2VNZW51KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmN1cnJlbnRDb250ZXh0TWVudSA9IGN0eDtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25NZW51TW91c2VFbnRlcihjdHg6IENvbnRleHRNZW51Q29tcG9uZW50KTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5jdXJyZW50Q29udGV4dE1lbnUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q29udGV4dE1lbnUgIT09IGN0eCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29udGV4dE1lbnUuY2xvc2VNZW51KCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDb250ZXh0TWVudSA9IGN0eDtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENvbnRleHRNZW51Lm9wZW5NZW51KCk7XG4gICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmROZXh0Tm9uRGlzYWJsZWRNZW51SW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBFbnVtZXJhYmxlLmZyb20odGhpcy5tZW51TGlzdClcbiAgICAgICAgICAgIC50b0FycmF5KClcbiAgICAgICAgICAgIC5maW5kSW5kZXgobiA9PiBuLmNvbnRleHRNZW51ID09PSB0aGlzLmN1cnJlbnRDb250ZXh0TWVudSk7XG4gICAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsaXN0ID0gbmV3IExpc3QodGhpcy5tZW51TGlzdC50b0FycmF5KCkpO1xuICAgICAgICBDb2xsZWN0aW9ucy5yb3RhdGUobGlzdCwgLWluZGV4KTtcbiAgICAgICAgY29uc3QgbmV4dCA9IGxpc3Quc2tpcCgxKS5maXJzdE9yRGVmYXVsdChtID0+ICFtLmRpc2FibGVkKTtcbiAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1lbnVMaXN0LnRvQXJyYXkoKS5maW5kSW5kZXgobSA9PiBtID09PSBuZXh0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kUHJldmlvdXNOb25EaXNhYmxlZE1lbnVJbmRleCgpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBpbmRleCA9IEVudW1lcmFibGUuZnJvbSh0aGlzLm1lbnVMaXN0KVxuICAgICAgICAgICAgLnRvQXJyYXkoKVxuICAgICAgICAgICAgLmZpbmRJbmRleChuID0+IG4uY29udGV4dE1lbnUgPT09IHRoaXMuY3VycmVudENvbnRleHRNZW51KTtcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxpc3QgPSBuZXcgTGlzdCh0aGlzLm1lbnVMaXN0LnRvQXJyYXkoKSk7XG4gICAgICAgIENvbGxlY3Rpb25zLnJvdGF0ZShsaXN0LCAtaW5kZXgpO1xuICAgICAgICBjb25zdCBuZXh0ID0gbGlzdC5yZXZlcnNlKCkuZmlyc3RPckRlZmF1bHQobSA9PiAhbS5kaXNhYmxlZCk7XG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tZW51TGlzdC50b0FycmF5KCkuZmluZEluZGV4KG0gPT4gbSA9PT0gbmV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbn1cbiIsIjx1bCBjbGFzcz1cIm1vbmEtbWVudWJhclwiPlxuICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGl0ZW0gb2YgbWVudUxpc3RcIj5cbiAgICAgICAgPGxpIFthdHRyLmRhdGEtdWlkXT1cIml0ZW0udWlkXCIgKGNsaWNrKT1cIm9uTWVudUNsaWNrKGNvbnRleHRNZW51Q29tcG9uZW50KVwiIChtb3VzZWVudGVyKT1cIm9uTWVudU1vdXNlRW50ZXIoY29udGV4dE1lbnVDb21wb25lbnQpXCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsnbW9uYS1hY3RpdmUnOiBjdXJyZW50Q29udGV4dE1lbnU/LnVpZD09PWNvbnRleHRNZW51Q29tcG9uZW50LnVpZCwgJ21vbmEtZGlzYWJsZWQnOiBpdGVtLmRpc2FibGVkfVwiICNsaXN0SXRlbUVsZW1lbnQ+XG4gICAgICAgICAgICA8c3BhbiAqbmdJZj1cIiFpdGVtLnRleHRUZW1wbGF0ZVwiPnt7aXRlbS50ZXh0fX08L3NwYW4+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIml0ZW0udGV4dFRlbXBsYXRlPy50ZW1wbGF0ZVJlZiA/PyBudWxsXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IGl0ZW0udGV4dCwgaXRlbXM6IGl0ZW0ubWVudUl0ZW1zfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICpuZ0lmPVwiISFpdGVtLnRleHRUZW1wbGF0ZT8udGVtcGxhdGVSZWZcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDxtb25hLWNvbnRleHRtZW51IFt0YXJnZXRdPVwibGlzdEl0ZW1FbGVtZW50XCIgW21lbnVJdGVtc109XCJpdGVtLm1lbnVJdGVtc1wiIHRyaWdnZXI9XCJjbGlja1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmF2aWdhdGUpPVwib25Db250ZXh0TWVudU5hdmlnYXRlKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsb3NlKT1cIm9uQ29udGV4dE1lbnVDbG9zZSgkZXZlbnQpXCIgKG9wZW4pPVwib25Db250ZXh0TWVudU9wZW4oJGV2ZW50KVwiICNjb250ZXh0TWVudUNvbXBvbmVudD48L21vbmEtY29udGV4dG1lbnU+XG4gICAgICAgIDwvbGk+XG4gICAgPC9uZy1jb250YWluZXI+XG48L3VsPlxuIl19