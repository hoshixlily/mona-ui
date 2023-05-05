import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { DateTime } from "luxon";
import * as i0 from "@angular/core";
export class AbstractDateInputComponent {
    #value;
    #propagateChange;
    set value(date) {
        this.#value = date;
        if (date) {
            this.currentDateString = DateTime.fromJSDate(date).toFormat(this.format);
        }
        else {
            this.currentDateString = "";
        }
    }
    get value() {
        return this.#value;
    }
    constructor(cdr) {
        this.cdr = cdr;
        this.#value = null;
        this.#propagateChange = null;
        this.componentDestroy$ = new Subject();
        this.popupRef = null;
        this.currentDateString = "";
        this.navigatedDate = new Date();
        this.disabled = false;
        this.disabledDates = [];
        this.format = "HH:mm";
        this.max = null;
        this.min = null;
        this.readonly = false;
        this.valueChange = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes["hourFormat"] && this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        }
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() {
        this.setDateValues();
    }
    registerOnChange(fn) {
        this.#propagateChange = fn;
    }
    registerOnTouched(fn) { }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    writeValue(obj) {
        if (obj == null) {
            this.value = null;
        }
        else if (obj instanceof Date) {
            this.value = obj;
        }
        this.setDateValues();
    }
    setCurrentDate(date) {
        this.#value = date;
        if (date) {
            this.currentDateString = DateTime.fromJSDate(date).toFormat(this.format);
        }
        else {
            this.currentDateString = "";
        }
        this.valueChange.emit(date);
        this.#propagateChange?.(date);
        this.cdr.markForCheck();
    }
    dateStringEquals(date1, date2) {
        if (date1 && date2) {
            return (DateTime.fromJSDate(date1).toFormat(this.format) === DateTime.fromJSDate(date2).toFormat(this.format));
        }
        return date1 === date2;
    }
    setDateValues() {
        this.navigatedDate = this.value ?? DateTime.now().toJSDate();
        if (this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractDateInputComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: AbstractDateInputComponent, isStandalone: true, selector: "ng-component", inputs: { disabled: "disabled", disabledDates: "disabledDates", format: "format", max: "max", min: "min", readonly: "readonly", value: "value" }, outputs: { valueChange: "valueChange" }, viewQueries: [{ propertyName: "popupAnchor", first: true, predicate: ["popupAnchor"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "", isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractDateInputComponent, decorators: [{
            type: Component,
            args: [{ standalone: true, imports: [CommonModule], template: "", changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { disabled: [{
                type: Input
            }], disabledDates: [{
                type: Input
            }], format: [{
                type: Input
            }], max: [{
                type: Input
            }], min: [{
                type: Input
            }], popupAnchor: [{
                type: ViewChild,
                args: ["popupAnchor"]
            }], readonly: [{
                type: Input
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QtZGF0ZS1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZGF0ZS1pbnB1dHMvY29tcG9uZW50cy9hYnN0cmFjdC1kYXRlLWlucHV0L2Fic3RyYWN0LWRhdGUtaW5wdXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCx1QkFBdUIsRUFFdkIsU0FBUyxFQUVULFlBQVksRUFDWixLQUFLLEVBSUwsTUFBTSxFQUVOLFNBQVMsRUFDWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sT0FBTyxDQUFDOztBQVdqQyxNQUFNLE9BQWdCLDBCQUEwQjtJQUM1QyxNQUFNLENBQXFCO0lBQzNCLGdCQUFnQixDQUFvQztJQTJCcEQsSUFDVyxLQUFLLENBQUMsSUFBaUI7UUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxJQUFJLEVBQUU7WUFDTixJQUFJLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVFO2FBQU07WUFDSCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO1NBQy9CO0lBQ0wsQ0FBQztJQUVELElBQVcsS0FBSztRQUNaLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBS0QsWUFBeUMsR0FBc0I7UUFBdEIsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUE3Qy9ELFdBQU0sR0FBZ0IsSUFBSSxDQUFDO1FBQzNCLHFCQUFnQixHQUEr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QVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM3RCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDWixJQUFJLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNsRjtJQUNMLENBQUM7OEdBNUdpQiwwQkFBMEI7a0dBQTFCLDBCQUEwQixvWUFKbEMsRUFBRSwyREFERixZQUFZOzsyRkFLSiwwQkFBMEI7a0JBUC9DLFNBQVM7aUNBQ00sSUFBSSxXQUNQLENBQUMsWUFBWSxDQUFDLFlBQ2IsRUFBRSxtQkFFSyx1QkFBdUIsQ0FBQyxNQUFNO3dHQVd4QyxRQUFRO3NCQURkLEtBQUs7Z0JBSUMsYUFBYTtzQkFEbkIsS0FBSztnQkFJQyxNQUFNO3NCQURaLEtBQUs7Z0JBSUMsR0FBRztzQkFEVCxLQUFLO2dCQUlDLEdBQUc7c0JBRFQsS0FBSztnQkFJQyxXQUFXO3NCQURqQixTQUFTO3VCQUFDLGFBQWE7Z0JBSWpCLFFBQVE7c0JBRGQsS0FBSztnQkFJSyxLQUFLO3NCQURmLEtBQUs7Z0JBZUMsV0FBVztzQkFEakIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29tcG9uZW50LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIElucHV0LFxuICAgIE9uQ2hhbmdlcyxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIE91dHB1dCxcbiAgICBTaW1wbGVDaGFuZ2VzLFxuICAgIFZpZXdDaGlsZFxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQgeyBQb3B1cFJlZiB9IGZyb20gXCIuLi8uLi8uLi9wb3B1cC9tb2RlbHMvUG9wdXBSZWZcIjtcbmltcG9ydCB7IERhdGVUaW1lIH0gZnJvbSBcImx1eG9uXCI7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL0FjdGlvblwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzdGFuZGFsb25lOiB0cnVlLFxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIHRlbXBsYXRlOiBcIlwiLFxuICAgIHN0eWxlVXJsczogW10sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3REYXRlSW5wdXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgI3ZhbHVlOiBEYXRlIHwgbnVsbCA9IG51bGw7XG4gICAgI3Byb3BhZ2F0ZUNoYW5nZTogQWN0aW9uPERhdGUgfCBudWxsPiB8IG51bGwgPSBudWxsO1xuICAgIHByb3RlY3RlZCByZWFkb25seSBjb21wb25lbnREZXN0cm95JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgcHJvdGVjdGVkIHBvcHVwUmVmOiBQb3B1cFJlZiB8IG51bGwgPSBudWxsO1xuICAgIHB1YmxpYyBjdXJyZW50RGF0ZVN0cmluZzogc3RyaW5nID0gXCJcIjtcbiAgICBwdWJsaWMgbmF2aWdhdGVkRGF0ZTogRGF0ZSA9IG5ldyBEYXRlKCk7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZGlzYWJsZWREYXRlczogSXRlcmFibGU8RGF0ZT4gPSBbXTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGZvcm1hdDogc3RyaW5nID0gXCJISDptbVwiO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbWF4OiBEYXRlIHwgbnVsbCA9IG51bGw7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBtaW46IERhdGUgfCBudWxsID0gbnVsbDtcblxuICAgIEBWaWV3Q2hpbGQoXCJwb3B1cEFuY2hvclwiKVxuICAgIHB1YmxpYyBwb3B1cEFuY2hvciE6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgcmVhZG9ubHk6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCB2YWx1ZShkYXRlOiBEYXRlIHwgbnVsbCkge1xuICAgICAgICB0aGlzLiN2YWx1ZSA9IGRhdGU7XG4gICAgICAgIGlmIChkYXRlKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlU3RyaW5nID0gRGF0ZVRpbWUuZnJvbUpTRGF0ZShkYXRlKS50b0Zvcm1hdCh0aGlzLmZvcm1hdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlU3RyaW5nID0gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogRGF0ZSB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy4jdmFsdWU7XG4gICAgfVxuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8RGF0ZSB8IG51bGw+ID0gbmV3IEV2ZW50RW1pdHRlcjxEYXRlIHwgbnVsbD4oKTtcblxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVhZG9ubHkgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICAgIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIGlmIChjaGFuZ2VzW1wiaG91ckZvcm1hdFwiXSAmJiB0aGlzLnZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlU3RyaW5nID0gRGF0ZVRpbWUuZnJvbUpTRGF0ZSh0aGlzLnZhbHVlKS50b0Zvcm1hdCh0aGlzLmZvcm1hdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50RGVzdHJveSQubmV4dCgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudERlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNldERhdGVWYWx1ZXMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMuI3Byb3BhZ2F0ZUNoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7fVxuXG4gICAgcHVibGljIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgd3JpdGVWYWx1ZShvYmo6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAob2JqID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICAgICAgICB9IGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBvYmo7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXREYXRlVmFsdWVzKCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldEN1cnJlbnREYXRlKGRhdGU6IERhdGUgfCBudWxsKTogdm9pZCB7XG4gICAgICAgIHRoaXMuI3ZhbHVlID0gZGF0ZTtcbiAgICAgICAgaWYgKGRhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGVTdHJpbmcgPSBEYXRlVGltZS5mcm9tSlNEYXRlKGRhdGUpLnRvRm9ybWF0KHRoaXMuZm9ybWF0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGVTdHJpbmcgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdChkYXRlKTtcbiAgICAgICAgdGhpcy4jcHJvcGFnYXRlQ2hhbmdlPy4oZGF0ZSk7XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBkYXRlU3RyaW5nRXF1YWxzKGRhdGUxOiBEYXRlIHwgbnVsbCwgZGF0ZTI6IERhdGUgfCBudWxsKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChkYXRlMSAmJiBkYXRlMikge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICBEYXRlVGltZS5mcm9tSlNEYXRlKGRhdGUxKS50b0Zvcm1hdCh0aGlzLmZvcm1hdCkgPT09IERhdGVUaW1lLmZyb21KU0RhdGUoZGF0ZTIpLnRvRm9ybWF0KHRoaXMuZm9ybWF0KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTEgPT09IGRhdGUyO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0RGF0ZVZhbHVlcygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZWREYXRlID0gdGhpcy52YWx1ZSA/PyBEYXRlVGltZS5ub3coKS50b0pTRGF0ZSgpO1xuICAgICAgICBpZiAodGhpcy52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZVN0cmluZyA9IERhdGVUaW1lLmZyb21KU0RhdGUodGhpcy52YWx1ZSkudG9Gb3JtYXQodGhpcy5mb3JtYXQpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19