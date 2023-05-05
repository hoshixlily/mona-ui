import { Component, ContentChildren, EventEmitter, Input, Output, QueryList } from "@angular/core";
import { ContextMenuContentComponent } from "../context-menu-content/context-menu-content.component";
import { Subject, take, takeUntil } from "rxjs";
import { MenuItemComponent } from "../../../shared-menu/components/menu-item/menu-item.component";
import { v4 } from "uuid";
import * as i0 from "@angular/core";
import * as i1 from "../../services/context-menu.service";
export class ContextMenuComponent {
    constructor(contextMenuService, elementRef, renderer, zone) {
        this.contextMenuService = contextMenuService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.zone = zone;
        this.componentDestroy$ = new Subject();
        this.contextMenuInjectorData = { isRoot: true };
        this.contextMenuRef = null;
        this.menuClickNotifier = new Subject();
        this.precise = true;
        this.targetListener = () => void 0;
        this.windowEventListenerRefs = [];
        this.uid = v4();
        this.close = new EventEmitter();
        this.menuItemComponents = new QueryList();
        this.menuItems = [];
        this.navigate = new EventEmitter();
        this.open = new EventEmitter();
        this.popupClass = [];
        this.trigger = "contextmenu";
    }
    closeMenu() {
        this.contextMenuRef?.close();
    }
    ngAfterContentInit() {
        if (this.menuItems.length !== 0) {
            return;
        }
        this.menuItems = this.menuItemComponents.map(m => m.getMenuItem()) ?? [];
    }
    ngOnDestroy() {
        this.targetListener?.();
        this.windowEventListenerRefs.forEach(ref => ref());
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() {
        this.setEventListeners();
    }
    openMenu() {
        this.create(new MouseEvent("click"));
    }
    setPrecise(precise) {
        this.precise = precise;
    }
    create(event) {
        this.contextMenuInjectorData.menuClick = this.menuClickNotifier;
        this.contextMenuInjectorData.menuItems = this.menuItems;
        this.contextMenuInjectorData.navigate = this.navigate;
        this.contextMenuInjectorData.popupClass = this.popupClass;
        this.contextMenuRef = this.contextMenuService.open({
            anchor: this.precise ? { x: event.x, y: event.y } : this.target,
            closeOnOutsideClick: true,
            content: ContextMenuContentComponent,
            data: this.contextMenuInjectorData,
            minWidth: this.minWidth,
            offset: this.offset,
            popupClass: Array.isArray(this.popupClass)
                ? ["mona-contextmenu-content", ...this.popupClass]
                : ["mona-contextmenu-content", this.popupClass],
            width: this.width
        });
        this.contextMenuInjectorData.parentMenuRef = this.contextMenuRef;
        this.open.emit({ uid: this.uid, popupRef: this.contextMenuRef });
        this.contextMenuRef.closed
            .pipe(take(1))
            .subscribe(() => this.close.emit({ uid: this.uid, popupRef: this.contextMenuRef }));
    }
    onOutsideClick(event) {
        if (!this.contextMenuRef) {
            return;
        }
        if (this.contextMenuRef.overlayRef.overlayElement?.contains(event.target)) {
            return;
        }
        this.contextMenuRef.close();
    }
    setEventListeners() {
        this.zone.runOutsideAngular(() => {
            this.targetListener = this.renderer.listen(this.target, this.trigger, (event) => {
                event.stopPropagation();
                event.preventDefault();
                this.zone.run(() => {
                    this.create(event);
                });
            });
            this.windowEventListenerRefs = [
                this.renderer.listen(window, "click", this.onOutsideClick.bind(this)),
                this.renderer.listen(window, "contextmenu", this.onOutsideClick.bind(this)),
                this.renderer.listen(window, "auxclick", this.onOutsideClick.bind(this)),
                this.renderer.listen(window, "keydown.esc", () => this.contextMenuRef?.close())
            ];
        });
        this.menuClickNotifier.pipe(takeUntil(this.componentDestroy$)).subscribe(() => {
            this.contextMenuRef?.close();
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuComponent, deps: [{ token: i1.ContextMenuService }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ContextMenuComponent, selector: "mona-contextmenu", inputs: { menuItems: "menuItems", minWidth: "minWidth", offset: "offset", popupClass: "popupClass", target: "target", trigger: "trigger", width: "width" }, outputs: { close: "close", navigate: "navigate", open: "open" }, queries: [{ propertyName: "menuItemComponents", predicate: MenuItemComponent }], ngImport: i0, template: "", styles: [""] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-contextmenu", template: "" }]
        }], ctorParameters: function () { return [{ type: i1.ContextMenuService }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }]; }, propDecorators: { close: [{
                type: Output
            }], menuItemComponents: [{
                type: ContentChildren,
                args: [MenuItemComponent]
            }], menuItems: [{
                type: Input
            }], minWidth: [{
                type: Input
            }], navigate: [{
                type: Output
            }], offset: [{
                type: Input
            }], open: [{
                type: Output
            }], popupClass: [{
                type: Input
            }], target: [{
                type: Input
            }], trigger: [{
                type: Input
            }], width: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9tZW51cy9tb2R1bGVzL2NvbnRleHQtbWVudS9jb21wb25lbnRzL2NvbnRleHQtbWVudS9jb250ZXh0LW1lbnUuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL21lbnVzL21vZHVsZXMvY29udGV4dC1tZW51L2NvbXBvbmVudHMvY29udGV4dC1tZW51L2NvbnRleHQtbWVudS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUgsU0FBUyxFQUNULGVBQWUsRUFFZixZQUFZLEVBQ1osS0FBSyxFQUlMLE1BQU0sRUFDTixTQUFTLEVBRVosTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFJckcsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRWhELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLCtEQUErRCxDQUFDO0FBRWxHLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7OztBQVMxQixNQUFNLE9BQU8sb0JBQW9CO0lBMkM3QixZQUNxQixrQkFBc0MsRUFDdEMsVUFBc0IsRUFDdEIsUUFBbUIsRUFDNUIsSUFBWTtRQUhILHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQzVCLFNBQUksR0FBSixJQUFJLENBQVE7UUE5Q1Asc0JBQWlCLEdBQWtCLElBQUksT0FBTyxFQUFRLENBQUM7UUFDaEUsNEJBQXVCLEdBQXFDLEVBQUUsTUFB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OEdBdElRLG9CQUFvQjtrR0FBcEIsb0JBQW9CLHdUQWFaLGlCQUFpQiw2QkM5Q3RDLEVBQUE7OzJGRGlDYSxvQkFBb0I7a0JBTGhDLFNBQVM7K0JBQ0ksa0JBQWtCOytLQWVyQixLQUFLO3NCQURYLE1BQU07Z0JBSUEsa0JBQWtCO3NCQUR4QixlQUFlO3VCQUFDLGlCQUFpQjtnQkFJM0IsU0FBUztzQkFEZixLQUFLO2dCQUlDLFFBQVE7c0JBRGQsS0FBSztnQkFJQyxRQUFRO3NCQURkLE1BQU07Z0JBSUEsTUFBTTtzQkFEWixLQUFLO2dCQUlDLElBQUk7c0JBRFYsTUFBTTtnQkFJQSxVQUFVO3NCQURoQixLQUFLO2dCQUlDLE1BQU07c0JBRFosS0FBSztnQkFJQyxPQUFPO3NCQURiLEtBQUs7Z0JBSUMsS0FBSztzQkFEWCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSW5wdXQsXG4gICAgTmdab25lLFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkluaXQsXG4gICAgT3V0cHV0LFxuICAgIFF1ZXJ5TGlzdCxcbiAgICBSZW5kZXJlcjJcbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneU9yaWdpbiB9IGZyb20gXCJAYW5ndWxhci9jZGsvb3ZlcmxheVwiO1xuaW1wb3J0IHsgQ29udGV4dE1lbnVTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2VzL2NvbnRleHQtbWVudS5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBDb250ZXh0TWVudUNvbnRlbnRDb21wb25lbnQgfSBmcm9tIFwiLi4vY29udGV4dC1tZW51LWNvbnRlbnQvY29udGV4dC1tZW51LWNvbnRlbnQuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBNZW51SXRlbSB9IGZyb20gXCIuLi8uLi9tb2RlbHMvTWVudUl0ZW1cIjtcbmltcG9ydCB7IENvbnRleHRNZW51SW5qZWN0b3JEYXRhIH0gZnJvbSBcIi4uLy4uL21vZGVscy9Db250ZXh0TWVudUluamVjdG9yRGF0YVwiO1xuaW1wb3J0IHsgUG9wdXBSZWYgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vcG9wdXAvbW9kZWxzL1BvcHVwUmVmXCI7XG5pbXBvcnQgeyBTdWJqZWN0LCB0YWtlLCB0YWtlVW50aWwgfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgUG9wdXBPZmZzZXQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vcG9wdXAvbW9kZWxzL1BvcHVwT2Zmc2V0XCI7XG5pbXBvcnQgeyBNZW51SXRlbUNvbXBvbmVudCB9IGZyb20gXCIuLi8uLi8uLi9zaGFyZWQtbWVudS9jb21wb25lbnRzL21lbnUtaXRlbS9tZW51LWl0ZW0uY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDb250ZXh0TWVudUNsb3NlRXZlbnQgfSBmcm9tIFwiLi4vLi4vbW9kZWxzL0NvbnRleHRNZW51Q2xvc2VFdmVudFwiO1xuaW1wb3J0IHsgdjQgfSBmcm9tIFwidXVpZFwiO1xuaW1wb3J0IHsgQ29udGV4dE1lbnVPcGVuRXZlbnQgfSBmcm9tIFwiLi4vLi4vbW9kZWxzL0NvbnRleHRNZW51T3BlbkV2ZW50XCI7XG5pbXBvcnQgeyBDb250ZXh0TWVudU5hdmlnYXRpb25FdmVudCB9IGZyb20gXCIuLi8uLi9tb2RlbHMvQ29udGV4dE1lbnVOYXZpZ2F0aW9uRXZlbnRcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibW9uYS1jb250ZXh0bWVudVwiLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vY29udGV4dC1tZW51LmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL2NvbnRleHQtbWVudS5jb21wb25lbnQuc2Nzc1wiXVxufSlcbmV4cG9ydCBjbGFzcyBDb250ZXh0TWVudUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlckNvbnRlbnRJbml0IHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBvbmVudERlc3Ryb3kkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICBwcml2YXRlIGNvbnRleHRNZW51SW5qZWN0b3JEYXRhOiBQYXJ0aWFsPENvbnRleHRNZW51SW5qZWN0b3JEYXRhPiA9IHsgaXNSb290OiB0cnVlIH07XG4gICAgcHJpdmF0ZSBjb250ZXh0TWVudVJlZjogUG9wdXBSZWYgfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIG1lbnVDbGlja05vdGlmaWVyOiBTdWJqZWN0PE1lbnVJdGVtPiA9IG5ldyBTdWJqZWN0PE1lbnVJdGVtPigpO1xuICAgIHByaXZhdGUgcHJlY2lzZTogYm9vbGVhbiA9IHRydWU7XG4gICAgcHJpdmF0ZSB0YXJnZXRMaXN0ZW5lcjogKCkgPT4gdm9pZCA9ICgpID0+IHZvaWQgMDtcbiAgICBwcml2YXRlIHdpbmRvd0V2ZW50TGlzdGVuZXJSZWZzOiBBcnJheTwoKSA9PiB2b2lkPiA9IFtdO1xuICAgIHB1YmxpYyByZWFkb25seSB1aWQ6IHN0cmluZyA9IHY0KCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2xvc2U6IEV2ZW50RW1pdHRlcjxDb250ZXh0TWVudUNsb3NlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxDb250ZXh0TWVudUNsb3NlRXZlbnQ+KCk7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKE1lbnVJdGVtQ29tcG9uZW50KVxuICAgIHB1YmxpYyBtZW51SXRlbUNvbXBvbmVudHM6IFF1ZXJ5TGlzdDxNZW51SXRlbUNvbXBvbmVudD4gPSBuZXcgUXVlcnlMaXN0PE1lbnVJdGVtQ29tcG9uZW50PigpO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbWVudUl0ZW1zOiBNZW51SXRlbVtdID0gW107XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBtaW5XaWR0aD86IG51bWJlciB8IHN0cmluZztcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBuYXZpZ2F0ZTogRXZlbnRFbWl0dGVyPENvbnRleHRNZW51TmF2aWdhdGlvbkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8Q29udGV4dE1lbnVOYXZpZ2F0aW9uRXZlbnQ+KCk7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBvZmZzZXQ/OiBQb3B1cE9mZnNldDtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBvcGVuOiBFdmVudEVtaXR0ZXI8Q29udGV4dE1lbnVPcGVuRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxDb250ZXh0TWVudU9wZW5FdmVudD4oKTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHBvcHVwQ2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdID0gW107XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0YXJnZXQhOiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3lPcmlnaW47XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0cmlnZ2VyOiBzdHJpbmcgPSBcImNvbnRleHRtZW51XCI7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB3aWR0aD86IG51bWJlciB8IHN0cmluZztcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjb250ZXh0TWVudVNlcnZpY2U6IENvbnRleHRNZW51U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgIHByaXZhdGUgem9uZTogTmdab25lXG4gICAgKSB7fVxuXG4gICAgcHVibGljIGNsb3NlTWVudSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudVJlZj8uY2xvc2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5tZW51SXRlbXMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tZW51SXRlbXMgPSB0aGlzLm1lbnVJdGVtQ29tcG9uZW50cy5tYXAobSA9PiBtLmdldE1lbnVJdGVtKCkpID8/IFtdO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50YXJnZXRMaXN0ZW5lcj8uKCk7XG4gICAgICAgIHRoaXMud2luZG93RXZlbnRMaXN0ZW5lclJlZnMuZm9yRWFjaChyZWYgPT4gcmVmKCkpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudERlc3Ryb3kkLm5leHQoKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnREZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRFdmVudExpc3RlbmVycygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvcGVuTWVudSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jcmVhdGUobmV3IE1vdXNlRXZlbnQoXCJjbGlja1wiKSBhcyBQb2ludGVyRXZlbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRQcmVjaXNlKHByZWNpc2U6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcmVjaXNlID0gcHJlY2lzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZShldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVJbmplY3RvckRhdGEubWVudUNsaWNrID0gdGhpcy5tZW51Q2xpY2tOb3RpZmllcjtcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudUluamVjdG9yRGF0YS5tZW51SXRlbXMgPSB0aGlzLm1lbnVJdGVtcztcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudUluamVjdG9yRGF0YS5uYXZpZ2F0ZSA9IHRoaXMubmF2aWdhdGU7XG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVJbmplY3RvckRhdGEucG9wdXBDbGFzcyA9IHRoaXMucG9wdXBDbGFzcztcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudVJlZiA9IHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLm9wZW4oe1xuICAgICAgICAgICAgYW5jaG9yOiB0aGlzLnByZWNpc2UgPyB7IHg6IGV2ZW50LngsIHk6IGV2ZW50LnkgfSA6IHRoaXMudGFyZ2V0LFxuICAgICAgICAgICAgY2xvc2VPbk91dHNpZGVDbGljazogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRlbnQ6IENvbnRleHRNZW51Q29udGVudENvbXBvbmVudCxcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuY29udGV4dE1lbnVJbmplY3RvckRhdGEsXG4gICAgICAgICAgICBtaW5XaWR0aDogdGhpcy5taW5XaWR0aCxcbiAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICBwb3B1cENsYXNzOiBBcnJheS5pc0FycmF5KHRoaXMucG9wdXBDbGFzcylcbiAgICAgICAgICAgICAgICA/IFtcIm1vbmEtY29udGV4dG1lbnUtY29udGVudFwiLCAuLi50aGlzLnBvcHVwQ2xhc3NdXG4gICAgICAgICAgICAgICAgOiBbXCJtb25hLWNvbnRleHRtZW51LWNvbnRlbnRcIiwgdGhpcy5wb3B1cENsYXNzXSxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNvbnRleHRNZW51SW5qZWN0b3JEYXRhLnBhcmVudE1lbnVSZWYgPSB0aGlzLmNvbnRleHRNZW51UmVmO1xuICAgICAgICB0aGlzLm9wZW4uZW1pdCh7IHVpZDogdGhpcy51aWQsIHBvcHVwUmVmOiB0aGlzLmNvbnRleHRNZW51UmVmIGFzIFBvcHVwUmVmIH0pO1xuICAgICAgICB0aGlzLmNvbnRleHRNZW51UmVmLmNsb3NlZFxuICAgICAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZS5lbWl0KHsgdWlkOiB0aGlzLnVpZCwgcG9wdXBSZWY6IHRoaXMuY29udGV4dE1lbnVSZWYgYXMgUG9wdXBSZWYgfSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25PdXRzaWRlQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRleHRNZW51UmVmKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29udGV4dE1lbnVSZWYub3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudD8uY29udGFpbnMoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGV4dE1lbnVSZWYuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50YXJnZXRMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMudGFyZ2V0LCB0aGlzLnRyaWdnZXIsIChldmVudDogUG9pbnRlckV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGUoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLndpbmRvd0V2ZW50TGlzdGVuZXJSZWZzID0gW1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHdpbmRvdywgXCJjbGlja1wiLCB0aGlzLm9uT3V0c2lkZUNsaWNrLmJpbmQodGhpcykpLFxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHdpbmRvdywgXCJjb250ZXh0bWVudVwiLCB0aGlzLm9uT3V0c2lkZUNsaWNrLmJpbmQodGhpcykpLFxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHdpbmRvdywgXCJhdXhjbGlja1wiLCB0aGlzLm9uT3V0c2lkZUNsaWNrLmJpbmQodGhpcykpLFxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHdpbmRvdywgXCJrZXlkb3duLmVzY1wiLCAoKSA9PiB0aGlzLmNvbnRleHRNZW51UmVmPy5jbG9zZSgpKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5tZW51Q2xpY2tOb3RpZmllci5waXBlKHRha2VVbnRpbCh0aGlzLmNvbXBvbmVudERlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnVSZWY/LmNsb3NlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsIiJdfQ==