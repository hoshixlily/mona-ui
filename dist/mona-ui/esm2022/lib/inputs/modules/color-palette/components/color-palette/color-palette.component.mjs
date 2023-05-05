import { Component, EventEmitter, forwardRef, Input, Output } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class ColorPaletteComponent {
    set palette(palette) {
        this.colors = Array.from(palette);
    }
    set value(value) {
        this.selectedColor = value ? this.colors.find(c => c === value) ?? null : null;
    }
    get value() {
        return this.selectedColor;
    }
    constructor() {
        this.propagateChange = null;
        this.colors = [];
        this.selectedColor = null;
        this.columns = 8;
        this.tileSize = 24;
        this.valueChange = new EventEmitter();
    }
    ngOnInit() { }
    onColorSelect(color) {
        if (this.selectedColor === color) {
            this.selectedColor = null;
            this.propagateChange?.(null);
            this.valueChange.emit(null);
            return;
        }
        this.selectedColor = color;
        this.valueChange.emit(color);
        this.propagateChange?.(color);
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        void 0;
    }
    writeValue(obj) {
        this.selectedColor = this.colors.find(c => c === obj) ?? null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPaletteComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ColorPaletteComponent, selector: "mona-color-palette", inputs: { columns: "columns", palette: "palette", tileSize: "tileSize", value: "value" }, outputs: { valueChange: "valueChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ColorPaletteComponent),
                multi: true
            }
        ], ngImport: i0, template: "<div class=\"mona-color-palette\" [style.grid-template-columns]=\"'repeat('+columns+', minmax('+tileSize+'px, 1fr))'\"\n     [style.grid-auto-rows]=\"tileSize+'px'\">\n    <ng-container *ngFor=\"let color of colors\">\n        <div class=\"mona-color-cell\" [ngClass]=\"{'mona-selected': color===selectedColor}\"\n             [style.background-color]=\"color\" (click)=\"onColorSelect(color)\"></div>\n    </ng-container>\n</div>\n", styles: ["div.mona-color-palette{display:grid;grid-gap:1px;padding:1px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPaletteComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-color-palette", providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => ColorPaletteComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-color-palette\" [style.grid-template-columns]=\"'repeat('+columns+', minmax('+tileSize+'px, 1fr))'\"\n     [style.grid-auto-rows]=\"tileSize+'px'\">\n    <ng-container *ngFor=\"let color of colors\">\n        <div class=\"mona-color-cell\" [ngClass]=\"{'mona-selected': color===selectedColor}\"\n             [style.background-color]=\"color\" (click)=\"onColorSelect(color)\"></div>\n    </ng-container>\n</div>\n", styles: ["div.mona-color-palette{display:grid;grid-gap:1px;padding:1px}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { columns: [{
                type: Input
            }], palette: [{
                type: Input
            }], tileSize: [{
                type: Input
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItcGFsZXR0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvaW5wdXRzL21vZHVsZXMvY29sb3ItcGFsZXR0ZS9jb21wb25lbnRzL2NvbG9yLXBhbGV0dGUvY29sb3ItcGFsZXR0ZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvaW5wdXRzL21vZHVsZXMvY29sb3ItcGFsZXR0ZS9jb21wb25lbnRzL2NvbG9yLXBhbGV0dGUvY29sb3ItcGFsZXR0ZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzRixPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztBQWV6RSxNQUFNLE9BQU8scUJBQXFCO0lBUTlCLElBQ1csT0FBTyxDQUFDLE9BQXlCO1FBQ3hDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBS0QsSUFDVyxLQUFLLENBQUMsS0FBb0I7UUFDakMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ25GLENBQUM7SUFFRCxJQUFXLEtBQUs7UUFDWixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDOUIsQ0FBQztJQUtEO1FBM0JRLG9CQUFlLEdBQWlDLElBQUksQ0FBQztRQUN0RCxXQUFNLEdBQWEsRUFBRSxDQUFDO1FBQ3RCLGtCQUFhLEdBQWtCLElBQUksQ0FBQztRQUdwQyxZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBUXBCLGFBQVEsR0FBVyxFQUFFLENBQUM7UUFZdEIsZ0JBQVcsR0FBZ0MsSUFBSSxZQUFZLEVBQWlCLENBQUM7SUFFOUQsQ0FBQztJQUVoQixRQUFRLEtBQVUsQ0FBQztJQUVuQixhQUFhLENBQUMsS0FBYTtRQUM5QixJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssS0FBSyxFQUFFO1lBQzlCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzFCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVNLGdCQUFnQixDQUFDLEVBQU87UUFDM0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVNLGlCQUFpQixDQUFDLEVBQU87UUFDNUIsS0FBSyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRU0sVUFBVSxDQUFDLEdBQWtCO1FBQ2hDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDO0lBQ2xFLENBQUM7OEdBdERRLHFCQUFxQjtrR0FBckIscUJBQXFCLGdMQVJuQjtZQUNQO2dCQUNJLE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUM7Z0JBQ3BELEtBQUssRUFBRSxJQUFJO2FBQ2Q7U0FDSiwwQkNkTCxrYkFPQTs7MkZEU2EscUJBQXFCO2tCQVpqQyxTQUFTOytCQUNJLG9CQUFvQixhQUduQjt3QkFDUDs0QkFDSSxPQUFPLEVBQUUsaUJBQWlCOzRCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQzs0QkFDcEQsS0FBSyxFQUFFLElBQUk7eUJBQ2Q7cUJBQ0o7MEVBUU0sT0FBTztzQkFEYixLQUFLO2dCQUlLLE9BQU87c0JBRGpCLEtBQUs7Z0JBTUMsUUFBUTtzQkFEZCxLQUFLO2dCQUlLLEtBQUs7c0JBRGYsS0FBSztnQkFVQyxXQUFXO3NCQURqQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIElucHV0LCBPbkluaXQsIE91dHB1dCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9BY3Rpb25cIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibW9uYS1jb2xvci1wYWxldHRlXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9jb2xvci1wYWxldHRlLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL2NvbG9yLXBhbGV0dGUuY29tcG9uZW50LnNjc3NcIl0sXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQ29sb3JQYWxldHRlQ29tcG9uZW50KSxcbiAgICAgICAgICAgIG11bHRpOiB0cnVlXG4gICAgICAgIH1cbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIENvbG9yUGFsZXR0ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAgIHByaXZhdGUgcHJvcGFnYXRlQ2hhbmdlOiBBY3Rpb248c3RyaW5nIHwgbnVsbD4gfCBudWxsID0gbnVsbDtcbiAgICBwdWJsaWMgY29sb3JzOiBzdHJpbmdbXSA9IFtdO1xuICAgIHB1YmxpYyBzZWxlY3RlZENvbG9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGNvbHVtbnM6IG51bWJlciA9IDg7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgcGFsZXR0ZShwYWxldHRlOiBJdGVyYWJsZTxzdHJpbmc+KSB7XG4gICAgICAgIHRoaXMuY29sb3JzID0gQXJyYXkuZnJvbShwYWxldHRlKTtcbiAgICB9XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0aWxlU2l6ZTogbnVtYmVyID0gMjQ7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IHN0cmluZyB8IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZENvbG9yID0gdmFsdWUgPyB0aGlzLmNvbG9ycy5maW5kKGMgPT4gYyA9PT0gdmFsdWUpID8/IG51bGwgOiBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkQ29sb3I7XG4gICAgfVxuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8c3RyaW5nIHwgbnVsbD4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZyB8IG51bGw+KCk7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge31cblxuICAgIHB1YmxpYyBvbkNvbG9yU2VsZWN0KGNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRDb2xvciA9PT0gY29sb3IpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRDb2xvciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZT8uKG51bGwpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRDb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQoY29sb3IpO1xuICAgICAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZT8uKGNvbG9yKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcbiAgICAgICAgdm9pZCAwO1xuICAgIH1cblxuICAgIHB1YmxpYyB3cml0ZVZhbHVlKG9iajogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlbGVjdGVkQ29sb3IgPSB0aGlzLmNvbG9ycy5maW5kKGMgPT4gYyA9PT0gb2JqKSA/PyBudWxsO1xuICAgIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtb25hLWNvbG9yLXBhbGV0dGVcIiBbc3R5bGUuZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zXT1cIidyZXBlYXQoJytjb2x1bW5zKycsIG1pbm1heCgnK3RpbGVTaXplKydweCwgMWZyKSknXCJcbiAgICAgW3N0eWxlLmdyaWQtYXV0by1yb3dzXT1cInRpbGVTaXplKydweCdcIj5cbiAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBjb2xvciBvZiBjb2xvcnNcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vbmEtY29sb3ItY2VsbFwiIFtuZ0NsYXNzXT1cInsnbW9uYS1zZWxlY3RlZCc6IGNvbG9yPT09c2VsZWN0ZWRDb2xvcn1cIlxuICAgICAgICAgICAgIFtzdHlsZS5iYWNrZ3JvdW5kLWNvbG9yXT1cImNvbG9yXCIgKGNsaWNrKT1cIm9uQ29sb3JTZWxlY3QoY29sb3IpXCI+PC9kaXY+XG4gICAgPC9uZy1jb250YWluZXI+XG48L2Rpdj5cbiJdfQ==