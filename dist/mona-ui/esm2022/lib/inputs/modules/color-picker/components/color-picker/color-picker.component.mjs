import { Component, EventEmitter, forwardRef, Input, Output } from "@angular/core";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../../../../../popup/components/popup/popup.component";
import * as i3 from "../../../color-palette/components/color-palette/color-palette.component";
import * as i4 from "@fortawesome/angular-fontawesome";
export class ColorPickerComponent {
    set value(value) {
        this.color = value;
    }
    get value() {
        return this.color;
    }
    constructor() {
        this.propagateChange = null;
        this.noColorIcon = faTimes;
        this.dropdownIcon = faChevronDown;
        this.color = null;
        this.palette = [];
        this.valueChange = new EventEmitter();
    }
    ngOnInit() { }
    onColorPaletteValueChange(value) {
        this.color = value;
        this.valueChange.emit(value);
        this.propagateChange?.(value);
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        void 0;
    }
    writeValue(obj) {
        this.color = obj;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPickerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ColorPickerComponent, selector: "mona-color-picker", inputs: { palette: "palette", value: "value" }, outputs: { valueChange: "valueChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ColorPickerComponent),
                multi: true
            }
        ], ngImport: i0, template: "<div class=\"mona-color-picker mona-input-selector\" [attr.tabindex]=\"0\" #colorPickerAnchor>\n    <div [style.background]=\"value\" class=\"mona-input-selector-value\">\n        <fa-icon [icon]=\"noColorIcon\" *ngIf=\"!value\"></fa-icon>\n    </div>\n    <div class=\"mona-input-selector-icon\">\n        <fa-icon [icon]=\"dropdownIcon\"></fa-icon>\n    </div>\n</div>\n\n<mona-popup [anchor]=\"colorPickerAnchor\" popupClass=\"mona-color-picker-popup\" width=\"auto\">\n    <ng-template>\n        <mona-color-palette [palette]=\"palette\" [columns]=\"8\" [value]=\"color\"\n                            (valueChange)=\"onColorPaletteValueChange($event)\"></mona-color-palette>\n    </ng-template>\n</mona-popup>\n", styles: [".mona-color-picker{height:var(--mona-input-height);display:flex;align-items:center}.mona-color-picker>div{display:flex;align-items:center;justify-content:center}.mona-color-picker>div:first-child{display:flex;width:calc(var(--mona-input-height) - 8px);height:calc(var(--mona-input-height) - 8px);margin-left:4px}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.PopupComponent, selector: "mona-popup", inputs: ["anchor", "closeOnEscape", "height", "maxHeight", "maxWidth", "minHeight", "minWidth", "offset", "popupClass", "trigger", "width"], outputs: ["close", "open"] }, { kind: "component", type: i3.ColorPaletteComponent, selector: "mona-color-palette", inputs: ["columns", "palette", "tileSize", "value"], outputs: ["valueChange"] }, { kind: "component", type: i4.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPickerComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-color-picker", providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => ColorPickerComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-color-picker mona-input-selector\" [attr.tabindex]=\"0\" #colorPickerAnchor>\n    <div [style.background]=\"value\" class=\"mona-input-selector-value\">\n        <fa-icon [icon]=\"noColorIcon\" *ngIf=\"!value\"></fa-icon>\n    </div>\n    <div class=\"mona-input-selector-icon\">\n        <fa-icon [icon]=\"dropdownIcon\"></fa-icon>\n    </div>\n</div>\n\n<mona-popup [anchor]=\"colorPickerAnchor\" popupClass=\"mona-color-picker-popup\" width=\"auto\">\n    <ng-template>\n        <mona-color-palette [palette]=\"palette\" [columns]=\"8\" [value]=\"color\"\n                            (valueChange)=\"onColorPaletteValueChange($event)\"></mona-color-palette>\n    </ng-template>\n</mona-popup>\n", styles: [".mona-color-picker{height:var(--mona-input-height);display:flex;align-items:center}.mona-color-picker>div{display:flex;align-items:center;justify-content:center}.mona-color-picker>div:first-child{display:flex;width:calc(var(--mona-input-height) - 8px);height:calc(var(--mona-input-height) - 8px);margin-left:4px}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { palette: [{
                type: Input
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItcGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9pbnB1dHMvbW9kdWxlcy9jb2xvci1waWNrZXIvY29tcG9uZW50cy9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9pbnB1dHMvbW9kdWxlcy9jb2xvci1waWNrZXIvY29tcG9uZW50cy9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNGLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFrQixNQUFNLG1DQUFtQyxDQUFDO0FBQzNGLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7O0FBZXpFLE1BQU0sT0FBTyxvQkFBb0I7SUFTN0IsSUFDVyxLQUFLLENBQUMsS0FBb0I7UUFDakMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUNELElBQVcsS0FBSztRQUNaLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBS0Q7UUFuQlEsb0JBQWUsR0FBaUMsSUFBSSxDQUFDO1FBQzdDLGdCQUFXLEdBQW1CLE9BQU8sQ0FBQztRQUN0QyxpQkFBWSxHQUFtQixhQUFhLENBQUM7UUFDdEQsVUFBSyxHQUFrQixJQUFJLENBQUM7UUFHNUIsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQVd2QixnQkFBVyxHQUFnQyxJQUFJLFlBQVksRUFBaUIsQ0FBQztJQUU5RCxDQUFDO0lBRWhCLFFBQVEsS0FBVSxDQUFDO0lBRW5CLHlCQUF5QixDQUFDLEtBQW9CO1FBQ2pELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sZ0JBQWdCLENBQUMsRUFBTztRQUMzQixJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRU0saUJBQWlCLENBQUMsRUFBTztRQUM1QixLQUFLLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFTSxVQUFVLENBQUMsR0FBa0I7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7SUFDckIsQ0FBQzs4R0F4Q1Esb0JBQW9CO2tHQUFwQixvQkFBb0IscUlBUmxCO1lBQ1A7Z0JBQ0ksT0FBTyxFQUFFLGlCQUFpQjtnQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztnQkFDbkQsS0FBSyxFQUFFLElBQUk7YUFDZDtTQUNKLDBCQ2ZMLDZzQkFlQTs7MkZERWEsb0JBQW9CO2tCQVpoQyxTQUFTOytCQUNJLG1CQUFtQixhQUdsQjt3QkFDUDs0QkFDSSxPQUFPLEVBQUUsaUJBQWlCOzRCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxxQkFBcUIsQ0FBQzs0QkFDbkQsS0FBSyxFQUFFLElBQUk7eUJBQ2Q7cUJBQ0o7MEVBU00sT0FBTztzQkFEYixLQUFLO2dCQUlLLEtBQUs7c0JBRGYsS0FBSztnQkFTQyxXQUFXO3NCQURqQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIElucHV0LCBPbkluaXQsIE91dHB1dCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBmYUNoZXZyb25Eb3duLCBmYVRpbWVzLCBJY29uRGVmaW5pdGlvbiB9IGZyb20gXCJAZm9ydGF3ZXNvbWUvZnJlZS1zb2xpZC1zdmctaWNvbnNcIjtcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3V0aWxzL0FjdGlvblwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJtb25hLWNvbG9yLXBpY2tlclwiLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vY29sb3ItcGlja2VyLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL2NvbG9yLXBpY2tlci5jb21wb25lbnQuc2Nzc1wiXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICAgICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBDb2xvclBpY2tlckNvbXBvbmVudCksXG4gICAgICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgICB9XG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBDb2xvclBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAgIHByaXZhdGUgcHJvcGFnYXRlQ2hhbmdlOiBBY3Rpb248c3RyaW5nIHwgbnVsbD4gfCBudWxsID0gbnVsbDtcbiAgICBwdWJsaWMgcmVhZG9ubHkgbm9Db2xvckljb246IEljb25EZWZpbml0aW9uID0gZmFUaW1lcztcbiAgICBwdWJsaWMgcmVhZG9ubHkgZHJvcGRvd25JY29uOiBJY29uRGVmaW5pdGlvbiA9IGZhQ2hldnJvbkRvd247XG4gICAgcHVibGljIGNvbG9yOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHBhbGV0dGU6IHN0cmluZ1tdID0gW107XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IHN0cmluZyB8IG51bGwpIHtcbiAgICAgICAgdGhpcy5jb2xvciA9IHZhbHVlO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IHN0cmluZyB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xvcjtcbiAgICB9XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgdmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxzdHJpbmcgfCBudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nIHwgbnVsbD4oKTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7fVxuXG4gICAgcHVibGljIG9uQ29sb3JQYWxldHRlVmFsdWVDaGFuZ2UodmFsdWU6IHN0cmluZyB8IG51bGwpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb2xvciA9IHZhbHVlO1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodmFsdWUpO1xuICAgICAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZT8uKHZhbHVlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcbiAgICAgICAgdm9pZCAwO1xuICAgIH1cblxuICAgIHB1YmxpYyB3cml0ZVZhbHVlKG9iajogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbG9yID0gb2JqO1xuICAgIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtb25hLWNvbG9yLXBpY2tlciBtb25hLWlucHV0LXNlbGVjdG9yXCIgW2F0dHIudGFiaW5kZXhdPVwiMFwiICNjb2xvclBpY2tlckFuY2hvcj5cbiAgICA8ZGl2IFtzdHlsZS5iYWNrZ3JvdW5kXT1cInZhbHVlXCIgY2xhc3M9XCJtb25hLWlucHV0LXNlbGVjdG9yLXZhbHVlXCI+XG4gICAgICAgIDxmYS1pY29uIFtpY29uXT1cIm5vQ29sb3JJY29uXCIgKm5nSWY9XCIhdmFsdWVcIj48L2ZhLWljb24+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1vbmEtaW5wdXQtc2VsZWN0b3ItaWNvblwiPlxuICAgICAgICA8ZmEtaWNvbiBbaWNvbl09XCJkcm9wZG93bkljb25cIj48L2ZhLWljb24+XG4gICAgPC9kaXY+XG48L2Rpdj5cblxuPG1vbmEtcG9wdXAgW2FuY2hvcl09XCJjb2xvclBpY2tlckFuY2hvclwiIHBvcHVwQ2xhc3M9XCJtb25hLWNvbG9yLXBpY2tlci1wb3B1cFwiIHdpZHRoPVwiYXV0b1wiPlxuICAgIDxuZy10ZW1wbGF0ZT5cbiAgICAgICAgPG1vbmEtY29sb3ItcGFsZXR0ZSBbcGFsZXR0ZV09XCJwYWxldHRlXCIgW2NvbHVtbnNdPVwiOFwiIFt2YWx1ZV09XCJjb2xvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbHVlQ2hhbmdlKT1cIm9uQ29sb3JQYWxldHRlVmFsdWVDaGFuZ2UoJGV2ZW50KVwiPjwvbW9uYS1jb2xvci1wYWxldHRlPlxuICAgIDwvbmctdGVtcGxhdGU+XG48L21vbmEtcG9wdXA+XG4iXX0=