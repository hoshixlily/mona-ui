import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, forwardRef, Input, Output, QueryList, TemplateRef } from "@angular/core";
import { TextBoxPrefixTemplateDirective } from "../../directives/text-box-prefix-template.directive";
import { TextBoxSuffixTemplateDirective } from "../../directives/text-box-suffix-template.directive";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "../../directives/text-box.directive";
export class TextBoxComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.propagateChange = null;
        this.value = "";
        this.disabled = false;
        this.inputBlur = new EventEmitter();
        this.inputFocus = new EventEmitter();
        this.prefixTemplateList = new QueryList();
        this.readonly = false;
        this.suffixTemplateList = new QueryList();
    }
    ngOnInit() { }
    onValueChange(value) {
        this.value = value;
        this.propagateChange?.(value);
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        void 0;
    }
    writeValue(obj) {
        if (obj != null) {
            this.value = obj;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextBoxComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: TextBoxComponent, selector: "mona-text-box", inputs: { disabled: "disabled", readonly: "readonly" }, outputs: { inputBlur: "inputBlur", inputFocus: "inputFocus" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TextBoxComponent),
                multi: true
            }
        ], queries: [{ propertyName: "prefixTemplateList", predicate: TextBoxPrefixTemplateDirective, read: TemplateRef }, { propertyName: "suffixTemplateList", predicate: TextBoxSuffixTemplateDirective, read: TemplateRef }], ngImport: i0, template: "<div class=\"mona-text-box\">\n    <ng-container *ngFor=\"let prefixTemplate of prefixTemplateList\">\n        <span class=\"mona-text-box-prefix\">\n            <ng-container *ngTemplateOutlet=\"prefixTemplate\"></ng-container>\n        </span>\n    </ng-container>\n    <input [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"value\" (ngModelChange)=\"onValueChange($event)\" (blur)=\"inputBlur.emit($event)\" (focus)=\"inputFocus.emit($event)\" monaTextBox />\n    <ng-container *ngFor=\"let suffixTemplate of suffixTemplateList\">\n        <span class=\"mona-text-box-suffix\">\n            <ng-container *ngTemplateOutlet=\"suffixTemplate\"></ng-container>\n        </span>\n    </ng-container>\n</div>\n", styles: ["div.mona-text-box{height:var(--mona-input-height);display:flex}div.mona-text-box>[monaTextBox]{border:none;height:100%;width:100%}div.mona-text-box>[monaTextBox]:active,div.mona-text-box>[monaTextBox]:focus,div.mona-text-box>[monaTextBox]:focus-within{box-shadow:none}span.mona-text-box-prefix,span.mona-text-box-suffix{min-width:var(--mona-input-height);max-width:var(--mona-input-height);height:100%;display:inline-flex;align-items:center;justify-content:center}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i3.TextBoxDirective, selector: "input[monaTextBox]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextBoxComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-text-box", changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TextBoxComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-text-box\">\n    <ng-container *ngFor=\"let prefixTemplate of prefixTemplateList\">\n        <span class=\"mona-text-box-prefix\">\n            <ng-container *ngTemplateOutlet=\"prefixTemplate\"></ng-container>\n        </span>\n    </ng-container>\n    <input [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"value\" (ngModelChange)=\"onValueChange($event)\" (blur)=\"inputBlur.emit($event)\" (focus)=\"inputFocus.emit($event)\" monaTextBox />\n    <ng-container *ngFor=\"let suffixTemplate of suffixTemplateList\">\n        <span class=\"mona-text-box-suffix\">\n            <ng-container *ngTemplateOutlet=\"suffixTemplate\"></ng-container>\n        </span>\n    </ng-container>\n</div>\n", styles: ["div.mona-text-box{height:var(--mona-input-height);display:flex}div.mona-text-box>[monaTextBox]{border:none;height:100%;width:100%}div.mona-text-box>[monaTextBox]:active,div.mona-text-box>[monaTextBox]:focus,div.mona-text-box>[monaTextBox]:focus-within{box-shadow:none}span.mona-text-box-prefix,span.mona-text-box-suffix{min-width:var(--mona-input-height);max-width:var(--mona-input-height);height:100%;display:inline-flex;align-items:center;justify-content:center}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { disabled: [{
                type: Input
            }], inputBlur: [{
                type: Output
            }], inputFocus: [{
                type: Output
            }], prefixTemplateList: [{
                type: ContentChildren,
                args: [TextBoxPrefixTemplateDirective, { read: TemplateRef }]
            }], readonly: [{
                type: Input
            }], suffixTemplateList: [{
                type: ContentChildren,
                args: [TextBoxSuffixTemplateDirective, { read: TemplateRef }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1ib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2lucHV0cy9tb2R1bGVzL3RleHQtYm94L2NvbXBvbmVudHMvdGV4dC1ib3gvdGV4dC1ib3guY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2lucHV0cy9tb2R1bGVzL3RleHQtYm94L2NvbXBvbmVudHMvdGV4dC1ib3gvdGV4dC1ib3guY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUVmLFlBQVksRUFDWixVQUFVLEVBQ1YsS0FBSyxFQUVMLE1BQU0sRUFDTixTQUFTLEVBQ1QsV0FBVyxFQUNkLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ3JHLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ3JHLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFnQnpFLE1BQU0sT0FBTyxnQkFBZ0I7SUFzQnpCLFlBQW1DLFVBQXNDO1FBQXRDLGVBQVUsR0FBVixVQUFVLENBQTRCO1FBckJqRSxvQkFBZSxHQUErQixJQUFJLENBQUM7UUFDcEQsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUduQixhQUFRLEdBQVksS0FBSyxDQUFDO1FBRzFCLGNBQVMsR0FBd0IsSUFBSSxZQUFZLEVBQVMsQ0FBQztRQUczRCxlQUFVLEdBQXdCLElBQUksWUFBWSxFQUFTLENBQUM7UUFHNUQsdUJBQWtCLEdBQWdDLElBQUksU0FBUyxFQUFvQixDQUFDO1FBR3BGLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFHMUIsdUJBQWtCLEdBQWdDLElBQUksU0FBUyxFQUFvQixDQUFDO0lBRWYsQ0FBQztJQUV0RSxRQUFRLEtBQVUsQ0FBQztJQUVuQixhQUFhLENBQUMsS0FBYTtRQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVNLGdCQUFnQixDQUFDLEVBQU87UUFDM0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVNLGlCQUFpQixDQUFDLEVBQU87UUFDNUIsS0FBSyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRU0sVUFBVSxDQUFDLEdBQVc7UUFDekIsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ2IsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7U0FDcEI7SUFDTCxDQUFDOzhHQTNDUSxnQkFBZ0I7a0dBQWhCLGdCQUFnQiwrSkFSZDtZQUNQO2dCQUNJLE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7Z0JBQy9DLEtBQUssRUFBRSxJQUFJO2FBQ2Q7U0FDSiw2REFlZ0IsOEJBQThCLFFBQVUsV0FBVyxxREFNbkQsOEJBQThCLFFBQVUsV0FBVyw2QkNsRHhFLGt0QkFhQTs7MkZEa0JhLGdCQUFnQjtrQkFiNUIsU0FBUzsrQkFDSSxlQUFlLG1CQUdSLHVCQUF1QixDQUFDLE1BQU0sYUFDcEM7d0JBQ1A7NEJBQ0ksT0FBTyxFQUFFLGlCQUFpQjs0QkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLENBQUM7NEJBQy9DLEtBQUssRUFBRSxJQUFJO3lCQUNkO3FCQUNKO2lHQU9NLFFBQVE7c0JBRGQsS0FBSztnQkFJQyxTQUFTO3NCQURmLE1BQU07Z0JBSUEsVUFBVTtzQkFEaEIsTUFBTTtnQkFJQSxrQkFBa0I7c0JBRHhCLGVBQWU7dUJBQUMsOEJBQThCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO2dCQUkvRCxRQUFRO3NCQURkLEtBQUs7Z0JBSUMsa0JBQWtCO3NCQUR4QixlQUFlO3VCQUFDLDhCQUE4QixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgQ29tcG9uZW50LFxuICAgIENvbnRlbnRDaGlsZHJlbixcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBmb3J3YXJkUmVmLFxuICAgIElucHV0LFxuICAgIE9uSW5pdCxcbiAgICBPdXRwdXQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFRlbXBsYXRlUmVmXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBUZXh0Qm94UHJlZml4VGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi4vLi4vZGlyZWN0aXZlcy90ZXh0LWJveC1wcmVmaXgtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBUZXh0Qm94U3VmZml4VGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi4vLi4vZGlyZWN0aXZlcy90ZXh0LWJveC1zdWZmaXgtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9BY3Rpb25cIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibW9uYS10ZXh0LWJveFwiLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vdGV4dC1ib3guY29tcG9uZW50Lmh0bWxcIixcbiAgICBzdHlsZVVybHM6IFtcIi4vdGV4dC1ib3guY29tcG9uZW50LnNjc3NcIl0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gVGV4dEJveENvbXBvbmVudCksXG4gICAgICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgICB9XG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBUZXh0Qm94Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgcHJpdmF0ZSBwcm9wYWdhdGVDaGFuZ2U6IEFjdGlvbjxzdHJpbmcsIGFueT4gfCBudWxsID0gbnVsbDtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIGlucHV0Qmx1cjogRXZlbnRFbWl0dGVyPEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8RXZlbnQ+KCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgaW5wdXRGb2N1czogRXZlbnRFbWl0dGVyPEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8RXZlbnQ+KCk7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFRleHRCb3hQcmVmaXhUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyBwcmVmaXhUZW1wbGF0ZUxpc3Q6IFF1ZXJ5TGlzdDxUZW1wbGF0ZVJlZjxhbnk+PiA9IG5ldyBRdWVyeUxpc3Q8VGVtcGxhdGVSZWY8YW55Pj4oKTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHJlYWRvbmx5OiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFRleHRCb3hTdWZmaXhUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyBzdWZmaXhUZW1wbGF0ZUxpc3Q6IFF1ZXJ5TGlzdDxUZW1wbGF0ZVJlZjxhbnk+PiA9IG5ldyBRdWVyeUxpc3Q8VGVtcGxhdGVSZWY8YW55Pj4oKTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD4pIHt9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7fVxuXG4gICAgcHVibGljIG9uVmFsdWVDaGFuZ2UodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlPy4odmFsdWUpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgICAgICB2b2lkIDA7XG4gICAgfVxuXG4gICAgcHVibGljIHdyaXRlVmFsdWUob2JqOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKG9iaiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gb2JqO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm1vbmEtdGV4dC1ib3hcIj5cbiAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBwcmVmaXhUZW1wbGF0ZSBvZiBwcmVmaXhUZW1wbGF0ZUxpc3RcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJtb25hLXRleHQtYm94LXByZWZpeFwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInByZWZpeFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvc3Bhbj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8aW5wdXQgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgW3JlYWRvbmx5XT1cInJlYWRvbmx5XCIgW25nTW9kZWxdPVwidmFsdWVcIiAobmdNb2RlbENoYW5nZSk9XCJvblZhbHVlQ2hhbmdlKCRldmVudClcIiAoYmx1cik9XCJpbnB1dEJsdXIuZW1pdCgkZXZlbnQpXCIgKGZvY3VzKT1cImlucHV0Rm9jdXMuZW1pdCgkZXZlbnQpXCIgbW9uYVRleHRCb3ggLz5cbiAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBzdWZmaXhUZW1wbGF0ZSBvZiBzdWZmaXhUZW1wbGF0ZUxpc3RcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJtb25hLXRleHQtYm94LXN1ZmZpeFwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInN1ZmZpeFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvc3Bhbj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbjwvZGl2PlxuIl19