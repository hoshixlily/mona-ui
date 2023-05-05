import { Component, ContentChild, ElementRef, EventEmitter, Input, Output, TemplateRef } from "@angular/core";
import * as i0 from "@angular/core";
import * as i1 from "../../services/popup.service";
export class PopupComponent {
    constructor(popupService, renderer, zone) {
        this.popupService = popupService;
        this.renderer = renderer;
        this.zone = zone;
        this.popupOpened = false;
        this.popupRef = null;
        this.popupTriggerListener = () => void 0;
        this.close = new EventEmitter();
        this.closeOnEscape = true;
        this.open = new EventEmitter();
        this.popupClass = [];
        this.trigger = "click";
    }
    ngAfterViewInit() {
        if (!this.contentTemplate) {
            throw new Error(`${PopupComponent.name} requires contentTemplate`);
        }
        window.setTimeout(() => {
            this.setEventListeners();
        });
    }
    ngOnDestroy() {
        this.popupRef?.close();
    }
    ngOnInit() {
        if (!this.anchor) {
            throw new Error(`${PopupComponent.name} requires anchor`);
        }
    }
    setEventListeners() {
        this.zone.runOutsideAngular(() => {
            let pointAnchor = false;
            let target;
            if (this.anchor instanceof ElementRef) {
                target = this.anchor.nativeElement;
            }
            else if (this.anchor instanceof HTMLElement) {
                target = this.anchor;
            }
            else {
                target = document.body;
                pointAnchor = true;
            }
            const width = this.width ??
                (this.anchor instanceof HTMLElement
                    ? this.anchor.offsetWidth
                    : this.anchor instanceof ElementRef
                        ? this.anchor.nativeElement.offsetWidth
                        : undefined);
            this.popupTriggerListener = this.renderer.listen(target, this.trigger, (event) => {
                event.preventDefault();
                if (this.popupOpened) {
                    this.popupOpened = false;
                    return;
                }
                this.zone.run(() => {
                    const popupSettings = {
                        anchor: this.anchor,
                        closeOnEscape: this.closeOnEscape,
                        content: this.contentTemplate,
                        hasBackdrop: false,
                        height: this.height,
                        maxHeight: this.maxHeight,
                        maxWidth: this.maxWidth,
                        minHeight: this.minHeight,
                        minWidth: this.minWidth,
                        offset: this.offset,
                        popupClass: this.popupClass,
                        width
                    };
                    this.popupRef = this.popupService.create(popupSettings);
                    const subscription = this.popupRef.closed.subscribe(result => {
                        this.popupRef = null;
                        this.close.emit();
                        subscription.unsubscribe();
                        if (result instanceof PointerEvent && result.type === this.trigger) {
                            this.popupOpened =
                                target instanceof HTMLElement && target.contains(result.target);
                        }
                        else if (result instanceof PointerEvent && pointAnchor && result.type !== this.trigger) {
                            this.popupOpened = false;
                        }
                    });
                    if (pointAnchor) {
                        this.popupOpened = true;
                    }
                    this.open.emit(this.popupRef);
                });
            });
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupComponent, deps: [{ token: i1.PopupService }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: PopupComponent, selector: "mona-popup", inputs: { anchor: "anchor", closeOnEscape: "closeOnEscape", height: "height", maxHeight: "maxHeight", maxWidth: "maxWidth", minHeight: "minHeight", minWidth: "minWidth", offset: "offset", popupClass: "popupClass", trigger: "trigger", width: "width" }, outputs: { close: "close", open: "open" }, queries: [{ propertyName: "contentTemplate", first: true, predicate: TemplateRef, descendants: true }], ngImport: i0, template: "<ng-content></ng-content>\n", styles: [""] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-popup", template: "<ng-content></ng-content>\n" }]
        }], ctorParameters: function () { return [{ type: i1.PopupService }, { type: i0.Renderer2 }, { type: i0.NgZone }]; }, propDecorators: { anchor: [{
                type: Input
            }], close: [{
                type: Output
            }], closeOnEscape: [{
                type: Input
            }], contentTemplate: [{
                type: ContentChild,
                args: [TemplateRef]
            }], height: [{
                type: Input
            }], maxHeight: [{
                type: Input
            }], maxWidth: [{
                type: Input
            }], minHeight: [{
                type: Input
            }], minWidth: [{
                type: Input
            }], offset: [{
                type: Input
            }], open: [{
                type: Output
            }], popupClass: [{
                type: Input
            }], trigger: [{
                type: Input
            }], width: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL3BvcHVwL2NvbXBvbmVudHMvcG9wdXAvcG9wdXAuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL3BvcHVwL2NvbXBvbmVudHMvcG9wdXAvcG9wdXAuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVILFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBSUwsTUFBTSxFQUVOLFdBQVcsRUFDZCxNQUFNLGVBQWUsQ0FBQzs7O0FBWXZCLE1BQU0sT0FBTyxjQUFjO0lBK0N2QixZQUNxQixZQUEwQixFQUMxQixRQUFtQixFQUNuQixJQUFZO1FBRlosaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBakR6QixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUM3QixhQUFRLEdBQW9CLElBQUksQ0FBQztRQUNqQyx5QkFBb0IsR0FBMkIsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFNN0QsVUFBSyxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBR3JELGtCQUFhLEdBQVksSUFBSSxDQUFDO1FBd0I5QixTQUFJLEdBQTJCLElBQUksWUFBWSxFQUFZLENBQUM7UUFHNUQsZUFBVSxHQUFzQixFQUFFLENBQUM7UUFHbkMsWUFBTyxHQUFXLE9BQU8sQ0FBQztJQVM5QixDQUFDO0lBRUcsZUFBZTtRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsY0FBYyxDQUFDLElBQUksMkJBQTJCLENBQUMsQ0FBQztTQUN0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QkFEYixLQUFLO2dCQUlDLEtBQUs7c0JBRFgsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBDb21wb25lbnQsXG4gICAgQ29udGVudENoaWxkLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIElucHV0LFxuICAgIE5nWm9uZSxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIE91dHB1dCxcbiAgICBSZW5kZXJlcjIsXG4gICAgVGVtcGxhdGVSZWZcbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFBvcHVwUmVmIH0gZnJvbSBcIi4uLy4uL21vZGVscy9Qb3B1cFJlZlwiO1xuaW1wb3J0IHsgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5T3JpZ2luIH0gZnJvbSBcIkBhbmd1bGFyL2Nkay9vdmVybGF5XCI7XG5pbXBvcnQgeyBQb3B1cFNldHRpbmdzIH0gZnJvbSBcIi4uLy4uL21vZGVscy9Qb3B1cFNldHRpbmdzXCI7XG5pbXBvcnQgeyBQb3B1cE9mZnNldCB9IGZyb20gXCIuLi8uLi9tb2RlbHMvUG9wdXBPZmZzZXRcIjtcbmltcG9ydCB7IFBvcHVwU2VydmljZSB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlcy9wb3B1cC5zZXJ2aWNlXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm1vbmEtcG9wdXBcIixcbiAgICB0ZW1wbGF0ZVVybDogXCIuL3BvcHVwLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL3BvcHVwLmNvbXBvbmVudC5zY3NzXCJdXG59KVxuZXhwb3J0IGNsYXNzIFBvcHVwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICAgIHByaXZhdGUgcG9wdXBPcGVuZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIHBvcHVwUmVmOiBQb3B1cFJlZiB8IG51bGwgPSBudWxsO1xuICAgIHByaXZhdGUgcG9wdXBUcmlnZ2VyTGlzdGVuZXI6IChldmVudDogRXZlbnQpID0+IHZvaWQgPSAoKSA9PiB2b2lkIDA7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBhbmNob3IhOiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3lPcmlnaW47XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2xvc2U6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGNsb3NlT25Fc2NhcGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZilcbiAgICBwdWJsaWMgY29udGVudFRlbXBsYXRlITogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGhlaWdodD86IG51bWJlciB8IHN0cmluZztcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG1heEhlaWdodD86IG51bWJlciB8IHN0cmluZztcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG1heFdpZHRoPzogbnVtYmVyIHwgc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbWluSGVpZ2h0PzogbnVtYmVyIHwgc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbWluV2lkdGg/OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBvZmZzZXQ/OiBQb3B1cE9mZnNldDtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBvcGVuOiBFdmVudEVtaXR0ZXI8UG9wdXBSZWY+ID0gbmV3IEV2ZW50RW1pdHRlcjxQb3B1cFJlZj4oKTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHBvcHVwQ2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdID0gW107XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0cmlnZ2VyOiBzdHJpbmcgPSBcImNsaWNrXCI7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB3aWR0aD86IG51bWJlciB8IHN0cmluZztcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBwb3B1cFNlcnZpY2U6IFBvcHVwU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHpvbmU6IE5nWm9uZVxuICAgICkge31cblxuICAgIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5jb250ZW50VGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtQb3B1cENvbXBvbmVudC5uYW1lfSByZXF1aXJlcyBjb250ZW50VGVtcGxhdGVgKTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wb3B1cFJlZj8uY2xvc2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5hbmNob3IpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtQb3B1cENvbXBvbmVudC5uYW1lfSByZXF1aXJlcyBhbmNob3JgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0RXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICBsZXQgcG9pbnRBbmNob3IgPSBmYWxzZTtcbiAgICAgICAgICAgIGxldCB0YXJnZXQ6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneU9yaWdpbjtcbiAgICAgICAgICAgIGlmICh0aGlzLmFuY2hvciBpbnN0YW5jZW9mIEVsZW1lbnRSZWYpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSB0aGlzLmFuY2hvci5uYXRpdmVFbGVtZW50O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFuY2hvciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGhpcy5hbmNob3I7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldCA9IGRvY3VtZW50LmJvZHk7XG4gICAgICAgICAgICAgICAgcG9pbnRBbmNob3IgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgd2lkdGggPVxuICAgICAgICAgICAgICAgIHRoaXMud2lkdGggPz9cbiAgICAgICAgICAgICAgICAodGhpcy5hbmNob3IgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMuYW5jaG9yLm9mZnNldFdpZHRoXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5hbmNob3IgaW5zdGFuY2VvZiBFbGVtZW50UmVmXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5hbmNob3IubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aFxuICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB0aGlzLnBvcHVwVHJpZ2dlckxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGFyZ2V0LCB0aGlzLnRyaWdnZXIsIChldmVudDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBvcHVwT3BlbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9wdXBPcGVuZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9wdXBTZXR0aW5nczogUG9wdXBTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcjogdGhpcy5hbmNob3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZU9uRXNjYXBlOiB0aGlzLmNsb3NlT25Fc2NhcGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiB0aGlzLmNvbnRlbnRUZW1wbGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0JhY2tkcm9wOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhIZWlnaHQ6IHRoaXMubWF4SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6IHRoaXMubWF4V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6IHRoaXMubWluSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluV2lkdGg6IHRoaXMubWluV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBDbGFzczogdGhpcy5wb3B1cENsYXNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGhcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3B1cFJlZiA9IHRoaXMucG9wdXBTZXJ2aWNlLmNyZWF0ZShwb3B1cFNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gdGhpcy5wb3B1cFJlZi5jbG9zZWQuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcHVwUmVmID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UuZW1pdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUG9pbnRlckV2ZW50ICYmIHJlc3VsdC50eXBlID09PSB0aGlzLnRyaWdnZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcHVwT3BlbmVkID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgdGFyZ2V0LmNvbnRhaW5zKHJlc3VsdC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQb2ludGVyRXZlbnQgJiYgcG9pbnRBbmNob3IgJiYgcmVzdWx0LnR5cGUgIT09IHRoaXMudHJpZ2dlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucG9wdXBPcGVuZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb2ludEFuY2hvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3B1cE9wZW5lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuLmVtaXQodGhpcy5wb3B1cFJlZik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuIl19