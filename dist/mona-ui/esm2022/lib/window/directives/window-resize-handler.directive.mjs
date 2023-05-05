import { Directive, Input } from "@angular/core";
import { fromEvent, Subject, takeUntil } from "rxjs";
import * as i0 from "@angular/core";
export class WindowResizeHandlerDirective {
    constructor(elementRef, zone) {
        this.elementRef = elementRef;
        this.zone = zone;
        this.destroy$ = new Subject();
    }
    ngAfterViewInit() {
        this.setEvents();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    onMouseDown(event) {
        const element = this.windowRef.element;
        const initialWidth = element.offsetWidth;
        const initialHeight = element.offsetHeight;
        const initialX = event.clientX;
        const initialY = event.clientY;
        const initialTop = element.offsetTop;
        const initialLeft = element.offsetLeft;
        const oldSelectStart = document.onselectstart;
        const oldDragStart = document.ondragstart;
        document.onselectstart = () => false;
        document.ondragstart = () => false;
        const onMouseMove = (event) => {
            const deltaX = event.clientX - initialX;
            const deltaY = event.clientY - initialY;
            const minWidth = this.minWidth ?? 50;
            const minHeight = this.minHeight ?? 50;
            const maxWidth = this.maxWidth ?? window.innerWidth;
            const maxHeight = this.maxHeight ?? window.innerHeight;
            let height;
            let left;
            let width;
            let top;
            switch (this.direction) {
                case "northwest":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < minHeight) {
                        return;
                    }
                    if (initialHeight - deltaY > maxHeight || initialWidth - deltaX > maxWidth) {
                        return;
                    }
                    height = initialHeight - deltaY;
                    top = initialTop + deltaY;
                    element.style.height = `${height}px`;
                    element.style.top = `${top}px`;
                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < minWidth) {
                        return;
                    }
                    width = initialWidth - deltaX;
                    left = initialLeft + deltaX;
                    element.style.left = `${left}px`;
                    element.style.width = `${width}px`;
                    break;
                case "north":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < minHeight) {
                        return;
                    }
                    if (initialHeight - deltaY > maxHeight) {
                        return;
                    }
                    height = initialHeight - deltaY;
                    top = initialTop + deltaY;
                    element.style.height = `${height}px`;
                    element.style.top = `${top}px`;
                    break;
                case "northeast":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < minHeight) {
                        return;
                    }
                    if (initialHeight - deltaY > maxHeight || initialWidth + deltaX > maxWidth) {
                        return;
                    }
                    height = initialHeight - deltaY;
                    top = initialTop + deltaY;
                    element.style.height = `${height}px`;
                    element.style.top = `${top}px`;
                    if (initialWidth + deltaX < 100 || initialLeft + initialWidth + deltaX > window.innerWidth) {
                        return;
                    }
                    width = initialWidth + deltaX;
                    element.style.width = `${width}px`;
                    break;
                case "east":
                    if (initialWidth + deltaX < minWidth || initialLeft + initialWidth + deltaX > window.innerWidth) {
                        return;
                    }
                    if (initialWidth + deltaX > maxWidth) {
                        return;
                    }
                    width = initialWidth + deltaX;
                    element.style.width = `${width}px`;
                    break;
                case "southeast":
                    if (initialHeight + deltaY < minHeight ||
                        initialTop + initialHeight + deltaY > window.innerHeight) {
                        return;
                    }
                    if (initialHeight + deltaY > maxHeight || initialWidth + deltaX > maxWidth) {
                        return;
                    }
                    height = initialHeight + deltaY;
                    element.style.height = `${height}px`;
                    if (initialWidth + deltaX < minWidth || initialLeft + initialWidth + deltaX > window.innerWidth) {
                        return;
                    }
                    width = initialWidth + deltaX;
                    element.style.width = `${width}px`;
                    break;
                case "south":
                    if (initialHeight + deltaY < minHeight ||
                        initialTop + initialHeight + deltaY > window.innerHeight) {
                        return;
                    }
                    if (initialHeight + deltaY > maxHeight) {
                        return;
                    }
                    height = initialHeight + deltaY;
                    element.style.height = `${height}px`;
                    break;
                case "southwest":
                    if (initialHeight + deltaY < minHeight ||
                        initialTop + initialHeight + deltaY > window.innerHeight) {
                        return;
                    }
                    if (initialHeight + deltaY > maxHeight || initialWidth - deltaX > maxWidth) {
                        return;
                    }
                    height = initialHeight + deltaY;
                    element.style.height = `${height}px`;
                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < minWidth) {
                        return;
                    }
                    width = initialWidth - deltaX;
                    left = initialLeft + deltaX;
                    element.style.width = `${width}px`;
                    element.style.left = `${left}px`;
                    break;
                case "west":
                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < minWidth) {
                        return;
                    }
                    if (initialWidth - deltaX > maxWidth) {
                        return;
                    }
                    width = initialWidth - deltaX;
                    left = initialLeft + deltaX;
                    element.style.width = `${width}px`;
                    element.style.left = `${left}px`;
                    break;
            }
            this.windowRef.resize$.next({
                width: width ?? initialWidth,
                height: height ?? initialHeight,
                left: left ?? initialLeft,
                top: top ?? initialTop
            });
        };
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            document.onselectstart = oldSelectStart;
            document.ondragstart = oldDragStart;
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }
    setEvents() {
        this.zone.runOutsideAngular(() => {
            fromEvent(this.elementRef.nativeElement, "mousedown")
                .pipe(takeUntil(this.destroy$))
                .subscribe(event => this.onMouseDown(event));
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowResizeHandlerDirective, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: WindowResizeHandlerDirective, selector: "div[monaWindowResizeHandler]", inputs: { direction: "direction", maxHeight: "maxHeight", maxWidth: "maxWidth", minHeight: "minHeight", minWidth: "minWidth", windowRef: "windowRef" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowResizeHandlerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "div[monaWindowResizeHandler]"
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { direction: [{
                type: Input
            }], maxHeight: [{
                type: Input
            }], maxWidth: [{
                type: Input
            }], minHeight: [{
                type: Input
            }], minWidth: [{
                type: Input
            }], windowRef: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LXJlc2l6ZS1oYW5kbGVyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi93aW5kb3cvZGlyZWN0aXZlcy93aW5kb3ctcmVzaXplLWhhbmRsZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFjLEtBQUssRUFBcUIsTUFBTSxlQUFlLENBQUM7QUFFL0YsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQU1yRCxNQUFNLE9BQU8sNEJBQTRCO0lBcUJyQyxZQUFvQyxVQUFzQyxFQUFtQixJQUFZO1FBQXJFLGVBQVUsR0FBVixVQUFVLENBQTRCO1FBQW1CLFNBQUksR0FBSixJQUFJLENBQVE7UUFwQnhGLGFBQVEsR0FBa0IsSUFBSSxPQUFPLEVBQVEsQ0FBQztJQW9CNkMsQ0FBQztJQUV0RyxlQUFlO1FBQ2xCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRU0sV0FBVztRQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRU0sV0FBVyxDQUFDLEtBQWlCO1FBQ2hDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1FBQ3ZDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDekMsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUMzQyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQy9CLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDL0IsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFNB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U0FBUztzQkFEZixLQUFLO2dCQUlDLFFBQVE7c0JBRGQsS0FBSztnQkFJQyxTQUFTO3NCQURmLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBOZ1pvbmUsIE9uRGVzdHJveSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBXaW5kb3dSZXNpemVIYW5kbGVyRGlyZWN0aW9uIH0gZnJvbSBcIi4uL21vZGVscy9XaW5kb3dSZXNpemVIYW5kbGVyRGlyZWN0aW9uXCI7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YmplY3QsIHRha2VVbnRpbCB9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQgeyBXaW5kb3dSZWZlcmVuY2UgfSBmcm9tIFwiLi4vbW9kZWxzL1dpbmRvd1JlZmVyZW5jZVwiO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogXCJkaXZbbW9uYVdpbmRvd1Jlc2l6ZUhhbmRsZXJdXCJcbn0pXG5leHBvcnQgY2xhc3MgV2luZG93UmVzaXplSGFuZGxlckRpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBkZXN0cm95JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkaXJlY3Rpb24hOiBXaW5kb3dSZXNpemVIYW5kbGVyRGlyZWN0aW9uO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbWF4SGVpZ2h0PzogbnVtYmVyO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbWF4V2lkdGg/OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBtaW5IZWlnaHQ/OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBtaW5XaWR0aD86IG51bWJlcjtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHdpbmRvd1JlZiE6IFdpbmRvd1JlZmVyZW5jZTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+LCBwcml2YXRlIHJlYWRvbmx5IHpvbmU6IE5nWm9uZSkge31cblxuICAgIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2V0RXZlbnRzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICAgICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy53aW5kb3dSZWYuZWxlbWVudDtcbiAgICAgICAgY29uc3QgaW5pdGlhbFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgY29uc3QgaW5pdGlhbEhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBjb25zdCBpbml0aWFsWCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgIGNvbnN0IGluaXRpYWxZID0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgY29uc3QgaW5pdGlhbFRvcCA9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICBjb25zdCBpbml0aWFsTGVmdCA9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgY29uc3Qgb2xkU2VsZWN0U3RhcnQgPSBkb2N1bWVudC5vbnNlbGVjdHN0YXJ0O1xuICAgICAgICBjb25zdCBvbGREcmFnU3RhcnQgPSBkb2N1bWVudC5vbmRyYWdzdGFydDtcblxuICAgICAgICBkb2N1bWVudC5vbnNlbGVjdHN0YXJ0ID0gKCkgPT4gZmFsc2U7XG4gICAgICAgIGRvY3VtZW50Lm9uZHJhZ3N0YXJ0ID0gKCkgPT4gZmFsc2U7XG5cbiAgICAgICAgY29uc3Qgb25Nb3VzZU1vdmUgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhWCA9IGV2ZW50LmNsaWVudFggLSBpbml0aWFsWDtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhWSA9IGV2ZW50LmNsaWVudFkgLSBpbml0aWFsWTtcbiAgICAgICAgICAgIGNvbnN0IG1pbldpZHRoID0gdGhpcy5taW5XaWR0aCA/PyA1MDtcbiAgICAgICAgICAgIGNvbnN0IG1pbkhlaWdodCA9IHRoaXMubWluSGVpZ2h0ID8/IDUwO1xuICAgICAgICAgICAgY29uc3QgbWF4V2lkdGggPSB0aGlzLm1heFdpZHRoID8/IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgY29uc3QgbWF4SGVpZ2h0ID0gdGhpcy5tYXhIZWlnaHQgPz8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgbGV0IGxlZnQ6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGxldCB3aWR0aDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgbGV0IHRvcDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm5vcnRod2VzdFwiOlxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbFRvcCArIGRlbHRhWSA8PSAwIHx8IGluaXRpYWxIZWlnaHQgLSBkZWx0YVkgPCBtaW5IZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbEhlaWdodCAtIGRlbHRhWSA+IG1heEhlaWdodCB8fCBpbml0aWFsV2lkdGggLSBkZWx0YVggPiBtYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gaW5pdGlhbEhlaWdodCAtIGRlbHRhWTtcbiAgICAgICAgICAgICAgICAgICAgdG9wID0gaW5pdGlhbFRvcCArIGRlbHRhWTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWxMZWZ0ICsgZGVsdGFYIDwgMCB8fCBpbml0aWFsV2lkdGggLSBkZWx0YVggPCBtaW5XaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSBpbml0aWFsV2lkdGggLSBkZWx0YVg7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSBpbml0aWFsTGVmdCArIGRlbHRhWDtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJub3J0aFwiOlxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbFRvcCArIGRlbHRhWSA8PSAwIHx8IGluaXRpYWxIZWlnaHQgLSBkZWx0YVkgPCBtaW5IZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbEhlaWdodCAtIGRlbHRhWSA+IG1heEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IGluaXRpYWxIZWlnaHQgLSBkZWx0YVk7XG4gICAgICAgICAgICAgICAgICAgIHRvcCA9IGluaXRpYWxUb3AgKyBkZWx0YVk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwibm9ydGhlYXN0XCI6XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsVG9wICsgZGVsdGFZIDw9IDAgfHwgaW5pdGlhbEhlaWdodCAtIGRlbHRhWSA8IG1pbkhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsSGVpZ2h0IC0gZGVsdGFZID4gbWF4SGVpZ2h0IHx8IGluaXRpYWxXaWR0aCArIGRlbHRhWCA+IG1heFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBpbml0aWFsSGVpZ2h0IC0gZGVsdGFZO1xuICAgICAgICAgICAgICAgICAgICB0b3AgPSBpbml0aWFsVG9wICsgZGVsdGFZO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gYCR7dG9wfXB4YDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbFdpZHRoICsgZGVsdGFYIDwgMTAwIHx8IGluaXRpYWxMZWZ0ICsgaW5pdGlhbFdpZHRoICsgZGVsdGFYID4gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0gaW5pdGlhbFdpZHRoICsgZGVsdGFYO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZWFzdFwiOlxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbFdpZHRoICsgZGVsdGFYIDwgbWluV2lkdGggfHwgaW5pdGlhbExlZnQgKyBpbml0aWFsV2lkdGggKyBkZWx0YVggPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsV2lkdGggKyBkZWx0YVggPiBtYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSBpbml0aWFsV2lkdGggKyBkZWx0YVg7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJzb3V0aGVhc3RcIjpcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbEhlaWdodCArIGRlbHRhWSA8IG1pbkhlaWdodCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbFRvcCArIGluaXRpYWxIZWlnaHQgKyBkZWx0YVkgPiB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWxIZWlnaHQgKyBkZWx0YVkgPiBtYXhIZWlnaHQgfHwgaW5pdGlhbFdpZHRoICsgZGVsdGFYID4gbWF4V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IGluaXRpYWxIZWlnaHQgKyBkZWx0YVk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbFdpZHRoICsgZGVsdGFYIDwgbWluV2lkdGggfHwgaW5pdGlhbExlZnQgKyBpbml0aWFsV2lkdGggKyBkZWx0YVggPiB3aW5kb3cuaW5uZXJXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSBpbml0aWFsV2lkdGggKyBkZWx0YVg7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJzb3V0aFwiOlxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsSGVpZ2h0ICsgZGVsdGFZIDwgbWluSGVpZ2h0IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsVG9wICsgaW5pdGlhbEhlaWdodCArIGRlbHRhWSA+IHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbEhlaWdodCArIGRlbHRhWSA+IG1heEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gaW5pdGlhbEhlaWdodCArIGRlbHRhWTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwic291dGh3ZXN0XCI6XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxIZWlnaHQgKyBkZWx0YVkgPCBtaW5IZWlnaHQgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxUb3AgKyBpbml0aWFsSGVpZ2h0ICsgZGVsdGFZID4gd2luZG93LmlubmVySGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsSGVpZ2h0ICsgZGVsdGFZID4gbWF4SGVpZ2h0IHx8IGluaXRpYWxXaWR0aCAtIGRlbHRhWCA+IG1heFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBpbml0aWFsSGVpZ2h0ICsgZGVsdGFZO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWxMZWZ0ICsgZGVsdGFYIDwgMCB8fCBpbml0aWFsV2lkdGggLSBkZWx0YVggPCBtaW5XaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSBpbml0aWFsV2lkdGggLSBkZWx0YVg7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSBpbml0aWFsTGVmdCArIGRlbHRhWDtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ3ZXN0XCI6XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsTGVmdCArIGRlbHRhWCA8IDAgfHwgaW5pdGlhbFdpZHRoIC0gZGVsdGFYIDwgbWluV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbFdpZHRoIC0gZGVsdGFYID4gbWF4V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0gaW5pdGlhbFdpZHRoIC0gZGVsdGFYO1xuICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gaW5pdGlhbExlZnQgKyBkZWx0YVg7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy53aW5kb3dSZWYucmVzaXplJC5uZXh0KHtcbiAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGggPz8gaW5pdGlhbFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0ID8/IGluaXRpYWxIZWlnaHQsXG4gICAgICAgICAgICAgICAgbGVmdDogbGVmdCA/PyBpbml0aWFsTGVmdCxcbiAgICAgICAgICAgICAgICB0b3A6IHRvcCA/PyBpbml0aWFsVG9wXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgb25Nb3VzZVVwID0gKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvbk1vdXNlVXApO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5vbnNlbGVjdHN0YXJ0ID0gb2xkU2VsZWN0U3RhcnQ7XG4gICAgICAgICAgICBkb2N1bWVudC5vbmRyYWdzdGFydCA9IG9sZERyYWdTdGFydDtcbiAgICAgICAgfTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG9uTW91c2VVcCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRFdmVudHMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICBmcm9tRXZlbnQ8TW91c2VFdmVudD4odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIFwibW91c2Vkb3duXCIpXG4gICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4gdGhpcy5vbk1vdXNlRG93bihldmVudCkpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=