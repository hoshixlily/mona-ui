import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { asapScheduler, Subject, takeUntil } from "rxjs";
import { WindowTitleTemplateDirective } from "../../directives/window-title-template.directive";
import * as i0 from "@angular/core";
import * as i1 from "../../services/window.service";
export class WindowComponent {
    constructor(windowService) {
        this.windowService = windowService;
        this.componentDestroy$ = new Subject();
        this.heightChange = new EventEmitter();
        this.leftChange = new EventEmitter();
        this.topChange = new EventEmitter();
        this.widthChange = new EventEmitter();
    }
    ngAfterViewInit() {
        asapScheduler.schedule(() => {
            this.windowRef = this.windowService.open({
                content: this.windowTemplate,
                draggable: this.draggable,
                focusedElement: this.focusedElement,
                height: this.height,
                left: this.left,
                maxHeight: this.maxHeight,
                maxWidth: this.maxWidth,
                minHeight: this.minHeight,
                minWidth: this.minWidth,
                modal: this.modal,
                resizable: this.resizable,
                title: this.titleTemplateDirective?.templateRef ?? this.title,
                top: this.top,
                width: this.width
            });
            this.windowRef.resized$.pipe(takeUntil(this.componentDestroy$)).subscribe(event => {
                if (event.width != null) {
                    this.widthChange.emit(event.width);
                }
                if (event.height != null) {
                    this.heightChange.emit(event.height);
                }
                if (event.left != null) {
                    this.leftChange.emit(event.left);
                }
                if (event.top != null) {
                    this.topChange.emit(event.top);
                }
            });
            this.windowRef.moved$.pipe(takeUntil(this.componentDestroy$)).subscribe(event => {
                if (event.left != null) {
                    this.leftChange.emit(event.left);
                }
                if (event.top != null) {
                    this.topChange.emit(event.top);
                }
            });
        });
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
        this.windowRef.close();
    }
    ngOnInit() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowComponent, deps: [{ token: i1.WindowService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: WindowComponent, selector: "mona-window", inputs: { draggable: "draggable", focusedElement: "focusedElement", height: "height", left: "left", maxHeight: "maxHeight", maxWidth: "maxWidth", minHeight: "minHeight", minWidth: "minWidth", modal: "modal", resizable: "resizable", title: "title", top: "top", width: "width" }, outputs: { heightChange: "heightChange", leftChange: "leftChange", topChange: "topChange", widthChange: "widthChange" }, queries: [{ propertyName: "titleTemplateDirective", first: true, predicate: WindowTitleTemplateDirective, descendants: true }], viewQueries: [{ propertyName: "windowTemplate", first: true, predicate: ["windowTemplate"], descendants: true }], ngImport: i0, template: "<ng-template #windowTemplate>\n    <ng-content></ng-content>\n</ng-template>\n", styles: [""], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-window", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-template #windowTemplate>\n    <ng-content></ng-content>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i1.WindowService }]; }, propDecorators: { draggable: [{
                type: Input
            }], focusedElement: [{
                type: Input
            }], height: [{
                type: Input
            }], heightChange: [{
                type: Output
            }], left: [{
                type: Input
            }], leftChange: [{
                type: Output
            }], maxHeight: [{
                type: Input
            }], maxWidth: [{
                type: Input
            }], minHeight: [{
                type: Input
            }], minWidth: [{
                type: Input
            }], modal: [{
                type: Input
            }], resizable: [{
                type: Input
            }], title: [{
                type: Input
            }], titleTemplateDirective: [{
                type: ContentChild,
                args: [WindowTitleTemplateDirective]
            }], top: [{
                type: Input
            }], topChange: [{
                type: Output
            }], width: [{
                type: Input
            }], widthChange: [{
                type: Output
            }], windowTemplate: [{
                type: ViewChild,
                args: ["windowTemplate"]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi93aW5kb3cvY29tcG9uZW50cy93aW5kb3cvd2luZG93LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi93aW5kb3cvY29tcG9uZW50cy93aW5kb3cvd2luZG93LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFSCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFFWixZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFFTixTQUFTLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXpELE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLGtEQUFrRCxDQUFDOzs7QUFTaEcsTUFBTSxPQUFPLGVBQWU7SUE2RHhCLFlBQW9DLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBNUQvQyxzQkFBaUIsR0FBa0IsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQWFqRSxpQkFBWSxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBTWhFLGVBQVUsR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQThCOUQsY0FBUyxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBTTdELGdCQUFXLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7SUFLSCxDQUFDO0lBRTdELGVBQWU7UUFDbEIsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztnQkFDckMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjO2dCQUM1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QUFLO2dCQUlDLFVBQVU7c0JBRGhCLE1BQU07Z0JBSUEsU0FBUztzQkFEZixLQUFLO2dCQUlDLFFBQVE7c0JBRGQsS0FBSztnQkFJQyxTQUFTO3NCQURmLEtBQUs7Z0JBSUMsUUFBUTtzQkFEZCxLQUFLO2dCQUlDLEtBQUs7c0JBRFgsS0FBSztnQkFJQyxTQUFTO3NCQURmLEtBQUs7Z0JBSUMsS0FBSztzQkFEWCxLQUFLO2dCQUlDLHNCQUFzQjtzQkFENUIsWUFBWTt1QkFBQyw0QkFBNEI7Z0JBSW5DLEdBQUc7c0JBRFQsS0FBSztnQkFJQyxTQUFTO3NCQURmLE1BQU07Z0JBSUEsS0FBSztzQkFEWCxLQUFLO2dCQUlDLFdBQVc7c0JBRGpCLE1BQU07Z0JBSUEsY0FBYztzQkFEcEIsU0FBUzt1QkFBQyxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIEFmdGVyVmlld0luaXQsXG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgQ29tcG9uZW50LFxuICAgIENvbnRlbnRDaGlsZCxcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBJbnB1dCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIE91dHB1dCxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBWaWV3Q2hpbGRcbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IGFzYXBTY2hlZHVsZXIsIFN1YmplY3QsIHRha2VVbnRpbCB9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQgeyBXaW5kb3dTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2VzL3dpbmRvdy5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBXaW5kb3dUaXRsZVRlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSBcIi4uLy4uL2RpcmVjdGl2ZXMvd2luZG93LXRpdGxlLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgV2luZG93UmVmIH0gZnJvbSBcIi4uLy4uL21vZGVscy9XaW5kb3dSZWZcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibW9uYS13aW5kb3dcIixcbiAgICB0ZW1wbGF0ZVVybDogXCIuL3dpbmRvdy5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogW1wiLi93aW5kb3cuY29tcG9uZW50LnNjc3NcIl0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgV2luZG93Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcG9uZW50RGVzdHJveSQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIHByaXZhdGUgd2luZG93UmVmITogV2luZG93UmVmO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZHJhZ2dhYmxlPzogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGZvY3VzZWRFbGVtZW50PzogSFRNTEVsZW1lbnQgfCBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiB8IHN0cmluZztcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGhlaWdodD86IG51bWJlcjtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBoZWlnaHRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBsZWZ0PzogbnVtYmVyO1xuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGxlZnRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBtYXhIZWlnaHQ/OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBtYXhXaWR0aD86IG51bWJlcjtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG1pbkhlaWdodD86IG51bWJlcjtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG1pbldpZHRoPzogbnVtYmVyO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbW9kYWw/OiBib29sZWFuO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgcmVzaXphYmxlPzogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHRpdGxlPzogc3RyaW5nO1xuXG4gICAgQENvbnRlbnRDaGlsZChXaW5kb3dUaXRsZVRlbXBsYXRlRGlyZWN0aXZlKVxuICAgIHB1YmxpYyB0aXRsZVRlbXBsYXRlRGlyZWN0aXZlPzogV2luZG93VGl0bGVUZW1wbGF0ZURpcmVjdGl2ZTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHRvcD86IG51bWJlcjtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyB0b3BDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB3aWR0aD86IG51bWJlcjtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyB3aWR0aENoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAgIEBWaWV3Q2hpbGQoXCJ3aW5kb3dUZW1wbGF0ZVwiKVxuICAgIHB1YmxpYyB3aW5kb3dUZW1wbGF0ZSE6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB3aW5kb3dTZXJ2aWNlOiBXaW5kb3dTZXJ2aWNlKSB7fVxuXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgYXNhcFNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLndpbmRvd1JlZiA9IHRoaXMud2luZG93U2VydmljZS5vcGVuKHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiB0aGlzLndpbmRvd1RlbXBsYXRlLFxuICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogdGhpcy5kcmFnZ2FibGUsXG4gICAgICAgICAgICAgICAgZm9jdXNlZEVsZW1lbnQ6IHRoaXMuZm9jdXNlZEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLmxlZnQsXG4gICAgICAgICAgICAgICAgbWF4SGVpZ2h0OiB0aGlzLm1heEhlaWdodCxcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogdGhpcy5tYXhXaWR0aCxcbiAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6IHRoaXMubWluSGVpZ2h0LFxuICAgICAgICAgICAgICAgIG1pbldpZHRoOiB0aGlzLm1pbldpZHRoLFxuICAgICAgICAgICAgICAgIG1vZGFsOiB0aGlzLm1vZGFsLFxuICAgICAgICAgICAgICAgIHJlc2l6YWJsZTogdGhpcy5yZXNpemFibGUsXG4gICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMudGl0bGVUZW1wbGF0ZURpcmVjdGl2ZT8udGVtcGxhdGVSZWYgPz8gdGhpcy50aXRsZSxcbiAgICAgICAgICAgICAgICB0b3A6IHRoaXMudG9wLFxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMud2luZG93UmVmLnJlc2l6ZWQkLnBpcGUodGFrZVVudGlsKHRoaXMuY29tcG9uZW50RGVzdHJveSQpKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC53aWR0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lkdGhDaGFuZ2UuZW1pdChldmVudC53aWR0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChldmVudC5oZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlaWdodENoYW5nZS5lbWl0KGV2ZW50LmhlaWdodCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChldmVudC5sZWZ0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0Q2hhbmdlLmVtaXQoZXZlbnQubGVmdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChldmVudC50b3AgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvcENoYW5nZS5lbWl0KGV2ZW50LnRvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLndpbmRvd1JlZi5tb3ZlZCQucGlwZSh0YWtlVW50aWwodGhpcy5jb21wb25lbnREZXN0cm95JCkpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmxlZnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnRDaGFuZ2UuZW1pdChldmVudC5sZWZ0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRvcCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9wQ2hhbmdlLmVtaXQoZXZlbnQudG9wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbXBvbmVudERlc3Ryb3kkLm5leHQoKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnREZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgICAgICB0aGlzLndpbmRvd1JlZi5jbG9zZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHt9XG59XG4iLCI8bmctdGVtcGxhdGUgI3dpbmRvd1RlbXBsYXRlPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvbmctdGVtcGxhdGU+XG4iXX0=