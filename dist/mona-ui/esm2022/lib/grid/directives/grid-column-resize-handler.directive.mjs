import { Directive, EventEmitter, Input, Output } from "@angular/core";
import { fromEvent, Subject, takeUntil } from "rxjs";
import * as i0 from "@angular/core";
export class GridColumnResizeHandlerDirective {
    constructor(elementRef, zone, cdr) {
        this.elementRef = elementRef;
        this.zone = zone;
        this.cdr = cdr;
        this.destroy$ = new Subject();
        this.resizeEnd = new EventEmitter();
        this.resizeStart = new EventEmitter();
    }
    ngAfterViewInit() {
        this.setEvents();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    onMouseDown(event) {
        const element = this.elementRef.nativeElement;
        const initialWidth = this.column.calculatedWidth ?? element.offsetWidth;
        const initialX = event.clientX;
        const oldSelectStart = document.onselectstart;
        const oldDragStart = document.ondragstart;
        const headerTableElement = element.closest("table");
        const bodyTableElement = document.querySelector(".mona-grid-list-wrap > table");
        document.onselectstart = () => false;
        // document.ondragstart = () => false;
        this.resizeStart.emit();
        const onMouseMove = (event) => {
            const deltaX = event.clientX - initialX;
            const minWidth = this.column.minWidth;
            const maxWidth = this.column.maxWidth ?? window.innerWidth;
            if (initialWidth + deltaX < minWidth) {
                return;
            }
            if (initialWidth + deltaX > maxWidth) {
                return;
            }
            const oldWidth = this.column.calculatedWidth ?? element.offsetWidth;
            this.column.calculatedWidth = initialWidth + deltaX;
            if (headerTableElement) {
                headerTableElement.style.width = `${headerTableElement.offsetWidth + (this.column.calculatedWidth - oldWidth)}px`;
            }
            if (bodyTableElement) {
                bodyTableElement.style.width = `${bodyTableElement.offsetWidth + (this.column.calculatedWidth - oldWidth)}px`;
            }
            this.cdr.detectChanges();
        };
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            document.onselectstart = oldSelectStart;
            // document.ondragstart = oldDragStart;
            this.resizeEnd.emit();
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }
    setEvents() {
        this.zone.runOutsideAngular(() => {
            fromEvent(this.elementRef.nativeElement, "mousedown")
                .pipe(takeUntil(this.destroy$))
                .subscribe(event => {
                event.stopImmediatePropagation();
                this.onMouseDown(event);
            });
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridColumnResizeHandlerDirective, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: GridColumnResizeHandlerDirective, selector: "[monaGridColumnResizeHandler]", inputs: { column: "column" }, outputs: { resizeEnd: "resizeEnd", resizeStart: "resizeStart" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridColumnResizeHandlerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[monaGridColumnResizeHandler]"
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { column: [{
                type: Input
            }], resizeEnd: [{
                type: Output
            }], resizeStart: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1jb2x1bW4tcmVzaXplLWhhbmRsZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2dyaWQvZGlyZWN0aXZlcy9ncmlkLWNvbHVtbi1yZXNpemUtaGFuZGxlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdILFNBQVMsRUFFVCxZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sRUFDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBS3JELE1BQU0sT0FBTyxnQ0FBZ0M7SUFZekMsWUFDcUIsVUFBc0MsRUFDdEMsSUFBWSxFQUNaLEdBQXNCO1FBRnRCLGVBQVUsR0FBVixVQUFVLENBQTRCO1FBQ3RDLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQWQxQixhQUFRLEdBQWtCLElBQUksT0FBTyxFQUFRLENBQUM7UUFNeEQsY0FBUyxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBR3pELGdCQUFXLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7SUFNL0QsQ0FBQztJQUVHLGVBQWU7UUFDbEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxXQUFXO1FBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFTyxXQUFXLENBQUMsS0FBaUI7UUFDakMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFDOUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLElBQUksT0FBTyxDQUFDLFdB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QzVCLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOzhHQTNGUSxnQ0FBZ0M7a0dBQWhDLGdDQUFnQzs7MkZBQWhDLGdDQUFnQztrQkFINUMsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsK0JBQStCO2lCQUM1QztzSkFLVSxNQUFNO3NCQURaLEtBQUs7Z0JBSUMsU0FBUztzQkFEZixNQUFNO2dCQUlBLFdBQVc7c0JBRGpCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIEFmdGVyVmlld0luaXQsXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgRGlyZWN0aXZlLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIElucHV0LFxuICAgIE5nWm9uZSxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT3V0cHV0XG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb2x1bW4gfSBmcm9tIFwiLi4vbW9kZWxzL0NvbHVtblwiO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBTdWJqZWN0LCB0YWtlVW50aWwgfSBmcm9tIFwicnhqc1wiO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogXCJbbW9uYUdyaWRDb2x1bW5SZXNpemVIYW5kbGVyXVwiXG59KVxuZXhwb3J0IGNsYXNzIEdyaWRDb2x1bW5SZXNpemVIYW5kbGVyRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRlc3Ryb3kkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGNvbHVtbiE6IENvbHVtbjtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyByZXNpemVFbmQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyByZXNpemVTdGFydDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+LFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHpvbmU6IE5nWm9uZSxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjZHI6IENoYW5nZURldGVjdG9yUmVmXG4gICAgKSB7fVxuXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGluaXRpYWxXaWR0aCA9IHRoaXMuY29sdW1uLmNhbGN1bGF0ZWRXaWR0aCA/PyBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICBjb25zdCBpbml0aWFsWCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgIGNvbnN0IG9sZFNlbGVjdFN0YXJ0ID0gZG9jdW1lbnQub25zZWxlY3RzdGFydDtcbiAgICAgICAgY29uc3Qgb2xkRHJhZ1N0YXJ0ID0gZG9jdW1lbnQub25kcmFnc3RhcnQ7XG4gICAgICAgIGNvbnN0IGhlYWRlclRhYmxlRWxlbWVudCA9IGVsZW1lbnQuY2xvc2VzdChcInRhYmxlXCIpO1xuICAgICAgICBjb25zdCBib2R5VGFibGVFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb25hLWdyaWQtbGlzdC13cmFwID4gdGFibGVcIikgYXMgSFRNTFRhYmxlRWxlbWVudDtcblxuICAgICAgICBkb2N1bWVudC5vbnNlbGVjdHN0YXJ0ID0gKCkgPT4gZmFsc2U7XG4gICAgICAgIC8vIGRvY3VtZW50Lm9uZHJhZ3N0YXJ0ID0gKCkgPT4gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5yZXNpemVTdGFydC5lbWl0KCk7XG5cbiAgICAgICAgY29uc3Qgb25Nb3VzZU1vdmUgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhWCA9IGV2ZW50LmNsaWVudFggLSBpbml0aWFsWDtcbiAgICAgICAgICAgIGNvbnN0IG1pbldpZHRoID0gdGhpcy5jb2x1bW4ubWluV2lkdGg7XG4gICAgICAgICAgICBjb25zdCBtYXhXaWR0aCA9IHRoaXMuY29sdW1uLm1heFdpZHRoID8/IHdpbmRvdy5pbm5lcldpZHRoO1xuXG4gICAgICAgICAgICBpZiAoaW5pdGlhbFdpZHRoICsgZGVsdGFYIDwgbWluV2lkdGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbml0aWFsV2lkdGggKyBkZWx0YVggPiBtYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgb2xkV2lkdGggPSB0aGlzLmNvbHVtbi5jYWxjdWxhdGVkV2lkdGggPz8gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uLmNhbGN1bGF0ZWRXaWR0aCA9IGluaXRpYWxXaWR0aCArIGRlbHRhWDtcbiAgICAgICAgICAgIGlmIChoZWFkZXJUYWJsZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJUYWJsZUVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyVGFibGVFbGVtZW50Lm9mZnNldFdpZHRoICsgKHRoaXMuY29sdW1uLmNhbGN1bGF0ZWRXaWR0aCAtIG9sZFdpZHRoKVxuICAgICAgICAgICAgICAgIH1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYm9keVRhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGJvZHlUYWJsZUVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHtcbiAgICAgICAgICAgICAgICAgICAgYm9keVRhYmxlRWxlbWVudC5vZmZzZXRXaWR0aCArICh0aGlzLmNvbHVtbi5jYWxjdWxhdGVkV2lkdGggLSBvbGRXaWR0aClcbiAgICAgICAgICAgICAgICB9cHhgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25Nb3VzZVVwID0gKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvbk1vdXNlVXApO1xuICAgICAgICAgICAgZG9jdW1lbnQub25zZWxlY3RzdGFydCA9IG9sZFNlbGVjdFN0YXJ0O1xuICAgICAgICAgICAgLy8gZG9jdW1lbnQub25kcmFnc3RhcnQgPSBvbGREcmFnU3RhcnQ7XG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUVuZC5lbWl0KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG9uTW91c2VVcCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRFdmVudHMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICBmcm9tRXZlbnQ8TW91c2VFdmVudD4odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIFwibW91c2Vkb3duXCIpXG4gICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlRG93bihldmVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==