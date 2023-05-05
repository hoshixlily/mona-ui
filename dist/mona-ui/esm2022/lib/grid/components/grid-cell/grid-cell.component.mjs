import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { asyncScheduler, filter, fromEvent, Subject, take, takeUntil, tap, timer } from "rxjs";
import { CellEditEvent } from "../../models/CellEditEvent";
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "../../services/grid.service";
import * as i3 from "@angular/common";
import * as i4 from "../../../inputs/modules/text-box/components/text-box/text-box.component";
import * as i5 from "@angular/forms";
import * as i6 from "../../../inputs/modules/numeric-text-box/components/numeric-text-box/numeric-text-box.component";
import * as i7 from "../../../date-inputs/modules/date-picker/components/date-picker/date-picker.component";
import * as i8 from "../../../inputs/modules/check-box/directives/check-box.directive";
export class GridCellComponent {
    #destroy;
    constructor(cdr, elementRef, focusMonitor, gridService) {
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.focusMonitor = focusMonitor;
        this.gridService = gridService;
        this.#destroy = new Subject();
        this.focused = false;
        this.editing = false;
    }
    ngOnDestroy() {
        this.#destroy.next();
        this.#destroy.complete();
    }
    ngOnInit() {
        this.initializeForm();
        this.setSubscriptions();
    }
    initializeForm() {
        const form = this.row.getEditForm(this.column.field);
        if (form) {
            this.editForm = form;
        }
        else {
            this.editForm = new FormGroup({});
            this.editForm.addControl(this.column.field, new FormControl(this.row.data[this.column.field]));
            this.row.setEditForm(this.column.field, this.editForm);
        }
    }
    onDateChange(date) {
        this.editing = false;
        this.gridService.isInEditMode = false;
    }
    onFocusChange(origin) {
        if (!origin) {
            const duration = this.column.filterType === "date" ? 50 : 25;
            timer(duration)
                .pipe(take(1))
                .subscribe(() => {
                if (!this.gridEditable) {
                    return;
                }
                if (this.column.filterType !== "date") {
                    if (this.editing) {
                        this.editing = false;
                        this.updateCellValue();
                    }
                }
                else {
                    const datePopup = document.querySelector(".mona-date-input-popup");
                    if (!datePopup) {
                        this.editing = false;
                    }
                    if (this.editing) {
                        this.updateCellValue();
                    }
                }
                this.cdr.markForCheck();
            });
            this.focused = false;
        }
        else {
            this.focused = true;
            if (this.gridService.isInEditMode) {
                if (origin !== "mouse") {
                    this.editing = true;
                    asyncScheduler.schedule(() => {
                        this.focusCellInput();
                    });
                }
            }
        }
    }
    notifyCellEdit() {
        const event = new CellEditEvent({
            field: this.column.field,
            oldValue: this.row.data[this.column.field],
            newValue: this.editForm.value[this.column.field],
            rowData: this.row.data,
            setNewValue: (value) => {
                this.editForm.get(this.column.field)?.setValue(value);
                this.row.data[this.column.field] = value;
            }
        });
        if (event.oldValue !== event.newValue) {
            this.gridService.cellEdit$.next(event);
        }
        return event;
    }
    focus() {
        this.focusMonitor.focusVia(this.elementRef.nativeElement.firstElementChild, "program");
    }
    focusCellInput() {
        if (this.column.filterType === "string" || this.column.filterType === "number") {
            this.elementRef.nativeElement.querySelector("input")?.focus();
        }
        else if (this.column.filterType === "date") {
            this.elementRef.nativeElement.querySelector("input")?.focus();
        }
        else if (this.column.filterType === "boolean") {
            this.elementRef.nativeElement.querySelector("input")?.focus();
        }
    }
    setSubscriptions() {
        fromEvent(this.elementRef.nativeElement, "dblclick")
            .pipe(takeUntil(this.#destroy), tap(event => event.stopPropagation()))
            .subscribe(() => {
            if (!this.gridEditable) {
                return;
            }
            this.editing = true;
            this.gridService.isInEditMode = true;
            this.cdr.markForCheck();
            asyncScheduler.schedule(() => {
                this.focusCellInput();
            });
        });
        fromEvent(this.elementRef.nativeElement, "click")
            .pipe(takeUntil(this.#destroy), tap(event => event.stopPropagation()))
            .subscribe(() => {
            if (!this.editing && this.gridService.isInEditMode) {
                this.gridService.isInEditMode = false;
            }
        });
        fromEvent(this.elementRef.nativeElement, "keydown")
            .pipe(takeUntil(this.#destroy), tap(event => event.stopPropagation()), filter(event => event.key === "Enter" ||
            event.key === "Escape" ||
            event.key === "ArrowUp" ||
            event.key === "ArrowDown" ||
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight" ||
            event.key === "F2"))
            .subscribe(event => {
            if (event.key === "Enter") {
                if (this.editing) {
                    this.updateCellValue();
                }
                this.gridService.isInEditMode = false;
                this.editing = false;
                this.focus();
            }
            else if (event.key === "Escape") {
                this.editing = false;
                this.gridService.isInEditMode = false;
                this.focus();
            }
            else if (event.key === "ArrowUp") {
                if (!this.editing) {
                    const previousRowElement = document.querySelector(`tr[data-ruid='${this.row.uid}']`)?.previousElementSibling;
                    if (previousRowElement) {
                        const cell = previousRowElement.querySelector(`td .mona-grid-cell[data-field='${this.column.field}']`);
                        if (cell) {
                            cell.focus();
                        }
                    }
                }
            }
            else if (event.key === "ArrowDown") {
                if (!this.editing) {
                    const nextRowElement = document.querySelector(`tr[data-ruid='${this.row.uid}']`)?.nextElementSibling;
                    if (nextRowElement) {
                        const cell = nextRowElement.querySelector(`td .mona-grid-cell[data-field='${this.column.field}']`);
                        if (cell) {
                            cell.focus();
                        }
                    }
                }
            }
            else if (event.key === "ArrowLeft") {
                if (!this.editing) {
                    const row = document.querySelector(`tr[data-ruid='${this.row.uid}']`);
                    if (!row) {
                        return;
                    }
                    if (this.column.index > 0) {
                        const cell = row.querySelector(`td .mona-grid-cell[data-col-index='${this.column.index - 1}']`);
                        if (cell) {
                            cell.focus();
                        }
                    }
                    else {
                        const previousRowElement = row.previousElementSibling;
                        if (previousRowElement) {
                            const cell = previousRowElement.querySelector("td:last-child .mona-grid-cell");
                            if (cell) {
                                cell.focus();
                            }
                        }
                    }
                }
            }
            else if (event.key === "ArrowRight") {
                if (!this.editing) {
                    const row = document.querySelector(`tr[data-ruid='${this.row.uid}']`);
                    if (!row) {
                        return;
                    }
                    if (this.column.index < this.gridService.columns.length - 1) {
                        const cell = row.querySelector(`td .mona-grid-cell[data-col-index='${this.column.index + 1}']`);
                        if (cell) {
                            cell.focus();
                        }
                    }
                    else {
                        const nextRowElement = row.nextElementSibling;
                        if (nextRowElement) {
                            const cell = nextRowElement.querySelector("td:first-child .mona-grid-cell");
                            if (cell) {
                                cell.focus();
                            }
                        }
                    }
                }
            }
            else if (event.key === "F2") {
                if (!this.gridEditable) {
                    return;
                }
                if (this.focused) {
                    this.editing = true;
                    this.gridService.isInEditMode = true;
                    asyncScheduler.schedule(() => {
                        this.focusCellInput();
                    });
                }
            }
            this.cdr.markForCheck();
        });
    }
    updateCellValue() {
        const event = this.notifyCellEdit();
        if (!event.isDefaultPrevented()) {
            this.row.data[this.column.field] = this.editForm.value[this.column.field];
            return;
        }
        this.editForm.patchValue({
            [this.column.field]: this.row.data[this.column.field]
        });
    }
    get gridEditable() {
        return !!this.gridService.editableOptions && !!this.gridService.editableOptions.enabled;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridCellComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.FocusMonitor }, { token: i2.GridService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: GridCellComponent, selector: "mona-grid-cell", inputs: { column: "column", row: "row" }, ngImport: i0, template: "<div class=\"mona-grid-cell\" [attr.tabindex]=\"editing ? -1 : 0\" cdkMonitorSubtreeFocus (cdkFocusChange)=\"onFocusChange($event)\"\n     [ngClass]=\"{'mona-grid-cell-editing': editing}\" [attr.data-ruid]=\"row.uid\" [attr.data-field]=\"column.field\" [attr.data-col-index]=\"column.index\">\n    <ng-container *ngIf=\"!editing\">\n        <ng-container *ngIf=\"!column.cellTemplate\">\n            <span class=\"mona-grid-cell-text\">{{row.data[column.field]}}</span>\n        </ng-container>\n        <ng-container [ngTemplateOutlet]=\"column.cellTemplate.templateRef ?? null\"\n                      *ngIf=\"column.cellTemplate\" [ngTemplateOutletContext]=\"{$implicit: row, column}\"></ng-container>\n    </ng-container>\n    <ng-container [ngTemplateOutlet]=\"cellEditTemplate\" *ngIf=\"editing\"></ng-container>\n</div>\n\n<ng-template #cellEditTemplate>\n    <form [formGroup]=\"editForm\">\n        <ng-container *ngIf=\"column.filterType==='string'\">\n            <mona-text-box [formControlName]=\"column.field\"></mona-text-box>\n        </ng-container>\n        <ng-container *ngIf=\"column.filterType==='number'\">\n            <mona-numeric-text-box [formControlName]=\"column.field\" [decimals]=\"3\"></mona-numeric-text-box>\n        </ng-container>\n        <ng-container *ngIf=\"column.filterType==='date'\">\n            <mona-date-picker [formControlName]=\"column.field\" (valueChange)=\"onDateChange($event)\"></mona-date-picker>\n        </ng-container>\n        <ng-container *ngIf=\"column.filterType==='boolean'\">\n            <input type=\"checkbox\" [formControlName]=\"column.field\" monaCheckBox />\n        </ng-container>\n    </form>\n</ng-template>\n", styles: [":host{display:block;height:100%}div.mona-grid-cell{padding:9px 10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;outline:none;height:100%}div.mona-grid-cell-editing{padding:1px}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i4.TextBoxComponent, selector: "mona-text-box", inputs: ["disabled", "readonly"], outputs: ["inputBlur", "inputFocus"] }, { kind: "directive", type: i5.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i5.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i5.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i5.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i5.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i6.NumericTextBoxComponent, selector: "mona-numeric-text-box", inputs: ["decimals", "disabled", "formatter", "max", "min", "readonly", "spinners", "step", "value"], outputs: ["inputBlur", "inputFocus", "valueChange"] }, { kind: "directive", type: i1.CdkMonitorFocus, selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]", outputs: ["cdkFocusChange"], exportAs: ["cdkMonitorFocus"] }, { kind: "component", type: i7.DatePickerComponent, selector: "mona-date-picker", inputs: ["format"] }, { kind: "directive", type: i8.CheckBoxDirective, selector: "input[type='checkbox'][monaCheckBox]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridCellComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-grid-cell", changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mona-grid-cell\" [attr.tabindex]=\"editing ? -1 : 0\" cdkMonitorSubtreeFocus (cdkFocusChange)=\"onFocusChange($event)\"\n     [ngClass]=\"{'mona-grid-cell-editing': editing}\" [attr.data-ruid]=\"row.uid\" [attr.data-field]=\"column.field\" [attr.data-col-index]=\"column.index\">\n    <ng-container *ngIf=\"!editing\">\n        <ng-container *ngIf=\"!column.cellTemplate\">\n            <span class=\"mona-grid-cell-text\">{{row.data[column.field]}}</span>\n        </ng-container>\n        <ng-container [ngTemplateOutlet]=\"column.cellTemplate.templateRef ?? null\"\n                      *ngIf=\"column.cellTemplate\" [ngTemplateOutletContext]=\"{$implicit: row, column}\"></ng-container>\n    </ng-container>\n    <ng-container [ngTemplateOutlet]=\"cellEditTemplate\" *ngIf=\"editing\"></ng-container>\n</div>\n\n<ng-template #cellEditTemplate>\n    <form [formGroup]=\"editForm\">\n        <ng-container *ngIf=\"column.filterType==='string'\">\n            <mona-text-box [formControlName]=\"column.field\"></mona-text-box>\n        </ng-container>\n        <ng-container *ngIf=\"column.filterType==='number'\">\n            <mona-numeric-text-box [formControlName]=\"column.field\" [decimals]=\"3\"></mona-numeric-text-box>\n        </ng-container>\n        <ng-container *ngIf=\"column.filterType==='date'\">\n            <mona-date-picker [formControlName]=\"column.field\" (valueChange)=\"onDateChange($event)\"></mona-date-picker>\n        </ng-container>\n        <ng-container *ngIf=\"column.filterType==='boolean'\">\n            <input type=\"checkbox\" [formControlName]=\"column.field\" monaCheckBox />\n        </ng-container>\n    </form>\n</ng-template>\n", styles: [":host{display:block;height:100%}div.mona-grid-cell{padding:9px 10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;outline:none;height:100%}div.mona-grid-cell-editing{padding:1px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.FocusMonitor }, { type: i2.GridService }]; }, propDecorators: { column: [{
                type: Input
            }], row: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1jZWxsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9ncmlkL2NvbXBvbmVudHMvZ3JpZC1jZWxsL2dyaWQtY2VsbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZ3JpZC9jb21wb25lbnRzL2dyaWQtY2VsbC9ncmlkLWNlbGwuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILHVCQUF1QixFQUV2QixTQUFTLEVBRVQsS0FBSyxFQUdSLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHeEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0YsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDOzs7Ozs7Ozs7O0FBUTNELE1BQU0sT0FBTyxpQkFBaUI7SUFDakIsUUFBUSxDQUFzQztJQVd2RCxZQUNxQixHQUFzQixFQUN0QixVQUFtQyxFQUNuQyxZQUEwQixFQUMxQixXQUF3QjtRQUh4QixRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUN0QixlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUNuQyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQWZwQyxhQUFRLEdBQWtCLElBQUksT0FBTyxFQUFRLENBQUM7UUFDL0MsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUUxQixZQUFPLEdBQVksS0FBSyxDQUFDO0lBYTdCLENBQUM7SUFFRyxXQUFXO1FBQ2QsSUFBSSxDQUFDLFFB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YyxFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO1lBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxRSxPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztZQUNyQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7U0FDeEQsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELElBQVksWUFBWTtRQUNwQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDO0lBQzVGLENBQUM7OEdBcFJRLGlCQUFpQjtrR0FBakIsaUJBQWlCLGdHQ3ZCOUIseXBEQTRCQTs7MkZETGEsaUJBQWlCO2tCQU43QixTQUFTOytCQUNJLGdCQUFnQixtQkFHVCx1QkFBdUIsQ0FBQyxNQUFNO3NMQVN4QyxNQUFNO3NCQURaLEtBQUs7Z0JBSUMsR0FBRztzQkFEVCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDb21wb25lbnQsXG4gICAgRWxlbWVudFJlZixcbiAgICBJbnB1dCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0XG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb2x1bW4gfSBmcm9tIFwiLi4vLi4vbW9kZWxzL0NvbHVtblwiO1xuaW1wb3J0IHsgUm93IH0gZnJvbSBcIi4uLy4uL21vZGVscy9Sb3dcIjtcbmltcG9ydCB7IEZvcm1Db250cm9sLCBGb3JtR3JvdXAgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IEZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW4gfSBmcm9tIFwiQGFuZ3VsYXIvY2RrL2ExMXlcIjtcbmltcG9ydCB7IEdyaWRTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2VzL2dyaWQuc2VydmljZVwiO1xuaW1wb3J0IHsgYXN5bmNTY2hlZHVsZXIsIGZpbHRlciwgZnJvbUV2ZW50LCBTdWJqZWN0LCB0YWtlLCB0YWtlVW50aWwsIHRhcCwgdGltZXIgfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgQ2VsbEVkaXRFdmVudCB9IGZyb20gXCIuLi8uLi9tb2RlbHMvQ2VsbEVkaXRFdmVudFwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJtb25hLWdyaWQtY2VsbFwiLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vZ3JpZC1jZWxsLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL2dyaWQtY2VsbC5jb21wb25lbnQuc2Nzc1wiXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBHcmlkQ2VsbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICByZWFkb25seSAjZGVzdHJveTogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gICAgcHJpdmF0ZSBmb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGVkaXRGb3JtITogRm9ybUdyb3VwO1xuICAgIHB1YmxpYyBlZGl0aW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBjb2x1bW4hOiBDb2x1bW47XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyByb3chOiBSb3c7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBmb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBncmlkU2VydmljZTogR3JpZFNlcnZpY2VcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuI2Rlc3Ryb3kubmV4dCgpO1xuICAgICAgICB0aGlzLiNkZXN0cm95LmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVGb3JtKCk7XG4gICAgICAgIHRoaXMuc2V0U3Vic2NyaXB0aW9ucygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0aWFsaXplRm9ybSgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZm9ybSA9IHRoaXMucm93LmdldEVkaXRGb3JtKHRoaXMuY29sdW1uLmZpZWxkKTtcbiAgICAgICAgaWYgKGZvcm0pIHtcbiAgICAgICAgICAgIHRoaXMuZWRpdEZvcm0gPSBmb3JtO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lZGl0Rm9ybSA9IG5ldyBGb3JtR3JvdXAoe30pO1xuICAgICAgICAgICAgdGhpcy5lZGl0Rm9ybS5hZGRDb250cm9sKHRoaXMuY29sdW1uLmZpZWxkLCBuZXcgRm9ybUNvbnRyb2wodGhpcy5yb3cuZGF0YVt0aGlzLmNvbHVtbi5maWVsZF0pKTtcbiAgICAgICAgICAgIHRoaXMucm93LnNldEVkaXRGb3JtKHRoaXMuY29sdW1uLmZpZWxkLCB0aGlzLmVkaXRGb3JtKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvbkRhdGVDaGFuZ2UoZGF0ZTogRGF0ZSB8IG51bGwpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5lZGl0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ3JpZFNlcnZpY2UuaXNJbkVkaXRNb2RlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIG9uRm9jdXNDaGFuZ2Uob3JpZ2luOiBGb2N1c09yaWdpbik6IHZvaWQge1xuICAgICAgICBpZiAoIW9yaWdpbikge1xuICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLmNvbHVtbi5maWx0ZXJUeXBlID09PSBcImRhdGVcIiA/IDUwIDogMjU7XG4gICAgICAgICAgICB0aW1lcihkdXJhdGlvbilcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZ3JpZEVkaXRhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29sdW1uLmZpbHRlclR5cGUgIT09IFwiZGF0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5lZGl0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDZWxsVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVQb3B1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9uYS1kYXRlLWlucHV0LXBvcHVwXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRlUG9wdXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVkaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmVkaXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNlbGxWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZFNlcnZpY2UuaXNJbkVkaXRNb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9yaWdpbiAhPT0gXCJtb3VzZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWRpdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jU2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNDZWxsSW5wdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBub3RpZnlDZWxsRWRpdCgpOiBDZWxsRWRpdEV2ZW50IHtcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgQ2VsbEVkaXRFdmVudCh7XG4gICAgICAgICAgICBmaWVsZDogdGhpcy5jb2x1bW4uZmllbGQsXG4gICAgICAgICAgICBvbGRWYWx1ZTogdGhpcy5yb3cuZGF0YVt0aGlzLmNvbHVtbi5maWVsZF0sXG4gICAgICAgICAgICBuZXdWYWx1ZTogdGhpcy5lZGl0Rm9ybS52YWx1ZVt0aGlzLmNvbHVtbi5maWVsZF0sXG4gICAgICAgICAgICByb3dEYXRhOiB0aGlzLnJvdy5kYXRhLFxuICAgICAgICAgICAgc2V0TmV3VmFsdWU6ICh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0Rm9ybS5nZXQodGhpcy5jb2x1bW4uZmllbGQpPy5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5yb3cuZGF0YVt0aGlzLmNvbHVtbi5maWVsZF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChldmVudC5vbGRWYWx1ZSAhPT0gZXZlbnQubmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFNlcnZpY2UuY2VsbEVkaXQkLm5leHQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBldmVudDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZvY3VzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRWxlbWVudCwgXCJwcm9ncmFtXCIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZm9jdXNDZWxsSW5wdXQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmNvbHVtbi5maWx0ZXJUeXBlID09PSBcInN0cmluZ1wiIHx8IHRoaXMuY29sdW1uLmZpbHRlclR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKT8uZm9jdXMoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbHVtbi5maWx0ZXJUeXBlID09PSBcImRhdGVcIikge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpPy5mb2N1cygpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29sdW1uLmZpbHRlclR5cGUgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik/LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFN1YnNjcmlwdGlvbnMoKTogdm9pZCB7XG4gICAgICAgIGZyb21FdmVudDxNb3VzZUV2ZW50Pih0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgXCJkYmxjbGlja1wiKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuI2Rlc3Ryb3kpLFxuICAgICAgICAgICAgICAgIHRhcChldmVudCA9PiBldmVudC5zdG9wUHJvcGFnYXRpb24oKSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5ncmlkRWRpdGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZFNlcnZpY2UuaXNJbkVkaXRNb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgICAgICBhc3luY1NjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNDZWxsSW5wdXQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBmcm9tRXZlbnQ8TW91c2VFdmVudD4odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIFwiY2xpY2tcIilcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLiNkZXN0cm95KSxcbiAgICAgICAgICAgICAgICB0YXAoZXZlbnQgPT4gZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCkpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZWRpdGluZyAmJiB0aGlzLmdyaWRTZXJ2aWNlLmlzSW5FZGl0TW9kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLmlzSW5FZGl0TW9kZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICBmcm9tRXZlbnQ8S2V5Ym9hcmRFdmVudD4odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIFwia2V5ZG93blwiKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuI2Rlc3Ryb3kpLFxuICAgICAgICAgICAgICAgIHRhcChldmVudCA9PiBldmVudC5zdG9wUHJvcGFnYXRpb24oKSksXG4gICAgICAgICAgICAgICAgZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICBldmVudCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQua2V5ID09PSBcIkVudGVyXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmtleSA9PT0gXCJFc2NhcGVcIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQua2V5ID09PSBcIkFycm93VXBcIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQua2V5ID09PSBcIkFycm93RG93blwiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5rZXkgPT09IFwiQXJyb3dMZWZ0XCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmtleSA9PT0gXCJBcnJvd1JpZ2h0XCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmtleSA9PT0gXCJGMlwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gXCJFbnRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmVkaXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2VsbFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmlkU2VydmljZS5pc0luRWRpdE1vZGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVkaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmlkU2VydmljZS5pc0luRWRpdE1vZGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSBcIkFycm93VXBcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZWRpdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNSb3dFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdHJbZGF0YS1ydWlkPScke3RoaXMucm93LnVpZH0nXWBcbiAgICAgICAgICAgICAgICAgICAgICAgICk/LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNSb3dFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IHByZXZpb3VzUm93RWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdGQgLm1vbmEtZ3JpZC1jZWxsW2RhdGEtZmllbGQ9JyR7dGhpcy5jb2x1bW4uZmllbGR9J11gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09IFwiQXJyb3dEb3duXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmVkaXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRSb3dFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdHJbZGF0YS1ydWlkPScke3RoaXMucm93LnVpZH0nXWBcbiAgICAgICAgICAgICAgICAgICAgICAgICk/Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0Um93RWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBuZXh0Um93RWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdGQgLm1vbmEtZ3JpZC1jZWxsW2RhdGEtZmllbGQ9JyR7dGhpcy5jb2x1bW4uZmllbGR9J11gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09IFwiQXJyb3dMZWZ0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmVkaXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHRyW2RhdGEtcnVpZD0nJHt0aGlzLnJvdy51aWR9J11gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29sdW1uLmluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNlbGwgPSByb3cucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHRkIC5tb25hLWdyaWQtY2VsbFtkYXRhLWNvbC1pbmRleD0nJHt0aGlzLmNvbHVtbi5pbmRleCAtIDF9J11gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c1Jvd0VsZW1lbnQgPSByb3cucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNSb3dFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBwcmV2aW91c1Jvd0VsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGQ6bGFzdC1jaGlsZCAubW9uYS1ncmlkLWNlbGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VsbC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09IFwiQXJyb3dSaWdodFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5lZGl0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGB0cltkYXRhLXJ1aWQ9JyR7dGhpcy5yb3cudWlkfSddYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbHVtbi5pbmRleCA8IHRoaXMuZ3JpZFNlcnZpY2UuY29sdW1ucy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IHJvdy5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdGQgLm1vbmEtZ3JpZC1jZWxsW2RhdGEtY29sLWluZGV4PScke3RoaXMuY29sdW1uLmluZGV4ICsgMX0nXWBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbGwuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRSb3dFbGVtZW50ID0gcm93Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFJvd0VsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IG5leHRSb3dFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRkOmZpcnN0LWNoaWxkIC5tb25hLWdyaWQtY2VsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZWxsLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gXCJGMlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5ncmlkRWRpdGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5mb2N1c2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVkaXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmlkU2VydmljZS5pc0luRWRpdE1vZGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmNTY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNDZWxsSW5wdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVDZWxsVmFsdWUoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5ub3RpZnlDZWxsRWRpdCgpO1xuICAgICAgICBpZiAoIWV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnJvdy5kYXRhW3RoaXMuY29sdW1uLmZpZWxkXSA9IHRoaXMuZWRpdEZvcm0udmFsdWVbdGhpcy5jb2x1bW4uZmllbGRdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWRpdEZvcm0ucGF0Y2hWYWx1ZSh7XG4gICAgICAgICAgICBbdGhpcy5jb2x1bW4uZmllbGRdOiB0aGlzLnJvdy5kYXRhW3RoaXMuY29sdW1uLmZpZWxkXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBncmlkRWRpdGFibGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuZ3JpZFNlcnZpY2UuZWRpdGFibGVPcHRpb25zICYmICEhdGhpcy5ncmlkU2VydmljZS5lZGl0YWJsZU9wdGlvbnMuZW5hYmxlZDtcbiAgICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwibW9uYS1ncmlkLWNlbGxcIiBbYXR0ci50YWJpbmRleF09XCJlZGl0aW5nID8gLTEgOiAwXCIgY2RrTW9uaXRvclN1YnRyZWVGb2N1cyAoY2RrRm9jdXNDaGFuZ2UpPVwib25Gb2N1c0NoYW5nZSgkZXZlbnQpXCJcbiAgICAgW25nQ2xhc3NdPVwieydtb25hLWdyaWQtY2VsbC1lZGl0aW5nJzogZWRpdGluZ31cIiBbYXR0ci5kYXRhLXJ1aWRdPVwicm93LnVpZFwiIFthdHRyLmRhdGEtZmllbGRdPVwiY29sdW1uLmZpZWxkXCIgW2F0dHIuZGF0YS1jb2wtaW5kZXhdPVwiY29sdW1uLmluZGV4XCI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFlZGl0aW5nXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhY29sdW1uLmNlbGxUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtb25hLWdyaWQtY2VsbC10ZXh0XCI+e3tyb3cuZGF0YVtjb2x1bW4uZmllbGRdfX08L3NwYW4+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbHVtbi5jZWxsVGVtcGxhdGUudGVtcGxhdGVSZWYgPz8gbnVsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJjb2x1bW4uY2VsbFRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IHJvdywgY29sdW1ufVwiPjwvbmctY29udGFpbmVyPlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwiY2VsbEVkaXRUZW1wbGF0ZVwiICpuZ0lmPVwiZWRpdGluZ1wiPjwvbmctY29udGFpbmVyPlxuPC9kaXY+XG5cbjxuZy10ZW1wbGF0ZSAjY2VsbEVkaXRUZW1wbGF0ZT5cbiAgICA8Zm9ybSBbZm9ybUdyb3VwXT1cImVkaXRGb3JtXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb2x1bW4uZmlsdGVyVHlwZT09PSdzdHJpbmcnXCI+XG4gICAgICAgICAgICA8bW9uYS10ZXh0LWJveCBbZm9ybUNvbnRyb2xOYW1lXT1cImNvbHVtbi5maWVsZFwiPjwvbW9uYS10ZXh0LWJveD5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb2x1bW4uZmlsdGVyVHlwZT09PSdudW1iZXInXCI+XG4gICAgICAgICAgICA8bW9uYS1udW1lcmljLXRleHQtYm94IFtmb3JtQ29udHJvbE5hbWVdPVwiY29sdW1uLmZpZWxkXCIgW2RlY2ltYWxzXT1cIjNcIj48L21vbmEtbnVtZXJpYy10ZXh0LWJveD5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb2x1bW4uZmlsdGVyVHlwZT09PSdkYXRlJ1wiPlxuICAgICAgICAgICAgPG1vbmEtZGF0ZS1waWNrZXIgW2Zvcm1Db250cm9sTmFtZV09XCJjb2x1bW4uZmllbGRcIiAodmFsdWVDaGFuZ2UpPVwib25EYXRlQ2hhbmdlKCRldmVudClcIj48L21vbmEtZGF0ZS1waWNrZXI+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY29sdW1uLmZpbHRlclR5cGU9PT0nYm9vbGVhbidcIj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBbZm9ybUNvbnRyb2xOYW1lXT1cImNvbHVtbi5maWVsZFwiIG1vbmFDaGVja0JveCAvPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L2Zvcm0+XG48L25nLXRlbXBsYXRlPlxuIl19