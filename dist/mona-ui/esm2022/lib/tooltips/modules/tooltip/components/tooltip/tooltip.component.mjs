import { Component, ElementRef, Input, TemplateRef, ViewChild } from "@angular/core";
import { fromEvent, Subject, takeUntil } from "rxjs";
import { DefaultTooltipPositionMap } from "../../../../models/DefaultTooltipPositionMap";
import { v4 } from "uuid";
import * as i0 from "@angular/core";
import * as i1 from "../../../../../popup/services/popup.service";
import * as i2 from "@angular/common";
export class TooltipComponent {
    constructor(elementRef, popupService) {
        this.elementRef = elementRef;
        this.popupService = popupService;
        this.componentDestroy$ = new Subject();
        this.uid = v4();
        this.position = "top";
    }
    ngOnInit() {
        if (!this.target) {
            throw new Error("Tooltip target is required.");
        }
        this.setSubscriptions();
    }
    calculateTopAndLeft() {
        let popupTop = 0;
        let popupLeft = 0;
        const anchorWidth = this.target instanceof Element
            ? this.target.offsetWidth
            : this.target.nativeElement.offsetWidth;
        const anchorHeight = this.target instanceof Element
            ? this.target.offsetHeight
            : this.target.nativeElement.offsetHeight;
        const popupWidth = this.tooltipElement?.offsetWidth ?? 0;
        const popupHeight = this.tooltipElement?.offsetHeight ?? 0;
        if (!this.tooltipOverlayElement) {
            return;
        }
        switch (this.position) {
            case "top":
                popupLeft = (anchorWidth - popupWidth) / 2;
                this.tooltipOverlayElement.style.transform = `translate3d(${popupLeft}px, -12px, 0)`;
                break;
            case "bottom":
                popupLeft = (anchorWidth - popupWidth) / 2;
                this.tooltipOverlayElement.style.transform = `translate3d(${popupLeft}px, 12px, 0)`;
                break;
            case "right":
                popupTop = (anchorHeight - popupHeight) / 2;
                this.tooltipOverlayElement.style.transform = `translate3d(12px, ${popupTop}px, 0)`;
                break;
            case "left":
                popupTop = (anchorHeight - popupHeight) / 2;
                this.tooltipOverlayElement.style.transform = `translate3d(${-popupWidth - 12}px, ${popupTop}px, 0)`;
                break;
        }
    }
    setSubscriptions() {
        const target = this.target instanceof ElementRef ? this.target.nativeElement : this.target;
        fromEvent(target, "mouseenter")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((event) => {
            this.popupRef = this.popupService.create({
                content: this.templateRef,
                anchor: target,
                popupClass: "mona-tooltip-popup-content",
                hasBackdrop: false,
                positions: DefaultTooltipPositionMap[this.position],
                closeOnOutsideClick: true,
                withPush: false
            });
            this.popupRef.overlayRef.addPanelClass("mona-invisible-tooltip");
            window.setTimeout(() => {
                this.calculateTopAndLeft();
                this.popupRef?.overlayRef.removePanelClass("mona-invisible-tooltip");
            }, 100);
        });
        fromEvent(target, "mouseleave")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((event) => {
            this.popupRef?.close();
        });
    }
    get tooltipElement() {
        return document.querySelector(`[data-uid='${this.uid}']`) ?? null;
    }
    get tooltipOverlayElement() {
        return this.tooltipElement?.parentElement ?? null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TooltipComponent, deps: [{ token: i0.ElementRef }, { token: i1.PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: TooltipComponent, selector: "mona-tooltip", inputs: { position: "position", target: "target" }, viewQueries: [{ propertyName: "templateRef", first: true, predicate: TemplateRef, descendants: true }], ngImport: i0, template: "<ng-template>\n    <div class=\"mona-tooltip\" [attr.data-uid]=\"uid\">\n        <div class=\"mona-tooltip-content\">\n            <ng-content></ng-content>\n        </div>\n        <div class=\"mona-tooltip-arrow\" [ngClass]=\"{'top':position==='top', 'bottom': position==='bottom', 'left': position==='left', 'right': position==='right'}\"></div>\n    </div>\n</ng-template>\n", styles: ["div.mona-tooltip{position:relative}div.mona-tooltip-content{width:100%;height:100%;padding:8px 10px;position:relative}div.mona-tooltip-arrow{width:12px;height:12px;box-sizing:border-box;position:absolute;pointer-events:none;background:var(--mona-background);transform-origin:center;transform:rotate(45deg);z-index:-1;box-shadow:var(--mona-popup-shadow)}div.mona-tooltip-arrow.bottom{top:-6px;left:calc(50% - 6px);border-left:1px solid var(--mona-border-color);border-top:1px solid var(--mona-border-color)}div.mona-tooltip-arrow.top{bottom:-6px;left:calc(50% - 6px);border-right:1px solid var(--mona-border-color);border-bottom:1px solid var(--mona-border-color)}div.mona-tooltip-arrow.right{left:-6px;top:calc(50% - 6px);border-left:1px solid var(--mona-border-color);border-bottom:1px solid var(--mona-border-color)}div.mona-tooltip-arrow.left{right:-6px;top:calc(50% - 6px);border-right:1px solid var(--mona-border-color);border-top:1px solid var(--mona-border-color)}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-tooltip", template: "<ng-template>\n    <div class=\"mona-tooltip\" [attr.data-uid]=\"uid\">\n        <div class=\"mona-tooltip-content\">\n            <ng-content></ng-content>\n        </div>\n        <div class=\"mona-tooltip-arrow\" [ngClass]=\"{'top':position==='top', 'bottom': position==='bottom', 'left': position==='left', 'right': position==='right'}\"></div>\n    </div>\n</ng-template>\n", styles: ["div.mona-tooltip{position:relative}div.mona-tooltip-content{width:100%;height:100%;padding:8px 10px;position:relative}div.mona-tooltip-arrow{width:12px;height:12px;box-sizing:border-box;position:absolute;pointer-events:none;background:var(--mona-background);transform-origin:center;transform:rotate(45deg);z-index:-1;box-shadow:var(--mona-popup-shadow)}div.mona-tooltip-arrow.bottom{top:-6px;left:calc(50% - 6px);border-left:1px solid var(--mona-border-color);border-top:1px solid var(--mona-border-color)}div.mona-tooltip-arrow.top{bottom:-6px;left:calc(50% - 6px);border-right:1px solid var(--mona-border-color);border-bottom:1px solid var(--mona-border-color)}div.mona-tooltip-arrow.right{left:-6px;top:calc(50% - 6px);border-left:1px solid var(--mona-border-color);border-bottom:1px solid var(--mona-border-color)}div.mona-tooltip-arrow.left{right:-6px;top:calc(50% - 6px);border-right:1px solid var(--mona-border-color);border-top:1px solid var(--mona-border-color)}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.PopupService }]; }, propDecorators: { position: [{
                type: Input
            }], target: [{
                type: Input
            }], templateRef: [{
                type: ViewChild,
                args: [TemplateRef]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvdG9vbHRpcHMvbW9kdWxlcy90b29sdGlwL2NvbXBvbmVudHMvdG9vbHRpcC90b29sdGlwLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi90b29sdGlwcy9tb2R1bGVzL3Rvb2x0aXAvY29tcG9uZW50cy90b29sdGlwL3Rvb2x0aXAuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFVLFdBQVcsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0YsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBSXJELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7QUFPMUIsTUFBTSxPQUFPLGdCQUFnQjtJQWN6QixZQUNxQixVQUFtQyxFQUNuQyxZQUEwQjtRQUQxQixlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUNuQyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQWY5QixzQkFBaUIsR0FBa0IsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUV4RCxRQUFHLEdBQVcsRUFBRSxFQUFFLENBQUM7UUFHNUIsYUFBUSxHQUFhLEtBQUssQ0FBQztJQVcvQixDQUFDO0lBQ0csUUFBUTtRQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENB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QUMsd0JBQXdCLENBQUMsQ0FBQztZQUNqRSxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLGdCQUFnQixDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDekUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUM7UUFDUCxTQUFTLENBQWEsTUFBTSxFQUFFLFlBQVksQ0FBQzthQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2FBQ3ZDLFNBQVMsQ0FBQyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUM3QixJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELElBQVksY0FBYztRQUN0QixPQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsY0FBYyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDdEUsQ0FBQztJQUVELElBQVkscUJBQXFCO1FBQzdCLE9BQU8sSUFBSSxDQUFDLGNBQWMsRUFBRSxhQUFhLElBQUksSUFBSSxDQUFDO0lBQ3RELENBQUM7OEdBOUZRLGdCQUFnQjtrR0FBaEIsZ0JBQWdCLHFKQVdkLFdBQVcsZ0RDeEIxQiw0WEFRQTs7MkZES2EsZ0JBQWdCO2tCQUw1QixTQUFTOytCQUNJLGNBQWM7NEhBVWpCLFFBQVE7c0JBRGQsS0FBSztnQkFJQyxNQUFNO3NCQURaLEtBQUs7Z0JBSUMsV0FBVztzQkFEakIsU0FBUzt1QkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgT25Jbml0LCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IGZyb21FdmVudCwgU3ViamVjdCwgdGFrZVVudGlsIH0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7IFBvcHVwU2VydmljZSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9wb3B1cC9zZXJ2aWNlcy9wb3B1cC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBQb3B1cFJlZiB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9wb3B1cC9tb2RlbHMvUG9wdXBSZWZcIjtcbmltcG9ydCB7IFBvc2l0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL21vZGVscy9Qb3NpdGlvblwiO1xuaW1wb3J0IHsgRGVmYXVsdFRvb2x0aXBQb3NpdGlvbk1hcCB9IGZyb20gXCIuLi8uLi8uLi8uLi9tb2RlbHMvRGVmYXVsdFRvb2x0aXBQb3NpdGlvbk1hcFwiO1xuaW1wb3J0IHsgdjQgfSBmcm9tIFwidXVpZFwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJtb25hLXRvb2x0aXBcIixcbiAgICB0ZW1wbGF0ZVVybDogXCIuL3Rvb2x0aXAuY29tcG9uZW50Lmh0bWxcIixcbiAgICBzdHlsZVVybHM6IFtcIi4vdG9vbHRpcC5jb21wb25lbnQuc2Nzc1wiXVxufSlcbmV4cG9ydCBjbGFzcyBUb29sdGlwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBvbmVudERlc3Ryb3kkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICBwcml2YXRlIHBvcHVwUmVmPzogUG9wdXBSZWY7XG4gICAgcHVibGljIHJlYWRvbmx5IHVpZDogc3RyaW5nID0gdjQoKTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHBvc2l0aW9uOiBQb3NpdGlvbiA9IFwidG9wXCI7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0YXJnZXQhOiBFbGVtZW50IHwgRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYpXG4gICAgcHVibGljIHRlbXBsYXRlUmVmITogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBwb3B1cFNlcnZpY2U6IFBvcHVwU2VydmljZVxuICAgICkge31cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRvb2x0aXAgdGFyZ2V0IGlzIHJlcXVpcmVkLlwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFN1YnNjcmlwdGlvbnMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGN1bGF0ZVRvcEFuZExlZnQoKTogdm9pZCB7XG4gICAgICAgIGxldCBwb3B1cFRvcCA9IDA7XG4gICAgICAgIGxldCBwb3B1cExlZnQgPSAwO1xuICAgICAgICBjb25zdCBhbmNob3JXaWR0aCA9XG4gICAgICAgICAgICB0aGlzLnRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnRcbiAgICAgICAgICAgICAgICA/ICh0aGlzLnRhcmdldCBhcyBIVE1MRWxlbWVudCkub2Zmc2V0V2lkdGhcbiAgICAgICAgICAgICAgICA6IHRoaXMudGFyZ2V0Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgIGNvbnN0IGFuY2hvckhlaWdodCA9XG4gICAgICAgICAgICB0aGlzLnRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnRcbiAgICAgICAgICAgICAgICA/ICh0aGlzLnRhcmdldCBhcyBIVE1MRWxlbWVudCkub2Zmc2V0SGVpZ2h0XG4gICAgICAgICAgICAgICAgOiB0aGlzLnRhcmdldC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICAgICAgY29uc3QgcG9wdXBXaWR0aCA9IHRoaXMudG9vbHRpcEVsZW1lbnQ/Lm9mZnNldFdpZHRoID8/IDA7XG4gICAgICAgIGNvbnN0IHBvcHVwSGVpZ2h0ID0gdGhpcy50b29sdGlwRWxlbWVudD8ub2Zmc2V0SGVpZ2h0ID8/IDA7XG4gICAgICAgIGlmICghdGhpcy50b29sdGlwT3ZlcmxheUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRoaXMucG9zaXRpb24pIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0b3BcIjpcbiAgICAgICAgICAgICAgICBwb3B1cExlZnQgPSAoYW5jaG9yV2lkdGggLSBwb3B1cFdpZHRoKSAvIDI7XG4gICAgICAgICAgICAgICAgdGhpcy50b29sdGlwT3ZlcmxheUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7cG9wdXBMZWZ0fXB4LCAtMTJweCwgMClgO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxuICAgICAgICAgICAgICAgIHBvcHVwTGVmdCA9IChhbmNob3JXaWR0aCAtIHBvcHVwV2lkdGgpIC8gMjtcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2x0aXBPdmVybGF5RWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHtwb3B1cExlZnR9cHgsIDEycHgsIDApYDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAgIHBvcHVwVG9wID0gKGFuY2hvckhlaWdodCAtIHBvcHVwSGVpZ2h0KSAvIDI7XG4gICAgICAgICAgICAgICAgdGhpcy50b29sdGlwT3ZlcmxheUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKDEycHgsICR7cG9wdXBUb3B9cHgsIDApYDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgICAgICAgICAgcG9wdXBUb3AgPSAoYW5jaG9ySGVpZ2h0IC0gcG9wdXBIZWlnaHQpIC8gMjtcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2x0aXBPdmVybGF5RWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHstcG9wdXBXaWR0aCAtIDEyfXB4LCAke3BvcHVwVG9wfXB4LCAwKWA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFN1YnNjcmlwdGlvbnMoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMudGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudFJlZiA/IHRoaXMudGFyZ2V0Lm5hdGl2ZUVsZW1lbnQgOiB0aGlzLnRhcmdldDtcbiAgICAgICAgZnJvbUV2ZW50PE1vdXNlRXZlbnQ+KHRhcmdldCwgXCJtb3VzZWVudGVyXCIpXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5jb21wb25lbnREZXN0cm95JCkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucG9wdXBSZWYgPSB0aGlzLnBvcHVwU2VydmljZS5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiB0aGlzLnRlbXBsYXRlUmVmLFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IHRhcmdldCxcbiAgICAgICAgICAgICAgICAgICAgcG9wdXBDbGFzczogXCJtb25hLXRvb2x0aXAtcG9wdXAtY29udGVudFwiLFxuICAgICAgICAgICAgICAgICAgICBoYXNCYWNrZHJvcDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uczogRGVmYXVsdFRvb2x0aXBQb3NpdGlvbk1hcFt0aGlzLnBvc2l0aW9uXSxcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VPbk91dHNpZGVDbGljazogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgd2l0aFB1c2g6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1cFJlZi5vdmVybGF5UmVmLmFkZFBhbmVsQ2xhc3MoXCJtb25hLWludmlzaWJsZS10b29sdGlwXCIpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUb3BBbmRMZWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9wdXBSZWY/Lm92ZXJsYXlSZWYucmVtb3ZlUGFuZWxDbGFzcyhcIm1vbmEtaW52aXNpYmxlLXRvb2x0aXBcIik7XG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBmcm9tRXZlbnQ8TW91c2VFdmVudD4odGFyZ2V0LCBcIm1vdXNlbGVhdmVcIilcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmNvbXBvbmVudERlc3Ryb3kkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1cFJlZj8uY2xvc2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IHRvb2x0aXBFbGVtZW50KCk6IEhUTUxFbGVtZW50IHwgbnVsbCB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS11aWQ9JyR7dGhpcy51aWR9J11gKSA/PyBudWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IHRvb2x0aXBPdmVybGF5RWxlbWVudCgpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy50b29sdGlwRWxlbWVudD8ucGFyZW50RWxlbWVudCA/PyBudWxsO1xuICAgIH1cbn1cbiIsIjxuZy10ZW1wbGF0ZT5cbiAgICA8ZGl2IGNsYXNzPVwibW9uYS10b29sdGlwXCIgW2F0dHIuZGF0YS11aWRdPVwidWlkXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb25hLXRvb2x0aXAtY29udGVudFwiPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vbmEtdG9vbHRpcC1hcnJvd1wiIFtuZ0NsYXNzXT1cInsndG9wJzpwb3NpdGlvbj09PSd0b3AnLCAnYm90dG9tJzogcG9zaXRpb249PT0nYm90dG9tJywgJ2xlZnQnOiBwb3NpdGlvbj09PSdsZWZ0JywgJ3JpZ2h0JzogcG9zaXRpb249PT0ncmlnaHQnfVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==