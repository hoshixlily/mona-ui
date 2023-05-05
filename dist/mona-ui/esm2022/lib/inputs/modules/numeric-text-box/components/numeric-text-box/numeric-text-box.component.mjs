import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output, ViewChild } from "@angular/core";
import { delay, interval, Subject, takeUntil } from "rxjs";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
import * as i4 from "@fortawesome/angular-fontawesome";
import * as i5 from "../../../../../buttons/modules/button/directives/button.directive";
import * as i6 from "../../../text-box/directives/text-box.directive";
export class NumericTextBoxComponent {
    set value(value) {
        this.updateValue(value == null ? null : String(value), false);
    }
    get value() {
        return this.componentValue;
    }
    constructor(elementRef, focusMonitor) {
        this.elementRef = elementRef;
        this.focusMonitor = focusMonitor;
        this.componentDestroy$ = new Subject();
        this.specialKeys = [
            "Backspace",
            "Tab",
            "End",
            "Home",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Delete",
            "Escaped"
        ];
        this.propagateChange = null;
        this.decreaseIcon = faChevronDown;
        this.increaseIcon = faChevronUp;
        this.componentValue = null;
        this.spin$ = new Subject();
        this.spinStop$ = new Subject();
        this.value$ = new Subject();
        this.visibleValue = "";
        this.decimals = 0;
        this.disabled = false;
        this.formatter = (value) => value?.toFixed(this.decimals ?? 2) ?? "";
        this.inputBlur = new EventEmitter();
        this.inputFocus = new EventEmitter();
        this.readonly = false;
        this.spinners = true;
        this.step = 1;
        this.valueChange = new EventEmitter();
    }
    static calculate(value, step, type) {
        const precision = Math.max(NumericTextBoxComponent.getPrecision(value), NumericTextBoxComponent.getPrecision(step));
        const factor = Math.pow(10, precision);
        const signFactor = type === "+" ? 1 : -1;
        const newValue = (value * factor + signFactor * step * factor) / factor;
        return precision > 0 ? parseFloat(newValue.toFixed(precision)) : newValue;
    }
    static getPrecision(value) {
        const valueString = value.toString();
        if (valueString.includes(".")) {
            const parts = valueString.split(".");
            return parts[1].length;
        }
        return 0;
    }
    static isNumeric(value) {
        return ((typeof value === "number" || (typeof value === "string" && value.trim() !== "")) && !isNaN(value));
    }
    decrease() {
        if (this.componentValue == null) {
            this.value$.next("0");
        }
        else {
            let result = NumericTextBoxComponent.calculate(this.componentValue, this.step, "-");
            if (this.min != null && result < this.min) {
                result = this.min;
            }
            this.value$.next(result.toString());
        }
        this.focus();
    }
    increase() {
        if (this.componentValue == null) {
            this.value$.next("0");
        }
        else {
            let result = NumericTextBoxComponent.calculate(this.componentValue, this.step, "+");
            if (this.max != null && result > this.max) {
                result = this.max;
            }
            this.value$.next(result.toString());
        }
        this.focus();
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
        this.spinStop$.next();
        this.spinStop$.complete();
        this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
    }
    ngOnInit() {
        this.setSubscriptions();
        this.focusMonitor
            .monitor(this.elementRef, true)
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((focusOrigin) => {
            if (!focusOrigin) {
                this.visibleValue = this.formatter(this.componentValue) ?? "";
            }
            else {
                this.visibleValue = this.componentValue ?? "";
            }
        });
    }
    onKeydown(event) {
        if (event.ctrlKey) {
            return;
        }
        if (event.key === "ArrowUp") {
            event.preventDefault();
            this.increase();
            return;
        }
        if (event.key === "ArrowDown") {
            event.preventDefault();
            this.decrease();
            return;
        }
        if (!this.specialKeys.includes(event.key)) {
            if (this.preventInvalidMinusSign(event)) {
                return;
            }
            if (!event.key.match(/[0-9.,\-]/)) {
                event.preventDefault();
                return;
            }
            if (this.containsExcessiveDecimalPlaces(event)) {
                event.preventDefault();
            }
        }
    }
    onMouseWheel(event) {
        event.preventDefault();
        if (event.deltaY < 0) {
            this.increase();
        }
        else {
            this.decrease();
        }
    }
    onPaste(event) {
        const pastedData = event.clipboardData?.getData("Text");
        if (!pastedData || !NumericTextBoxComponent.isNumeric(pastedData)) {
            event.preventDefault();
        }
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) { }
    writeValue(obj) {
        if (obj == null) {
            this.componentValue = null;
            this.visibleValue = this.formatter(this.componentValue) ?? "";
            return;
        }
        if (typeof obj === "string" && !NumericTextBoxComponent.isNumeric(obj)) {
            throw new Error("Value must be a number.");
        }
        this.componentValue = +obj;
        this.visibleValue = this.formatter(this.componentValue) ?? "";
    }
    containsExcessiveDecimalPlaces(event) {
        const target = event.target;
        if (this.componentValue != null) {
            if (event.key === ".") {
                return this.decimals === 0;
            }
            const valueStr = this.componentValue.toString();
            if (!valueStr.includes(".")) {
                return false;
            }
            const valueParts = valueStr.split(".");
            if (this.decimals != null &&
                valueParts[1].length >= this.decimals &&
                target.selectionStart &&
                target.selectionStart > valueParts[0].length) {
                return true;
            }
        }
        return false;
    }
    focus() {
        this.focusMonitor.focusVia(this.valueTextBoxRef, "keyboard");
    }
    preventInvalidMinusSign(event) {
        const target = event.target;
        if (event.key === "-") {
            if (target.selectionStart !== 0) {
                event.preventDefault();
                return true;
            }
            if (target.selectionStart === 0 && this.componentValue?.toString().charAt(0) === "-") {
                event.preventDefault();
                return true;
            }
        }
        return false;
    }
    setSubscriptions() {
        this.value$.pipe(takeUntil(this.componentDestroy$)).subscribe((value) => {
            this.updateValue(value);
        });
        this.spin$.pipe(takeUntil(this.componentDestroy$)).subscribe((sign) => {
            if (sign === "-") {
                this.decrease();
            }
            else {
                this.increase();
            }
            interval(100)
                .pipe(delay(300), takeUntil(this.spinStop$))
                .subscribe(() => {
                if (sign === "-") {
                    this.decrease();
                }
                else {
                    this.increase();
                }
            });
        });
    }
    updateValue(value, emit = true) {
        if (this.readonly) {
            return;
        }
        this.componentValue =
            value == null ? null : NumericTextBoxComponent.isNumeric(value) ? parseFloat(value) : null;
        this.visibleValue = this.componentValue == null ? "" : this.componentValue;
        if (emit) {
            this.valueChange.emit(this.componentValue);
            this.propagateChange?.(this.componentValue);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: NumericTextBoxComponent, deps: [{ token: i0.ElementRef }, { token: i1.FocusMonitor }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: NumericTextBoxComponent, selector: "mona-numeric-text-box", inputs: { decimals: "decimals", disabled: "disabled", formatter: "formatter", max: "max", min: "min", readonly: "readonly", spinners: "spinners", step: "step", value: "value" }, outputs: { inputBlur: "inputBlur", inputFocus: "inputFocus", valueChange: "valueChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => NumericTextBoxComponent),
                multi: true
            }
        ], viewQueries: [{ propertyName: "valueTextBoxRef", first: true, predicate: ["valueTextBox"], descendants: true }], ngImport: i0, template: "<div class=\"mona-numeric-text-box\" [ngClass]=\"{'mona-disabled': disabled}\">\n    <input monaTextBox [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"visibleValue\" (ngModelChange)=\"value$.next($event)\"\n           (keydown)=\"onKeydown($event)\" (paste)=\"onPaste($event)\" (wheel)=\"onMouseWheel($event)\" (focus)=\"inputFocus.emit($event)\"\n           (blur)=\"inputBlur.emit($event)\"\n           autocomplete=\"off\" tabindex=\"0\" #valueTextBox>\n    <div class=\"mona-numeric-text-box-spinners\" *ngIf=\"spinners\">\n        <button monaButton [disabled]=\"disabled\" [tabIndex]=\"-1\" (mousedown)=\"spin$.next('+')\" (mouseup)=\"spinStop$.next()\">\n            <fa-icon [icon]=\"increaseIcon\"></fa-icon>\n        </button>\n        <button monaButton [disabled]=\"disabled\" [tabIndex]=\"-1\" (mousedown)=\"spin$.next('-')\" (mouseup)=\"spinStop$.next()\">\n            <fa-icon [icon]=\"decreaseIcon\"></fa-icon>\n        </button>\n    </div>\n</div>\n", styles: ["div.mona-numeric-text-box{height:var(--mona-input-height);display:flex}div.mona-numeric-text-box>[monaTextBox]{width:100%;height:100%;border:none}div.mona-numeric-text-box-spinners{display:flex;flex-direction:column;flex-wrap:nowrap;border-left:1px solid var(--mona-border-color)}div.mona-numeric-text-box-spinners>[monaButton]{min-height:0;display:flex;align-items:center;justify-content:center;border-right:none;border-left:none;flex:1 1 50%;font-size:10px;cursor:pointer}div.mona-numeric-text-box-spinners>[monaButton] fa-icon{display:flex}div.mona-numeric-text-box-spinners>[monaButton]:first-child{border-top:none}div.mona-numeric-text-box-spinners>[monaButton]:first-child>span{transform:rotate(270deg)}div.mona-numeric-text-box-spinners>[monaButton]:last-child{border-bottom:none;border-top:none}div.mona-numeric-text-box-spinners>[monaButton]:last-child>span{transform:rotate(270deg)}div.mona-numeric-text-box-spinners>[monaButton]:active,div.mona-numeric-text-box-spinners>[monaButton]:focus,div.mona-numeric-text-box-spinners>[monaButton]:focus-within{box-shadow:none}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i4.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: i5.ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "directive", type: i6.TextBoxDirective, selector: "input[monaTextBox]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: NumericTextBoxComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-numeric-text-box", changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => NumericTextBoxComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-numeric-text-box\" [ngClass]=\"{'mona-disabled': disabled}\">\n    <input monaTextBox [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"visibleValue\" (ngModelChange)=\"value$.next($event)\"\n           (keydown)=\"onKeydown($event)\" (paste)=\"onPaste($event)\" (wheel)=\"onMouseWheel($event)\" (focus)=\"inputFocus.emit($event)\"\n           (blur)=\"inputBlur.emit($event)\"\n           autocomplete=\"off\" tabindex=\"0\" #valueTextBox>\n    <div class=\"mona-numeric-text-box-spinners\" *ngIf=\"spinners\">\n        <button monaButton [disabled]=\"disabled\" [tabIndex]=\"-1\" (mousedown)=\"spin$.next('+')\" (mouseup)=\"spinStop$.next()\">\n            <fa-icon [icon]=\"increaseIcon\"></fa-icon>\n        </button>\n        <button monaButton [disabled]=\"disabled\" [tabIndex]=\"-1\" (mousedown)=\"spin$.next('-')\" (mouseup)=\"spinStop$.next()\">\n            <fa-icon [icon]=\"decreaseIcon\"></fa-icon>\n        </button>\n    </div>\n</div>\n", styles: ["div.mona-numeric-text-box{height:var(--mona-input-height);display:flex}div.mona-numeric-text-box>[monaTextBox]{width:100%;height:100%;border:none}div.mona-numeric-text-box-spinners{display:flex;flex-direction:column;flex-wrap:nowrap;border-left:1px solid var(--mona-border-color)}div.mona-numeric-text-box-spinners>[monaButton]{min-height:0;display:flex;align-items:center;justify-content:center;border-right:none;border-left:none;flex:1 1 50%;font-size:10px;cursor:pointer}div.mona-numeric-text-box-spinners>[monaButton] fa-icon{display:flex}div.mona-numeric-text-box-spinners>[monaButton]:first-child{border-top:none}div.mona-numeric-text-box-spinners>[monaButton]:first-child>span{transform:rotate(270deg)}div.mona-numeric-text-box-spinners>[monaButton]:last-child{border-bottom:none;border-top:none}div.mona-numeric-text-box-spinners>[monaButton]:last-child>span{transform:rotate(270deg)}div.mona-numeric-text-box-spinners>[monaButton]:active,div.mona-numeric-text-box-spinners>[monaButton]:focus,div.mona-numeric-text-box-spinners>[monaButton]:focus-within{box-shadow:none}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.FocusMonitor }]; }, propDecorators: { decimals: [{
                type: Input
            }], disabled: [{
                type: Input
            }], formatter: [{
                type: Input
            }], inputBlur: [{
                type: Output
            }], inputFocus: [{
                type: Output
            }], max: [{
                type: Input
            }], min: [{
                type: Input
            }], readonly: [{
                type: Input
            }], spinners: [{
                type: Input
            }], step: [{
                type: Input
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], valueTextBoxRef: [{
                type: ViewChild,
                args: ["valueTextBox"]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtZXJpYy10ZXh0LWJveC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvaW5wdXRzL21vZHVsZXMvbnVtZXJpYy10ZXh0LWJveC9jb21wb25lbnRzL251bWVyaWMtdGV4dC1ib3gvbnVtZXJpYy10ZXh0LWJveC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvaW5wdXRzL21vZHVsZXMvbnVtZXJpYy10ZXh0LWJveC9jb21wb25lbnRzL251bWVyaWMtdGV4dC1ib3gvbnVtZXJpYy10ZXh0LWJveC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFFVCxZQUFZLEVBQ1osVUFBVSxFQUNWLEtBQUssRUFHTCxNQUFNLEVBQ04sU0FBUyxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFHM0QsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFrQixNQUFNLG1DQUFtQyxDQUFDOzs7Ozs7OztBQWlCL0YsTUFBTSxPQUFPLHVCQUF1QjtJQXNEaEMsSUFDVyxLQUFLLENBQUMsS0FBb0I7UUFDakMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBQ0QsSUFBVyxLQUFLO1FBQ1osT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lB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QUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUMvQztJQUNMLENBQUM7OEdBN1JRLHVCQUF1QjtrR0FBdkIsdUJBQXVCLDZUQVJyQjtZQUNQO2dCQUNJLE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsdUJBQXVCLENBQUM7Z0JBQ3RELEtBQUssRUFBRSxJQUFJO2FBQ2Q7U0FDSiwySUMvQkwsdTlCQWNBOzsyRkRtQmEsdUJBQXVCO2tCQWJuQyxTQUFTOytCQUNJLHVCQUF1QixtQkFHaEIsdUJBQXVCLENBQUMsTUFBTSxhQUNwQzt3QkFDUDs0QkFDSSxPQUFPLEVBQUUsaUJBQWlCOzRCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSx3QkFBd0IsQ0FBQzs0QkFDdEQsS0FBSyxFQUFFLElBQUk7eUJBQ2Q7cUJBQ0o7NEhBMEJNLFFBQVE7c0JBRGQsS0FBSztnQkFJQyxRQUFRO3NCQURkLEtBQUs7Z0JBSUMsU0FBUztzQkFEZixLQUFLO2dCQUtDLFNBQVM7c0JBRGYsTUFBTTtnQkFJQSxVQUFVO3NCQURoQixNQUFNO2dCQUlBLEdBQUc7c0JBRFQsS0FBSztnQkFJQyxHQUFHO3NCQURULEtBQUs7Z0JBSUMsUUFBUTtzQkFEZCxLQUFLO2dCQUlDLFFBQVE7c0JBRGQsS0FBSztnQkFJQyxJQUFJO3NCQURWLEtBQUs7Z0JBSUssS0FBSztzQkFEZixLQUFLO2dCQVNDLFdBQVc7c0JBRGpCLE1BQU07Z0JBSUEsZUFBZTtzQkFEckIsU0FBUzt1QkFBQyxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDb21wb25lbnQsXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgZm9yd2FyZFJlZixcbiAgICBJbnB1dCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIE91dHB1dCxcbiAgICBWaWV3Q2hpbGRcbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IGRlbGF5LCBpbnRlcnZhbCwgU3ViamVjdCwgdGFrZVVudGlsIH0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7IEZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW4gfSBmcm9tIFwiQGFuZ3VsYXIvY2RrL2ExMXlcIjtcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9BY3Rpb25cIjtcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgZmFDaGV2cm9uRG93biwgZmFDaGV2cm9uVXAsIEljb25EZWZpbml0aW9uIH0gZnJvbSBcIkBmb3J0YXdlc29tZS9mcmVlLXNvbGlkLXN2Zy1pY29uc1wiO1xuXG50eXBlIFNpZ24gPSBcIi1cIiB8IFwiK1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJtb25hLW51bWVyaWMtdGV4dC1ib3hcIixcbiAgICB0ZW1wbGF0ZVVybDogXCIuL251bWVyaWMtdGV4dC1ib3guY29tcG9uZW50Lmh0bWxcIixcbiAgICBzdHlsZVVybHM6IFtcIi4vbnVtZXJpYy10ZXh0LWJveC5jb21wb25lbnQuc2Nzc1wiXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICAgICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOdW1lcmljVGV4dEJveENvbXBvbmVudCksXG4gICAgICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgICB9XG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBOdW1lcmljVGV4dEJveENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21wb25lbnREZXN0cm95JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBzcGVjaWFsS2V5czogc3RyaW5nW10gPSBbXG4gICAgICAgIFwiQmFja3NwYWNlXCIsXG4gICAgICAgIFwiVGFiXCIsXG4gICAgICAgIFwiRW5kXCIsXG4gICAgICAgIFwiSG9tZVwiLFxuICAgICAgICBcIkFycm93TGVmdFwiLFxuICAgICAgICBcIkFycm93UmlnaHRcIixcbiAgICAgICAgXCJBcnJvd1VwXCIsXG4gICAgICAgIFwiQXJyb3dEb3duXCIsXG4gICAgICAgIFwiRGVsZXRlXCIsXG4gICAgICAgIFwiRXNjYXBlZFwiXG4gICAgXTtcbiAgICBwcml2YXRlIHByb3BhZ2F0ZUNoYW5nZTogQWN0aW9uPG51bWJlciB8IG51bGw+IHwgbnVsbCA9IG51bGw7XG4gICAgcHVibGljIHJlYWRvbmx5IGRlY3JlYXNlSWNvbjogSWNvbkRlZmluaXRpb24gPSBmYUNoZXZyb25Eb3duO1xuICAgIHB1YmxpYyByZWFkb25seSBpbmNyZWFzZUljb246IEljb25EZWZpbml0aW9uID0gZmFDaGV2cm9uVXA7XG4gICAgcHVibGljIGNvbXBvbmVudFZhbHVlOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgICBwdWJsaWMgc3BpbiQ6IFN1YmplY3Q8U2lnbj4gPSBuZXcgU3ViamVjdDxTaWduPigpO1xuICAgIHB1YmxpYyBzcGluU3RvcCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICAgIHB1YmxpYyB2YWx1ZSQ6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICBwdWJsaWMgdmlzaWJsZVZhbHVlOiBzdHJpbmcgfCBudW1iZXIgPSBcIlwiO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZGVjaW1hbHM/OiBudW1iZXIgPSAwO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGZvcm1hdHRlcjogQWN0aW9uPG51bWJlciB8IG51bGwsIHN0cmluZz4gPSAodmFsdWU6IG51bWJlciB8IG51bGwpOiBzdHJpbmcgPT5cbiAgICAgICAgdmFsdWU/LnRvRml4ZWQodGhpcy5kZWNpbWFscyA/PyAyKSA/PyBcIlwiO1xuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGlucHV0Qmx1cjogRXZlbnRFbWl0dGVyPEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8RXZlbnQ+KCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgaW5wdXRGb2N1czogRXZlbnRFbWl0dGVyPEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8RXZlbnQ+KCk7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBtYXg/OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBtaW4/OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyByZWFkb25seTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc3Bpbm5lcnM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc3RlcDogbnVtYmVyID0gMTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogbnVtYmVyIHwgbnVsbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKHZhbHVlID09IG51bGwgPyBudWxsIDogU3RyaW5nKHZhbHVlKSwgZmFsc2UpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IG51bWJlciB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRWYWx1ZTtcbiAgICB9XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgdmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXIgfCBudWxsPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyIHwgbnVsbD4oKTtcblxuICAgIEBWaWV3Q2hpbGQoXCJ2YWx1ZVRleHRCb3hcIilcbiAgICBwdWJsaWMgdmFsdWVUZXh0Qm94UmVmITogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBmb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvclxuICAgICkge31cblxuICAgIHByaXZhdGUgc3RhdGljIGNhbGN1bGF0ZSh2YWx1ZTogbnVtYmVyLCBzdGVwOiBudW1iZXIsIHR5cGU6IFNpZ24pOiBudW1iZXIge1xuICAgICAgICBjb25zdCBwcmVjaXNpb24gPSBNYXRoLm1heChcbiAgICAgICAgICAgIE51bWVyaWNUZXh0Qm94Q29tcG9uZW50LmdldFByZWNpc2lvbih2YWx1ZSksXG4gICAgICAgICAgICBOdW1lcmljVGV4dEJveENvbXBvbmVudC5nZXRQcmVjaXNpb24oc3RlcClcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZmFjdG9yID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG4gICAgICAgIGNvbnN0IHNpZ25GYWN0b3IgPSB0eXBlID09PSBcIitcIiA/IDEgOiAtMTtcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPSAodmFsdWUgKiBmYWN0b3IgKyBzaWduRmFjdG9yICogc3RlcCAqIGZhY3RvcikgLyBmYWN0b3I7XG4gICAgICAgIHJldHVybiBwcmVjaXNpb24gPiAwID8gcGFyc2VGbG9hdChuZXdWYWx1ZS50b0ZpeGVkKHByZWNpc2lvbikpIDogbmV3VmFsdWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0UHJlY2lzaW9uKHZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCB2YWx1ZVN0cmluZyA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmICh2YWx1ZVN0cmluZy5pbmNsdWRlcyhcIi5cIikpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gdmFsdWVTdHJpbmcuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHBhcnRzWzFdLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpc051bWVyaWModmFsdWU6IHVua25vd24pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgfHwgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZS50cmltKCkgIT09IFwiXCIpKSAmJiAhaXNOYU4odmFsdWUgYXMgbnVtYmVyKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZWNyZWFzZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50VmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSQubmV4dChcIjBcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gTnVtZXJpY1RleHRCb3hDb21wb25lbnQuY2FsY3VsYXRlKHRoaXMuY29tcG9uZW50VmFsdWUsIHRoaXMuc3RlcCwgXCItXCIpO1xuICAgICAgICAgICAgaWYgKHRoaXMubWluICE9IG51bGwgJiYgcmVzdWx0IDwgdGhpcy5taW4pIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLm1pbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudmFsdWUkLm5leHQocmVzdWx0LnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5jcmVhc2UoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmNvbXBvbmVudFZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUkLm5leHQoXCIwXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IE51bWVyaWNUZXh0Qm94Q29tcG9uZW50LmNhbGN1bGF0ZSh0aGlzLmNvbXBvbmVudFZhbHVlLCB0aGlzLnN0ZXAsIFwiK1wiKTtcbiAgICAgICAgICAgIGlmICh0aGlzLm1heCAhPSBudWxsICYmIHJlc3VsdCA+IHRoaXMubWF4KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5tYXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnZhbHVlJC5uZXh0KHJlc3VsdC50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbXBvbmVudERlc3Ryb3kkLm5leHQoKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnREZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgICAgICB0aGlzLnNwaW5TdG9wJC5uZXh0KCk7XG4gICAgICAgIHRoaXMuc3BpblN0b3AkLmNvbXBsZXRlKCk7XG4gICAgICAgIHRoaXMuZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2V0U3Vic2NyaXB0aW9ucygpO1xuICAgICAgICB0aGlzLmZvY3VzTW9uaXRvclxuICAgICAgICAgICAgLm1vbml0b3IodGhpcy5lbGVtZW50UmVmLCB0cnVlKVxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuY29tcG9uZW50RGVzdHJveSQpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoZm9jdXNPcmlnaW46IEZvY3VzT3JpZ2luKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFmb2N1c09yaWdpbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpc2libGVWYWx1ZSA9IHRoaXMuZm9ybWF0dGVyKHRoaXMuY29tcG9uZW50VmFsdWUpID8/IFwiXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52aXNpYmxlVmFsdWUgPSB0aGlzLmNvbXBvbmVudFZhbHVlID8/IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoZXZlbnQuY3RybEtleSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5rZXkgPT09IFwiQXJyb3dVcFwiKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5pbmNyZWFzZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5rZXkgPT09IFwiQXJyb3dEb3duXCIpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmRlY3JlYXNlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLnNwZWNpYWxLZXlzLmluY2x1ZGVzKGV2ZW50LmtleSkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXZlbnRJbnZhbGlkTWludXNTaWduKGV2ZW50KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZXZlbnQua2V5Lm1hdGNoKC9bMC05LixcXC1dLykpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5zRXhjZXNzaXZlRGVjaW1hbFBsYWNlcyhldmVudCkpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG9uTW91c2VXaGVlbChldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoZXZlbnQuZGVsdGFZIDwgMCkge1xuICAgICAgICAgICAgdGhpcy5pbmNyZWFzZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZWNyZWFzZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG9uUGFzdGUoZXZlbnQ6IENsaXBib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHBhc3RlZERhdGEgPSBldmVudC5jbGlwYm9hcmREYXRhPy5nZXREYXRhKFwiVGV4dFwiKTtcbiAgICAgICAgaWYgKCFwYXN0ZWREYXRhIHx8ICFOdW1lcmljVGV4dEJveENvbXBvbmVudC5pc051bWVyaWMocGFzdGVkRGF0YSkpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KSB7XG4gICAgICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHt9XG5cbiAgICBwdWJsaWMgd3JpdGVWYWx1ZShvYmo6IG51bWJlciB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudFZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZVZhbHVlID0gdGhpcy5mb3JtYXR0ZXIodGhpcy5jb21wb25lbnRWYWx1ZSkgPz8gXCJcIjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIiAmJiAhTnVtZXJpY1RleHRCb3hDb21wb25lbnQuaXNOdW1lcmljKG9iaikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlZhbHVlIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcG9uZW50VmFsdWUgPSArb2JqO1xuICAgICAgICB0aGlzLnZpc2libGVWYWx1ZSA9IHRoaXMuZm9ybWF0dGVyKHRoaXMuY29tcG9uZW50VmFsdWUpID8/IFwiXCI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb250YWluc0V4Y2Vzc2l2ZURlY2ltYWxQbGFjZXMoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgIGlmICh0aGlzLmNvbXBvbmVudFZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT09IFwiLlwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVjaW1hbHMgPT09IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB2YWx1ZVN0ciA9IHRoaXMuY29tcG9uZW50VmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmICghdmFsdWVTdHIuaW5jbHVkZXMoXCIuXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdmFsdWVQYXJ0cyA9IHZhbHVlU3RyLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmRlY2ltYWxzICE9IG51bGwgJiZcbiAgICAgICAgICAgICAgICB2YWx1ZVBhcnRzWzFdLmxlbmd0aCA+PSB0aGlzLmRlY2ltYWxzICYmXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnNlbGVjdGlvblN0YXJ0ICYmXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnNlbGVjdGlvblN0YXJ0ID4gdmFsdWVQYXJ0c1swXS5sZW5ndGhcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZvY3VzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLnZhbHVlVGV4dEJveFJlZiwgXCJrZXlib2FyZFwiKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByZXZlbnRJbnZhbGlkTWludXNTaWduKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBpZiAoZXZlbnQua2V5ID09PSBcIi1cIikge1xuICAgICAgICAgICAgaWYgKHRhcmdldC5zZWxlY3Rpb25TdGFydCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGFyZ2V0LnNlbGVjdGlvblN0YXJ0ID09PSAwICYmIHRoaXMuY29tcG9uZW50VmFsdWU/LnRvU3RyaW5nKCkuY2hhckF0KDApID09PSBcIi1cIikge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0U3Vic2NyaXB0aW9ucygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52YWx1ZSQucGlwZSh0YWtlVW50aWwodGhpcy5jb21wb25lbnREZXN0cm95JCkpLnN1YnNjcmliZSgodmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNwaW4kLnBpcGUodGFrZVVudGlsKHRoaXMuY29tcG9uZW50RGVzdHJveSQpKS5zdWJzY3JpYmUoKHNpZ246IFNpZ24pID0+IHtcbiAgICAgICAgICAgIGlmIChzaWduID09PSBcIi1cIikge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjcmVhc2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNyZWFzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW50ZXJ2YWwoMTAwKVxuICAgICAgICAgICAgICAgIC5waXBlKGRlbGF5KDMwMCksIHRha2VVbnRpbCh0aGlzLnNwaW5TdG9wJCkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaWduID09PSBcIi1cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWNyZWFzZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNyZWFzZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlVmFsdWUodmFsdWU6IHN0cmluZyB8IG51bGwsIGVtaXQ6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnJlYWRvbmx5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wb25lbnRWYWx1ZSA9XG4gICAgICAgICAgICB2YWx1ZSA9PSBudWxsID8gbnVsbCA6IE51bWVyaWNUZXh0Qm94Q29tcG9uZW50LmlzTnVtZXJpYyh2YWx1ZSkgPyBwYXJzZUZsb2F0KHZhbHVlKSA6IG51bGw7XG4gICAgICAgIHRoaXMudmlzaWJsZVZhbHVlID0gdGhpcy5jb21wb25lbnRWYWx1ZSA9PSBudWxsID8gXCJcIiA6IHRoaXMuY29tcG9uZW50VmFsdWU7XG4gICAgICAgIGlmIChlbWl0KSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy5jb21wb25lbnRWYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZT8uKHRoaXMuY29tcG9uZW50VmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm1vbmEtbnVtZXJpYy10ZXh0LWJveFwiIFtuZ0NsYXNzXT1cInsnbW9uYS1kaXNhYmxlZCc6IGRpc2FibGVkfVwiPlxuICAgIDxpbnB1dCBtb25hVGV4dEJveCBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBbcmVhZG9ubHldPVwicmVhZG9ubHlcIiBbbmdNb2RlbF09XCJ2aXNpYmxlVmFsdWVcIiAobmdNb2RlbENoYW5nZSk9XCJ2YWx1ZSQubmV4dCgkZXZlbnQpXCJcbiAgICAgICAgICAgKGtleWRvd24pPVwib25LZXlkb3duKCRldmVudClcIiAocGFzdGUpPVwib25QYXN0ZSgkZXZlbnQpXCIgKHdoZWVsKT1cIm9uTW91c2VXaGVlbCgkZXZlbnQpXCIgKGZvY3VzKT1cImlucHV0Rm9jdXMuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAgKGJsdXIpPVwiaW5wdXRCbHVyLmVtaXQoJGV2ZW50KVwiXG4gICAgICAgICAgIGF1dG9jb21wbGV0ZT1cIm9mZlwiIHRhYmluZGV4PVwiMFwiICN2YWx1ZVRleHRCb3g+XG4gICAgPGRpdiBjbGFzcz1cIm1vbmEtbnVtZXJpYy10ZXh0LWJveC1zcGlubmVyc1wiICpuZ0lmPVwic3Bpbm5lcnNcIj5cbiAgICAgICAgPGJ1dHRvbiBtb25hQnV0dG9uIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFt0YWJJbmRleF09XCItMVwiIChtb3VzZWRvd24pPVwic3BpbiQubmV4dCgnKycpXCIgKG1vdXNldXApPVwic3BpblN0b3AkLm5leHQoKVwiPlxuICAgICAgICAgICAgPGZhLWljb24gW2ljb25dPVwiaW5jcmVhc2VJY29uXCI+PC9mYS1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBtb25hQnV0dG9uIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFt0YWJJbmRleF09XCItMVwiIChtb3VzZWRvd24pPVwic3BpbiQubmV4dCgnLScpXCIgKG1vdXNldXApPVwic3BpblN0b3AkLm5leHQoKVwiPlxuICAgICAgICAgICAgPGZhLWljb24gW2ljb25dPVwiZGVjcmVhc2VJY29uXCI+PC9mYS1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuIl19