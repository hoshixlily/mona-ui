import { Directive, Input } from "@angular/core";
import { fromEvent, Subject, takeUntil } from "rxjs";
import * as i0 from "@angular/core";
export class WindowDragHandlerDirective {
    constructor(elementRef, zone) {
        this.elementRef = elementRef;
        this.zone = zone;
        this.componentDestroy$ = new Subject();
        this.draggable = false;
    }
    ngAfterViewInit() {
        this.setEvents();
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    onMouseDown(event) {
        if (!this.draggable) {
            return;
        }
        const element = this.elementRef.nativeElement.parentElement?.parentElement?.parentElement;
        const initialX = event.clientX;
        const initialY = event.clientY;
        const initialTop = element.offsetTop;
        const initialLeft = element.offsetLeft;
        const onMouseMove = (event) => {
            if (event.clientX < 0 ||
                event.clientX > window.innerWidth ||
                event.clientY < 0 ||
                event.clientY > window.innerHeight) {
                return;
            }
            const deltaX = event.clientX - initialX;
            const deltaY = event.clientY - initialY;
            const top = initialTop + deltaY;
            const left = initialLeft + deltaX;
            element.style.top = `${top}px`;
            element.style.left = `${left}px`;
            this.windowRef.move$.next({ top, left });
        };
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }
    setEvents() {
        this.zone.runOutsideAngular(() => {
            fromEvent(this.elementRef.nativeElement, "mousedown")
                .pipe(takeUntil(this.componentDestroy$))
                .subscribe(event => this.onMouseDown(event));
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowDragHandlerDirective, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: WindowDragHandlerDirective, selector: "div[monaWindowDragHandler]", inputs: { draggable: "draggable", windowRef: "windowRef" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowDragHandlerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "div[monaWindowDragHandler]"
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { draggable: [{
                type: Input
            }], windowRef: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LWRyYWctaGFuZGxlci5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvd2luZG93L2RpcmVjdGl2ZXMvd2luZG93LWRyYWctaGFuZGxlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFpQixTQUFTLEVBQWMsS0FBSyxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUMvRixPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBTXJELE1BQU0sT0FBTywwQkFBMEI7SUFTbkMsWUFBb0MsVUFBbUMsRUFBbUIsSUFBWTtRQUFsRSxlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUFtQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBUnJGLHNCQUFpQixHQUFrQixJQUFJLE9BQU8sRUFBUSxDQUFDO1FBR2pFLGNBQVMsR0FBYSxLQUFLLENBQUM7SUFLc0UsQ0FBQztJQUVuRyxlQUFlO1FBQ2xCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRU0sV0FBVztRQUNkLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVNLFdBQVcsQ0FBQyxLQUFpQjtRQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNqQixPQUFPO1NBQ1Y7UUFDRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQTRCLENBQUM7UUFDekcsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUMvQixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQy9CLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDckMsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUV2QyxNQUFNLFdBQVcsR0FBRyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUN0QyxJQUNJLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQztnQkFDakIsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVTtnQkFDakMsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDO2dCQUNqQixLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQ3BDO2dCQUNFLE9BQU87YUFDVjtZQUNELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO1lBQ3hDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO1lBQ3hDLE1BQU0sR0FBRyxHQUFHLFVBQVUsR0FBRyxNQUFNLENBQUM7WUFDaEMsTUFBTSxJQUFJLEdBQUcsV0FBVyxHQUFHLE1BQU0sQ0FBQztZQUNsQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1lBQy9CLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUM7WUFDakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDO1FBRUYsTUFBTSxTQUFTLEdBQUcsR0FBRyxFQUFFO1lBQ25CLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDdkQsUUFBUSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUM7UUFFRixRQUFRLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3BELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVPLFNBQVM7UUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUM3QixTQUFTLENBQWEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDO2lCQUM1RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2lCQUN2QyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOzhHQS9EUSwwQkFBMEI7a0dBQTFCLDBCQUEwQjs7MkZBQTFCLDBCQUEwQjtrQkFIdEMsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsNEJBQTRCO2lCQUN6QztzSEFLVSxTQUFTO3NCQURmLEtBQUs7Z0JBSUMsU0FBUztzQkFEZixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCwgTmdab25lLCBPbkRlc3Ryb3kgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBTdWJqZWN0LCB0YWtlVW50aWwgfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgV2luZG93UmVmZXJlbmNlIH0gZnJvbSBcIi4uL21vZGVscy9XaW5kb3dSZWZlcmVuY2VcIjtcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6IFwiZGl2W21vbmFXaW5kb3dEcmFnSGFuZGxlcl1cIlxufSlcbmV4cG9ydCBjbGFzcyBXaW5kb3dEcmFnSGFuZGxlckRpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21wb25lbnREZXN0cm95JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkcmFnZ2FibGU/OiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB3aW5kb3dSZWYhOiBXaW5kb3dSZWZlcmVuY2U7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSByZWFkb25seSB6b25lOiBOZ1pvbmUpIHt9XG5cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnREZXN0cm95JC5uZXh0KCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50RGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25Nb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdnYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50Py5wYXJlbnRFbGVtZW50Py5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBjb25zdCBpbml0aWFsWCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgIGNvbnN0IGluaXRpYWxZID0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgY29uc3QgaW5pdGlhbFRvcCA9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICBjb25zdCBpbml0aWFsTGVmdCA9IGVsZW1lbnQub2Zmc2V0TGVmdDtcblxuICAgICAgICBjb25zdCBvbk1vdXNlTW92ZSA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGV2ZW50LmNsaWVudFggPCAwIHx8XG4gICAgICAgICAgICAgICAgZXZlbnQuY2xpZW50WCA+IHdpbmRvdy5pbm5lcldpZHRoIHx8XG4gICAgICAgICAgICAgICAgZXZlbnQuY2xpZW50WSA8IDAgfHxcbiAgICAgICAgICAgICAgICBldmVudC5jbGllbnRZID4gd2luZG93LmlubmVySGVpZ2h0XG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkZWx0YVggPSBldmVudC5jbGllbnRYIC0gaW5pdGlhbFg7XG4gICAgICAgICAgICBjb25zdCBkZWx0YVkgPSBldmVudC5jbGllbnRZIC0gaW5pdGlhbFk7XG4gICAgICAgICAgICBjb25zdCB0b3AgPSBpbml0aWFsVG9wICsgZGVsdGFZO1xuICAgICAgICAgICAgY29uc3QgbGVmdCA9IGluaXRpYWxMZWZ0ICsgZGVsdGFYO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG4gICAgICAgICAgICB0aGlzLndpbmRvd1JlZi5tb3ZlJC5uZXh0KHsgdG9wLCBsZWZ0IH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uTW91c2VVcCA9ICgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgb25Nb3VzZVVwKTtcbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgb25Nb3VzZVVwKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIGZyb21FdmVudDxNb3VzZUV2ZW50Pih0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgXCJtb3VzZWRvd25cIilcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5jb21wb25lbnREZXN0cm95JCkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShldmVudCA9PiB0aGlzLm9uTW91c2VEb3duKGV2ZW50KSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==