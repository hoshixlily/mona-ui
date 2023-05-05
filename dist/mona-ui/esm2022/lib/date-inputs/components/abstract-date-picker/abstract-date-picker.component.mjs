import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AbstractDateInputComponent } from "../abstract-date-input/abstract-date-input.component";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { take } from "rxjs";
import { DateTime } from "luxon";
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "../../../popup/services/popup.service";
export class AbstractDatePickerComponent extends AbstractDateInputComponent {
    constructor(cdr, elementRef, focusMonitor, popupService) {
        super(cdr);
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.focusMonitor = focusMonitor;
        this.popupService = popupService;
        this.dateIcon = faCalendar;
    }
    onCalendarValueChange(date) {
        this.setCurrentDate(date);
        this.popupRef?.close();
    }
    onDateInputBlur() {
        if (this.popupRef) {
            return;
        }
        if (!this.currentDateString && this.value) {
            this.setCurrentDate(null);
            return;
        }
        const dateTime = DateTime.fromFormat(this.currentDateString, this.format);
        if (this.dateStringEquals(this.value, dateTime.toJSDate())) {
            return;
        }
        if (dateTime.isValid) {
            if (this.value && DateTime.fromJSDate(this.value).equals(dateTime)) {
                return;
            }
            if (this.min && dateTime.startOf("day") < DateTime.fromJSDate(this.min).startOf("day")) {
                this.setCurrentDate(this.min);
                return;
            }
            if (this.max && dateTime.startOf("day") > DateTime.fromJSDate(this.max).startOf("day")) {
                this.setCurrentDate(this.max);
                return;
            }
            this.setCurrentDate(dateTime.toJSDate());
        }
        else {
            if (this.value) {
                this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
            }
            else {
                this.currentDateString = "";
            }
        }
        this.cdr.detectChanges();
    }
    onDateInputButtonClick() {
        if (!this.datePopupTemplateRef || this.readonly) {
            return;
        }
        const input = this.elementRef.nativeElement.querySelector("input");
        this.popupRef = this.popupService.create({
            anchor: this.popupAnchor,
            content: this.datePopupTemplateRef,
            width: this.elementRef.nativeElement.offsetWidth,
            minWidth: 200,
            popupClass: "mona-date-input-popup",
            hasBackdrop: false,
            withPush: false,
            closeOnOutsideClick: true
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.focusMonitor.focusVia(input, "program");
        });
    }
    onDateStringEdit(dateString) {
        this.currentDateString = dateString;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractDatePickerComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.FocusMonitor }, { token: i2.PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: AbstractDatePickerComponent, isStandalone: true, selector: "mona-abstract-date-picker", viewQueries: [{ propertyName: "datePopupTemplateRef", first: true, predicate: ["datePopupTemplate"], descendants: true }], usesInheritance: true, ngImport: i0, template: "", isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractDatePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-abstract-date-picker", standalone: true, imports: [CommonModule], template: "", changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.FocusMonitor }, { type: i2.PopupService }]; }, propDecorators: { datePopupTemplateRef: [{
                type: ViewChild,
                args: ["datePopupTemplate"]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QtZGF0ZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2RhdGUtaW5wdXRzL2NvbXBvbmVudHMvYWJzdHJhY3QtZGF0ZS1waWNrZXIvYWJzdHJhY3QtZGF0ZS1waWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCx1QkFBdUIsRUFFdkIsU0FBUyxFQUlULFNBQVMsRUFDWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDbEcsT0FBTyxFQUFFLFVBQVUsRUFBa0IsTUFBTSxtQ0FBbUMsQ0FBQztBQUMvRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRzVCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxPQUFPLENBQUM7Ozs7QUFVakMsTUFBTSxPQUFnQiwyQkFBNEIsU0FBUSwwQkFBMEI7SUFNaEYsWUFDZ0MsR0FBc0IsRUFDL0IsVUFBc0IsRUFDdEIsWUFBMEIsRUFDMUIsWUFBMEI7UUFFN0MsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBTGlCLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBQy9CLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFUakMsYUFBUSxHQUFtQixVQUFVLENBQUM7SUFZdEQsQ0FBQztJQUVNLHFCQUFxQixDQUFDLElBQWlCO1FBQzFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRU0s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SUFBSSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxVQUFrQjtRQUN0QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxDQUFDO0lBQ3hDLENBQUM7OEdBaEZpQiwyQkFBMkI7a0dBQTNCLDJCQUEyQix1T0FKbkMsRUFBRSwyREFERixZQUFZOzsyRkFLSiwyQkFBMkI7a0JBUmhELFNBQVM7K0JBQ0ksMkJBQTJCLGNBQ3pCLElBQUksV0FDUCxDQUFDLFlBQVksQ0FBQyxZQUNiLEVBQUUsbUJBRUssdUJBQXVCLENBQUMsTUFBTTt1TEFNeEMsb0JBQW9CO3NCQUQxQixTQUFTO3VCQUFDLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29tcG9uZW50LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgT25Jbml0LFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFZpZXdDaGlsZFxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuaW1wb3J0IHsgQWJzdHJhY3REYXRlSW5wdXRDb21wb25lbnQgfSBmcm9tIFwiLi4vYWJzdHJhY3QtZGF0ZS1pbnB1dC9hYnN0cmFjdC1kYXRlLWlucHV0LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgZmFDYWxlbmRhciwgSWNvbkRlZmluaXRpb24gfSBmcm9tIFwiQGZvcnRhd2Vzb21lL2ZyZWUtc29saWQtc3ZnLWljb25zXCI7XG5pbXBvcnQgeyB0YWtlIH0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7IEZvY3VzTW9uaXRvciB9IGZyb20gXCJAYW5ndWxhci9jZGsvYTExeVwiO1xuaW1wb3J0IHsgUG9wdXBTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uLy4uL3BvcHVwL3NlcnZpY2VzL3BvcHVwLnNlcnZpY2VcIjtcbmltcG9ydCB7IERhdGVUaW1lIH0gZnJvbSBcImx1eG9uXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm1vbmEtYWJzdHJhY3QtZGF0ZS1waWNrZXJcIixcbiAgICBzdGFuZGFsb25lOiB0cnVlLFxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIHRlbXBsYXRlOiBcIlwiLFxuICAgIHN0eWxlVXJsczogW10sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3REYXRlUGlja2VyQ29tcG9uZW50IGV4dGVuZHMgQWJzdHJhY3REYXRlSW5wdXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHB1YmxpYyByZWFkb25seSBkYXRlSWNvbjogSWNvbkRlZmluaXRpb24gPSBmYUNhbGVuZGFyO1xuXG4gICAgQFZpZXdDaGlsZChcImRhdGVQb3B1cFRlbXBsYXRlXCIpXG4gICAgcHVibGljIGRhdGVQb3B1cFRlbXBsYXRlUmVmPzogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIG92ZXJyaWRlIHJlYWRvbmx5IGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBwb3B1cFNlcnZpY2U6IFBvcHVwU2VydmljZVxuICAgICkge1xuICAgICAgICBzdXBlcihjZHIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkNhbGVuZGFyVmFsdWVDaGFuZ2UoZGF0ZTogRGF0ZSB8IG51bGwpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50RGF0ZShkYXRlKTtcbiAgICAgICAgdGhpcy5wb3B1cFJlZj8uY2xvc2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25EYXRlSW5wdXRCbHVyKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5wb3B1cFJlZikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5jdXJyZW50RGF0ZVN0cmluZyAmJiB0aGlzLnZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnNldEN1cnJlbnREYXRlKG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0ZVRpbWUgPSBEYXRlVGltZS5mcm9tRm9ybWF0KHRoaXMuY3VycmVudERhdGVTdHJpbmcsIHRoaXMuZm9ybWF0KTtcbiAgICAgICAgaWYgKHRoaXMuZGF0ZVN0cmluZ0VxdWFscyh0aGlzLnZhbHVlLCBkYXRlVGltZS50b0pTRGF0ZSgpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRlVGltZS5pc1ZhbGlkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSAmJiBEYXRlVGltZS5mcm9tSlNEYXRlKHRoaXMudmFsdWUpLmVxdWFscyhkYXRlVGltZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5taW4gJiYgZGF0ZVRpbWUuc3RhcnRPZihcImRheVwiKSA8IERhdGVUaW1lLmZyb21KU0RhdGUodGhpcy5taW4pLnN0YXJ0T2YoXCJkYXlcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEN1cnJlbnREYXRlKHRoaXMubWluKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5tYXggJiYgZGF0ZVRpbWUuc3RhcnRPZihcImRheVwiKSA+IERhdGVUaW1lLmZyb21KU0RhdGUodGhpcy5tYXgpLnN0YXJ0T2YoXCJkYXlcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEN1cnJlbnREYXRlKHRoaXMubWF4KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldEN1cnJlbnREYXRlKGRhdGVUaW1lLnRvSlNEYXRlKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREYXRlU3RyaW5nID0gRGF0ZVRpbWUuZnJvbUpTRGF0ZSh0aGlzLnZhbHVlKS50b0Zvcm1hdCh0aGlzLmZvcm1hdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERhdGVTdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25EYXRlSW5wdXRCdXR0b25DbGljaygpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmRhdGVQb3B1cFRlbXBsYXRlUmVmIHx8IHRoaXMucmVhZG9ubHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICB0aGlzLnBvcHVwUmVmID0gdGhpcy5wb3B1cFNlcnZpY2UuY3JlYXRlKHtcbiAgICAgICAgICAgIGFuY2hvcjogdGhpcy5wb3B1cEFuY2hvcixcbiAgICAgICAgICAgIGNvbnRlbnQ6IHRoaXMuZGF0ZVBvcHVwVGVtcGxhdGVSZWYsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGgsXG4gICAgICAgICAgICBtaW5XaWR0aDogMjAwLFxuICAgICAgICAgICAgcG9wdXBDbGFzczogXCJtb25hLWRhdGUtaW5wdXQtcG9wdXBcIixcbiAgICAgICAgICAgIGhhc0JhY2tkcm9wOiBmYWxzZSxcbiAgICAgICAgICAgIHdpdGhQdXNoOiBmYWxzZSxcbiAgICAgICAgICAgIGNsb3NlT25PdXRzaWRlQ2xpY2s6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucG9wdXBSZWYuY2xvc2VkLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9wdXBSZWYgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5mb2N1c01vbml0b3IuZm9jdXNWaWEoaW5wdXQsIFwicHJvZ3JhbVwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uRGF0ZVN0cmluZ0VkaXQoZGF0ZVN0cmluZzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3VycmVudERhdGVTdHJpbmcgPSBkYXRlU3RyaW5nO1xuICAgIH1cbn1cbiJdfQ==