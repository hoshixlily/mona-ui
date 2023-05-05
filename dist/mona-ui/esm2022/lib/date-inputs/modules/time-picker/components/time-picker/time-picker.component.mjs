import { ChangeDetectionStrategy, Component, forwardRef, Input, ViewChild } from "@angular/core";
import { AbstractDateInputComponent } from "../../../../components/abstract-date-input/abstract-date-input.component";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { DateTime } from "luxon";
import { take } from "rxjs";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "../../../../../popup/services/popup.service";
import * as i3 from "../../../../../inputs/modules/text-box/components/text-box/text-box.component";
import * as i4 from "../../../../../inputs/modules/text-box/directives/text-box-suffix-template.directive";
import * as i5 from "@fortawesome/angular-fontawesome";
import * as i6 from "../../../../../buttons/modules/button/directives/button.directive";
import * as i7 from "@angular/forms";
import * as i8 from "../../../time-selector/components/time-selector/time-selector.component";
export class TimePickerComponent extends AbstractDateInputComponent {
    constructor(cdr, elementRef, focusMonitor, popupService) {
        super(cdr);
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.focusMonitor = focusMonitor;
        this.popupService = popupService;
        this.timeIcon = faClock;
        this.hourFormat = "24";
        this.showSeconds = false;
    }
    ngOnChanges(changes) {
        super.ngOnChanges(changes);
    }
    ngOnInit() {
        super.ngOnInit();
    }
    onDateStringEdit(dateString) {
        this.currentDateString = dateString;
    }
    onTimeInputBlur() {
        if (this.popupRef) {
            return;
        }
        const dateTime = DateTime.fromFormat(this.currentDateString, this.format);
        if (this.dateStringEquals(dateTime.toJSDate(), this.value)) {
            return;
        }
        if (dateTime.isValid) {
            this.setCurrentDate(dateTime.toJSDate());
        }
        else {
            this.setCurrentDate(null);
        }
    }
    onTimeInputButtonClick() {
        if (!this.timePopupTemplateRef || this.readonly) {
            return;
        }
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: this.timePopupTemplateRef,
            width: this.popupAnchor.nativeElement.clientWidth,
            popupClass: "mona-time-picker-popup",
            hasBackdrop: false,
            closeOnOutsideClick: true
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.focusMonitor.focusVia(this.elementRef.nativeElement.querySelector("input"), "program");
        });
    }
    onTimeSelectorValueChange(date) {
        this.setCurrentDate(date);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimePickerComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.FocusMonitor }, { token: i2.PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: TimePickerComponent, selector: "mona-time-picker", inputs: { hourFormat: "hourFormat", showSeconds: "showSeconds" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TimePickerComponent),
                multi: true
            }
        ], viewQueries: [{ propertyName: "timePopupTemplateRef", first: true, predicate: ["timePopupTemplate"], descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div class=\"mona-time-picker\" #popupAnchor>\n    <mona-text-box [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"currentDateString\" (ngModelChange)=\"onDateStringEdit($event)\" (inputBlur)=\"onTimeInputBlur()\">\n        <ng-template monaTextBoxSuffixTemplate>\n            <button monaButton [flat]=\"true\" (click)=\"onTimeInputButtonClick()\" [disabled]=\"disabled\" [tabIndex]=\"-1\">\n                <fa-icon [icon]=\"timeIcon\"></fa-icon>\n            </button>\n        </ng-template>\n    </mona-text-box>\n</div>\n\n<ng-template #timePopupTemplate>\n    <mona-time-selector [value]=\"value\" (valueChange)=\"onTimeSelectorValueChange($event)\" [hourFormat]=\"hourFormat\" [showSeconds]=\"showSeconds\"></mona-time-selector>\n</ng-template>\n", styles: ["div.mona-time-picker{display:flex;position:relative}ol{list-style:none;margin:0;background-color:var(--mona-background-dark);height:150px;overflow-y:scroll;scrollbar-width:none;padding:75px 5px}ol::-webkit-scrollbar{display:none}ol li{display:flex;align-items:center;justify-content:center;padding:2px 8px;color:var(--mona-text)}span.mona-time-picker-highlight{display:block;position:absolute;height:var(--mona-input-height);background-color:var(--mona-background-light);border:1px solid var(--mona-border-color);top:calc(50% + 10px);width:100%}\n"], dependencies: [{ kind: "component", type: i3.TextBoxComponent, selector: "mona-text-box", inputs: ["disabled", "readonly"], outputs: ["inputBlur", "inputFocus"] }, { kind: "directive", type: i4.TextBoxSuffixTemplateDirective, selector: "ng-template[monaTextBoxSuffixTemplate]" }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: i6.ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "directive", type: i7.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i7.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i8.TimeSelectorComponent, selector: "mona-time-selector", inputs: ["format", "hourFormat", "showSeconds"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-time-picker", changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TimePickerComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-time-picker\" #popupAnchor>\n    <mona-text-box [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"currentDateString\" (ngModelChange)=\"onDateStringEdit($event)\" (inputBlur)=\"onTimeInputBlur()\">\n        <ng-template monaTextBoxSuffixTemplate>\n            <button monaButton [flat]=\"true\" (click)=\"onTimeInputButtonClick()\" [disabled]=\"disabled\" [tabIndex]=\"-1\">\n                <fa-icon [icon]=\"timeIcon\"></fa-icon>\n            </button>\n        </ng-template>\n    </mona-text-box>\n</div>\n\n<ng-template #timePopupTemplate>\n    <mona-time-selector [value]=\"value\" (valueChange)=\"onTimeSelectorValueChange($event)\" [hourFormat]=\"hourFormat\" [showSeconds]=\"showSeconds\"></mona-time-selector>\n</ng-template>\n", styles: ["div.mona-time-picker{display:flex;position:relative}ol{list-style:none;margin:0;background-color:var(--mona-background-dark);height:150px;overflow-y:scroll;scrollbar-width:none;padding:75px 5px}ol::-webkit-scrollbar{display:none}ol li{display:flex;align-items:center;justify-content:center;padding:2px 8px;color:var(--mona-text)}span.mona-time-picker-highlight{display:block;position:absolute;height:var(--mona-input-height);background-color:var(--mona-background-light);border:1px solid var(--mona-border-color);top:calc(50% + 10px);width:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.FocusMonitor }, { type: i2.PopupService }]; }, propDecorators: { hourFormat: [{
                type: Input
            }], showSeconds: [{
                type: Input
            }], timePopupTemplateRef: [{
                type: ViewChild,
                args: ["timePopupTemplate"]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2RhdGUtaW5wdXRzL21vZHVsZXMvdGltZS1waWNrZXIvY29tcG9uZW50cy90aW1lLXBpY2tlci90aW1lLXBpY2tlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZGF0ZS1pbnB1dHMvbW9kdWxlcy90aW1lLXBpY2tlci9jb21wb25lbnRzL3RpbWUtcGlja2VyL3RpbWUtcGlja2VyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCx1QkFBdUIsRUFFdkIsU0FBUyxFQUVULFVBQVUsRUFDVixLQUFLLEVBS0wsU0FBUyxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLDBFQUEwRSxDQUFDO0FBQ3RILE9BQU8sRUFBRSxPQUFPLEVBQWtCLE1BQU0sbUNBQW1DLENBQUM7QUFHNUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUNqQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7O0FBZW5ELE1BQU0sT0FBTyxtQkFBb0IsU0FBUSwwQkFBMEI7SUFZL0QsWUFDZ0MsR0FBc0IsRUFDbEMsVUFBbUMsRUFDbEMsWUFBMEIsRUFDMUIsWUFBMEI7UUFFM0MsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBTGlCLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBQ2xDLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBQ2xDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLGlCQUFZLEdBQVosWUFBWSxD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QyxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBFbGVtZW50UmVmLFxuICAgIGZvcndhcmRSZWYsXG4gICAgSW5wdXQsXG4gICAgT25DaGFuZ2VzLFxuICAgIE9uSW5pdCxcbiAgICBTaW1wbGVDaGFuZ2VzLFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFZpZXdDaGlsZFxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQWJzdHJhY3REYXRlSW5wdXRDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vY29tcG9uZW50cy9hYnN0cmFjdC1kYXRlLWlucHV0L2Fic3RyYWN0LWRhdGUtaW5wdXQuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBmYUNsb2NrLCBJY29uRGVmaW5pdGlvbiB9IGZyb20gXCJAZm9ydGF3ZXNvbWUvZnJlZS1zb2xpZC1zdmctaWNvbnNcIjtcbmltcG9ydCB7IEZvY3VzTW9uaXRvciB9IGZyb20gXCJAYW5ndWxhci9jZGsvYTExeVwiO1xuaW1wb3J0IHsgUG9wdXBTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3BvcHVwL3NlcnZpY2VzL3BvcHVwLnNlcnZpY2VcIjtcbmltcG9ydCB7IERhdGVUaW1lIH0gZnJvbSBcImx1eG9uXCI7XG5pbXBvcnQgeyB0YWtlIH0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSBcIkBhbmd1bGFyL2Zvcm1zXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm1vbmEtdGltZS1waWNrZXJcIixcbiAgICB0ZW1wbGF0ZVVybDogXCIuL3RpbWUtcGlja2VyLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL3RpbWUtcGlja2VyLmNvbXBvbmVudC5zY3NzXCJdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgICAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFRpbWVQaWNrZXJDb21wb25lbnQpLFxuICAgICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgVGltZVBpY2tlckNvbXBvbmVudCBleHRlbmRzIEFic3RyYWN0RGF0ZUlucHV0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICAgIHB1YmxpYyByZWFkb25seSB0aW1lSWNvbjogSWNvbkRlZmluaXRpb24gPSBmYUNsb2NrO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaG91ckZvcm1hdDogXCIxMlwiIHwgXCIyNFwiID0gXCIyNFwiO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2hvd1NlY29uZHM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBWaWV3Q2hpbGQoXCJ0aW1lUG9wdXBUZW1wbGF0ZVwiKVxuICAgIHB1YmxpYyB0aW1lUG9wdXBUZW1wbGF0ZVJlZj86IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBvdmVycmlkZSByZWFkb25seSBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcG9wdXBTZXJ2aWNlOiBQb3B1cFNlcnZpY2VcbiAgICApIHtcbiAgICAgICAgc3VwZXIoY2RyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb3ZlcnJpZGUgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBzdXBlci5uZ09uQ2hhbmdlcyhjaGFuZ2VzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb3ZlcnJpZGUgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm5nT25Jbml0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uRGF0ZVN0cmluZ0VkaXQoZGF0ZVN0cmluZzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3VycmVudERhdGVTdHJpbmcgPSBkYXRlU3RyaW5nO1xuICAgIH1cblxuICAgIHB1YmxpYyBvblRpbWVJbnB1dEJsdXIoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnBvcHVwUmVmKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0ZVRpbWUgPSBEYXRlVGltZS5mcm9tRm9ybWF0KHRoaXMuY3VycmVudERhdGVTdHJpbmcsIHRoaXMuZm9ybWF0KTtcbiAgICAgICAgaWYgKHRoaXMuZGF0ZVN0cmluZ0VxdWFscyhkYXRlVGltZS50b0pTRGF0ZSgpLCB0aGlzLnZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRlVGltZS5pc1ZhbGlkKSB7XG4gICAgICAgICAgICB0aGlzLnNldEN1cnJlbnREYXRlKGRhdGVUaW1lLnRvSlNEYXRlKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRDdXJyZW50RGF0ZShudWxsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvblRpbWVJbnB1dEJ1dHRvbkNsaWNrKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMudGltZVBvcHVwVGVtcGxhdGVSZWYgfHwgdGhpcy5yZWFkb25seSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9wdXBSZWYgPSB0aGlzLnBvcHVwU2VydmljZS5jcmVhdGUoe1xuICAgICAgICAgICAgYW5jaG9yOiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgIGNvbnRlbnQ6IHRoaXMudGltZVBvcHVwVGVtcGxhdGVSZWYsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5wb3B1cEFuY2hvci5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgcG9wdXBDbGFzczogXCJtb25hLXRpbWUtcGlja2VyLXBvcHVwXCIsXG4gICAgICAgICAgICBoYXNCYWNrZHJvcDogZmFsc2UsXG4gICAgICAgICAgICBjbG9zZU9uT3V0c2lkZUNsaWNrOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnBvcHVwUmVmLmNsb3NlZC5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVwUmVmID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKSBhcyBIVE1MRWxlbWVudCwgXCJwcm9ncmFtXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25UaW1lU2VsZWN0b3JWYWx1ZUNoYW5nZShkYXRlOiBEYXRlIHwgbnVsbCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNldEN1cnJlbnREYXRlKGRhdGUpO1xuICAgIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtb25hLXRpbWUtcGlja2VyXCIgI3BvcHVwQW5jaG9yPlxuICAgIDxtb25hLXRleHQtYm94IFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFtyZWFkb25seV09XCJyZWFkb25seVwiIFtuZ01vZGVsXT1cImN1cnJlbnREYXRlU3RyaW5nXCIgKG5nTW9kZWxDaGFuZ2UpPVwib25EYXRlU3RyaW5nRWRpdCgkZXZlbnQpXCIgKGlucHV0Qmx1cik9XCJvblRpbWVJbnB1dEJsdXIoKVwiPlxuICAgICAgICA8bmctdGVtcGxhdGUgbW9uYVRleHRCb3hTdWZmaXhUZW1wbGF0ZT5cbiAgICAgICAgICAgIDxidXR0b24gbW9uYUJ1dHRvbiBbZmxhdF09XCJ0cnVlXCIgKGNsaWNrKT1cIm9uVGltZUlucHV0QnV0dG9uQ2xpY2soKVwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFt0YWJJbmRleF09XCItMVwiPlxuICAgICAgICAgICAgICAgIDxmYS1pY29uIFtpY29uXT1cInRpbWVJY29uXCI+PC9mYS1pY29uPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9tb25hLXRleHQtYm94PlxuPC9kaXY+XG5cbjxuZy10ZW1wbGF0ZSAjdGltZVBvcHVwVGVtcGxhdGU+XG4gICAgPG1vbmEtdGltZS1zZWxlY3RvciBbdmFsdWVdPVwidmFsdWVcIiAodmFsdWVDaGFuZ2UpPVwib25UaW1lU2VsZWN0b3JWYWx1ZUNoYW5nZSgkZXZlbnQpXCIgW2hvdXJGb3JtYXRdPVwiaG91ckZvcm1hdFwiIFtzaG93U2Vjb25kc109XCJzaG93U2Vjb25kc1wiPjwvbW9uYS10aW1lLXNlbGVjdG9yPlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==