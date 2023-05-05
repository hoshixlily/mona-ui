import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../../../dropdowns/modules/drop-down-list/components/drop-down-list/drop-down-list.component";
import * as i3 from "../../../inputs/modules/text-box/components/text-box/text-box.component";
import * as i4 from "../../../buttons/modules/button/directives/button.directive";
import * as i5 from "@angular/forms";
import * as i6 from "../../../inputs/modules/numeric-text-box/components/numeric-text-box/numeric-text-box.component";
import * as i7 from "../../../date-inputs/modules/date-picker/components/date-picker/date-picker.component";
import * as i8 from "../../../date-inputs/modules/date-time-picker/components/date-time-picker/date-time-picker.component";
import * as i9 from "../../../date-inputs/modules/time-picker/components/time-picker/time-picker.component";
import * as i10 from "../../../buttons/modules/button-group/components/button-group/button-group.component";
import * as i11 from "../../pipes/valueless-operator.pipe";
import * as i12 from "../../pipes/operator-filter.pipe";
export class FilterMenuComponent {
    set value(value) {
        this.setFilterValues(value);
    }
    get value() {
        return this.getFilterValues();
    }
    constructor() {
        this.booleanFilterValues = [null, null];
        this.booleanFilterMenuDataItems = [
            { text: "Is true", value: "eq" },
            { text: "Is false", value: "neq" },
            { text: "Is null", value: "isnull" },
            { text: "Is not null", value: "isnotnull" }
        ];
        this.connectorDataItems = [
            { text: "AND", value: "and" },
            { text: "OR", value: "or" }
        ];
        this.dateFilterMenuDataItems = [
            { text: "Is equal to", value: "eq" },
            { text: "Is not equal to", value: "neq" },
            { text: "Is after", value: "gt" },
            { text: "Is after or equal to", value: "gte" },
            { text: "Is before", value: "lt" },
            { text: "Is before or equal to", value: "lte" },
            { text: "Is null", value: "isnull" },
            { text: "Is not null", value: "isnotnull" }
        ];
        // TODO: Add null and empty filter operators
        this.numericFilterMenuDataItems = [
            { text: "Is equal to", value: "eq" },
            { text: "Is not equal to", value: "neq" },
            { text: "Is greater than", value: "gt" },
            { text: "Is greater than or equal to", value: "gte" },
            { text: "Is less than", value: "lt" },
            { text: "Is less than or equal to", value: "lte" },
            { text: "Is null", value: "isnull" },
            { text: "Is not null", value: "isnotnull" }
        ];
        this.stringFilterMenuDataItems = [
            { text: "Contains", value: "contains" },
            { text: "Does not contain", value: "doesnotcontain" },
            { text: "Ends with", value: "endswith" },
            { text: "Starts with", value: "startswith" },
            { text: "Is equal to", value: "eq" },
            { text: "Is not equal to", value: "neq" },
            { text: "Is empty", value: "isempty" },
            { text: "Is not empty", value: "isnotempty" },
            { text: "Is null", value: "isnull" },
            { text: "Is not null", value: "isnotnull" },
            { text: "Is null or empty", value: "isnullorempty" },
            { text: "Is not null or empty", value: "isnotnullorempty" }
        ];
        this.dateFilterValues = [null, null];
        this.numberFilterValues = [null, null];
        this.selectedConnectorItem = null;
        this.selectedFilterMenuDataItemList = [undefined, undefined];
        this.stringFilterValues = ["", ""];
        this.apply = new EventEmitter();
        this.dateOptions = {
            format: "dd/MM/yyyy",
            type: "date"
        };
        this.field = "";
        this.operators = [];
        this.type = "string";
    }
    ngOnInit() { }
    onConnectorChange(item) {
        if (item.value === this.selectedConnectorItem?.value) {
            this.selectedConnectorItem = null;
        }
        else {
            this.selectedConnectorItem = item;
        }
    }
    getBooleanDescriptor(operator) {
        if (operator === "isnotnull" || operator === "isnull") {
            return {
                field: this.field,
                operator: operator
            };
        }
        else {
            return {
                field: this.field,
                operator: "eq",
                value: operator === "eq"
            };
        }
    }
    getDateDescriptor(operator, value) {
        if (operator === "isnotnull" || operator === "isnull") {
            return {
                field: this.field,
                operator: operator
            };
        }
        else if (value != null) {
            return {
                field: this.field,
                operator: operator,
                value: value
            };
        }
        return null;
    }
    getNumberDescriptor(operator, value) {
        if (operator === "isnotnull" || operator === "isnull") {
            return {
                field: this.field,
                operator: operator
            };
        }
        else if (value != null) {
            return {
                field: this.field,
                operator: operator,
                value: value
            };
        }
        return null;
    }
    getStringDescriptor(operator, value) {
        if (operator === "isnotnull" || operator === "isnull") {
            return {
                field: this.field,
                operator: operator
            };
        }
        else if (operator === "isempty" || operator === "isnotempty") {
            return {
                field: this.field,
                operator: operator
            };
        }
        else if (operator === "isnullorempty" || operator === "isnotnullorempty") {
            return {
                field: this.field,
                operator: operator
            };
        }
        else if (value != null) {
            return {
                field: this.field,
                operator: operator,
                value: value
            };
        }
        return null;
    }
    onFilterApply() {
        if (this.type === "string") {
            const value1 = this.stringFilterValues[0];
            const value2 = this.stringFilterValues[1];
            const operator1 = this.selectedFilterMenuDataItemList[0]?.value;
            const operator2 = this.selectedFilterMenuDataItemList[1]?.value;
            const stringDescriptors = [];
            const descriptor1 = this.getStringDescriptor(operator1, value1);
            if (descriptor1 != null) {
                stringDescriptors.push(descriptor1);
            }
            if (this.selectedConnectorItem) {
                const descriptor2 = this.getStringDescriptor(operator2, value2);
                if (descriptor2 != null) {
                    stringDescriptors.push(descriptor2);
                }
            }
            const descriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: stringDescriptors
            };
            this.apply.emit(descriptor);
        }
        else if (this.type === "number") {
            const value1 = this.numberFilterValues[0];
            const value2 = this.numberFilterValues[1];
            const operator1 = this.selectedFilterMenuDataItemList[0]?.value;
            const operator2 = this.selectedFilterMenuDataItemList[1]?.value;
            const numberDescriptors = [];
            const descriptor1 = this.getNumberDescriptor(operator1, value1);
            if (descriptor1 != null) {
                numberDescriptors.push(descriptor1);
            }
            if (this.selectedConnectorItem) {
                const descriptor2 = this.getNumberDescriptor(operator2, value2);
                if (descriptor2 != null) {
                    numberDescriptors.push(descriptor2);
                }
            }
            const descriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: numberDescriptors
            };
            this.apply.emit(descriptor);
        }
        else if (this.type === "date") {
            const value1 = this.dateFilterValues[0];
            const value2 = this.dateFilterValues[1];
            const operator1 = this.selectedFilterMenuDataItemList[0]?.value;
            const operator2 = this.selectedFilterMenuDataItemList[1]?.value;
            const dateDescriptors = [];
            const descriptor1 = this.getDateDescriptor(operator1, value1);
            if (descriptor1 != null) {
                dateDescriptors.push(descriptor1);
            }
            if (this.selectedConnectorItem) {
                const descriptor2 = this.getDateDescriptor(operator2, value2);
                if (descriptor2 != null) {
                    dateDescriptors.push(descriptor2);
                }
            }
            const descriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: dateDescriptors
            };
            this.apply.emit(descriptor);
        }
        else if (this.type === "boolean") {
            const operator1 = this.selectedFilterMenuDataItemList[0]?.value;
            const operator2 = this.selectedFilterMenuDataItemList[1]?.value;
            const booleanDescriptors = [];
            const descriptor1 = this.getBooleanDescriptor(operator1);
            if (descriptor1 != null) {
                booleanDescriptors.push(descriptor1);
            }
            if (this.selectedConnectorItem) {
                const descriptor2 = this.getBooleanDescriptor(operator2);
                if (descriptor2 != null) {
                    booleanDescriptors.push(descriptor2);
                }
            }
            const descriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: booleanDescriptors
            };
            this.apply.emit(descriptor);
        }
        else {
            console.log("Filter type not supported yet.");
        }
    }
    onFilterClear() {
        this.numberFilterValues = [null, null];
        this.stringFilterValues = ["", ""];
        this.dateFilterValues = [null, null];
        this.booleanFilterValues = [null, null];
        this.selectedFilterMenuDataItemList = [undefined, undefined];
        this.selectedConnectorItem = null;
        this.apply.emit({
            logic: "and",
            filters: []
        });
    }
    onFilterOperatorChange(index, item) {
        this.selectedFilterMenuDataItemList[index] = item;
    }
    get firstFilterValid() {
        const operator = this.selectedFilterMenuDataItemList[0]?.value;
        if (!operator) {
            return false;
        }
        if (operator === "isnull" || operator === "isnotnull") {
            return true;
        }
        switch (this.type) {
            case "string":
                if (operator === "isempty" ||
                    operator === "isnotempty" ||
                    operator === "isnullorempty" ||
                    operator === "isnotnullorempty") {
                    return true;
                }
                return this.stringFilterValues[0] !== "";
            case "number":
                return this.numberFilterValues[0] !== null;
            case "date":
                return this.dateFilterValues[0] !== null;
            case "boolean":
                return true;
            default:
                return false;
        }
    }
    get secondFilterValid() {
        const operator = this.selectedFilterMenuDataItemList[1]?.value;
        if (!operator) {
            return false;
        }
        if (operator === "isnull" || operator === "isnotnull") {
            return true;
        }
        switch (this.type) {
            case "string":
                if (operator === "isempty" ||
                    operator === "isnotempty" ||
                    operator === "isnullorempty" ||
                    operator === "isnotnullorempty") {
                    return true;
                }
                return this.stringFilterValues[1] !== "";
            case "number":
                return this.numberFilterValues[1] !== null;
            case "date":
                return this.dateFilterValues[1] !== null;
            case "boolean":
                return true;
            default:
                return false;
        }
    }
    getFilterValues() {
        switch (this.type) {
            case "string":
                return {
                    operator1: this.selectedFilterMenuDataItemList[0]?.value,
                    value1: this.stringFilterValues[0],
                    logic: this.selectedConnectorItem?.value,
                    operator2: this.selectedFilterMenuDataItemList[1]?.value,
                    value2: this.stringFilterValues[1]
                };
            case "number":
                return {
                    operator1: this.selectedFilterMenuDataItemList[0]?.value,
                    value1: this.numberFilterValues[0],
                    logic: this.selectedConnectorItem?.value,
                    operator2: this.selectedFilterMenuDataItemList[1]?.value,
                    value2: this.numberFilterValues[1]
                };
            case "date":
                return {
                    operator1: this.selectedFilterMenuDataItemList[0]?.value,
                    value1: this.dateFilterValues[0],
                    logic: this.selectedConnectorItem?.value,
                    operator2: this.selectedFilterMenuDataItemList[1]?.value,
                    value2: this.dateFilterValues[1]
                };
            case "boolean":
                return {
                    operator1: this.selectedFilterMenuDataItemList[0]?.value,
                    value1: this.booleanFilterValues[0],
                    logic: this.selectedConnectorItem?.value,
                    operator2: this.selectedFilterMenuDataItemList[1]?.value,
                    value2: this.booleanFilterValues[1]
                };
            default:
                return {
                    operator1: undefined,
                    value1: null,
                    logic: undefined,
                    operator2: undefined,
                    value2: null
                };
        }
    }
    setFilterValues(values) {
        switch (this.type) {
            case "string":
                this.selectedFilterMenuDataItemList = [
                    this.stringFilterMenuDataItems.find(f => f.value === values.operator1) ?? undefined,
                    this.stringFilterMenuDataItems.find(f => f.value === values.operator2) ?? undefined
                ];
                this.stringFilterValues = [values.value1 ?? "", values.value2 ?? ""];
                this.selectedConnectorItem = this.connectorDataItems.find(c => c.value === values.logic) ?? null;
                break;
            case "number":
                this.selectedFilterMenuDataItemList = [
                    this.numericFilterMenuDataItems.find(f => f.value === values.operator1) ?? undefined,
                    this.numericFilterMenuDataItems.find(f => f.value === values.operator2) ?? undefined
                ];
                this.numberFilterValues = [values.value1 ?? null, values.value2 ?? null];
                break;
            case "date":
                this.selectedFilterMenuDataItemList = [
                    this.dateFilterMenuDataItems.find(f => f.value === values.operator1) ?? undefined,
                    this.dateFilterMenuDataItems.find(f => f.value === values.operator2) ?? undefined
                ];
                this.dateFilterValues = [values.value1 ?? null, values.value2 ?? null];
                break;
            case "boolean":
                this.selectedFilterMenuDataItemList = [
                    this.booleanFilterMenuDataItems.find(f => f.value === values.operator1) ?? undefined,
                    this.booleanFilterMenuDataItems.find(f => f.value === values.operator2) ?? undefined
                ];
                this.booleanFilterValues = [values.value1 ?? null, values.value2 ?? null];
                break;
            default:
                break;
        }
        this.selectedConnectorItem = this.connectorDataItems.find(c => c.value === values.logic) ?? null;
    }
    get applyDisabled() {
        return !this.firstFilterValid || (!!this.selectedConnectorItem && !this.secondFilterValid);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: FilterMenuComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: FilterMenuComponent, selector: "mona-filter-menu", inputs: { dateOptions: "dateOptions", field: "field", operators: "operators", value: "value", type: "type" }, outputs: { apply: "apply" }, ngImport: i0, template: "<div class=\"mona-filter-menu\">\n    <div class=\"mona-filter-menu-item\">\n        <ng-container *ngIf=\"type==='string'\">\n            <mona-drop-down-list [data]=\"stringFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n            <mona-text-box [(ngModel)]=\"stringFilterValues[0]\" [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='number'\">\n            <mona-drop-down-list [data]=\"numericFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n            <mona-numeric-text-box [(ngModel)]=\"numberFilterValues[0]\" [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-numeric-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='date'\">\n            <mona-drop-down-list [data]=\"dateFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n\n            <mona-date-picker [(value)]=\"dateFilterValues[0]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='date'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-date-picker>\n\n            <mona-date-time-picker [(value)]=\"dateFilterValues[0]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='datetime'\"\n                                   [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-date-time-picker>\n\n            <mona-time-picker [(value)]=\"dateFilterValues[0]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='time'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-time-picker>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='boolean'\">\n            <mona-drop-down-list [data]=\"booleanFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n        </ng-container>\n\n    </div>\n    <div class=\"mona-filter-menu-item\" *ngIf=\"firstFilterValid\">\n        <mona-button-group selection=\"single\" [disabled]=\"!firstFilterValid\">\n            <button monaButton [selected]=\"item.value === selectedConnectorItem?.value\" (click)=\"onConnectorChange(item)\" *ngFor=\"let item of connectorDataItems\">{{item.text}}</button>\n        </mona-button-group>\n    </div>\n    <div class=\"mona-filter-menu-item\" *ngIf=\"!!selectedConnectorItem\">\n        <ng-container *ngIf=\"type==='string'\">\n            <mona-drop-down-list [data]=\"stringFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n            <mona-text-box [(ngModel)]=\"stringFilterValues[1]\" [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='number'\">\n            <mona-drop-down-list [data]=\"numericFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n\n            <mona-numeric-text-box [(ngModel)]=\"numberFilterValues[1]\" [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-numeric-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='date'\">\n            <mona-drop-down-list [data]=\"dateFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n\n            <mona-date-picker [(value)]=\"dateFilterValues[1]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='date'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-date-picker>\n\n            <mona-date-time-picker [(value)]=\"dateFilterValues[1]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='datetime'\"\n                                   [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-date-time-picker>\n\n            <mona-time-picker [(value)]=\"dateFilterValues[1]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='time'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-time-picker>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='boolean'\">\n            <mona-drop-down-list [data]=\"booleanFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n        </ng-container>\n\n    </div>\n    <div class=\"mona-filter-menu-item mona-filter-menu-actions\">\n        <button monaButton (click)=\"onFilterApply()\" [disabled]=\"applyDisabled\">Apply</button>\n        <button monaButton (click)=\"onFilterClear()\">Clear</button>\n    </div>\n</div>\n", styles: ["div.mona-filter-menu{width:100%;padding:5px;display:flex;flex-direction:column;row-gap:5px}div.mona-filter-menu-item{display:flex;flex-direction:column;row-gap:5px}div.mona-filter-menu-actions{display:flex;flex-direction:row;align-items:center;justify-content:center;column-gap:5px}div.mona-filter-menu-actions>button{flex:1}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.DropDownListComponent, selector: "mona-drop-down-list", inputs: ["filterable", "value"], outputs: ["valueChange"] }, { kind: "component", type: i3.TextBoxComponent, selector: "mona-text-box", inputs: ["disabled", "readonly"], outputs: ["inputBlur", "inputFocus"] }, { kind: "directive", type: i4.ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "directive", type: i5.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i6.NumericTextBoxComponent, selector: "mona-numeric-text-box", inputs: ["decimals", "disabled", "formatter", "max", "min", "readonly", "spinners", "step", "value"], outputs: ["inputBlur", "inputFocus", "valueChange"] }, { kind: "component", type: i7.DatePickerComponent, selector: "mona-date-picker", inputs: ["format"] }, { kind: "component", type: i8.DateTimePickerComponent, selector: "mona-date-time-picker", inputs: ["format", "hourFormat", "showSeconds"] }, { kind: "component", type: i9.TimePickerComponent, selector: "mona-time-picker", inputs: ["hourFormat", "showSeconds"] }, { kind: "component", type: i10.ButtonGroupComponent, selector: "mona-button-group", inputs: ["disabled", "selection"] }, { kind: "pipe", type: i11.ValuelessOperatorPipe, name: "valuelessOperator" }, { kind: "pipe", type: i12.OperatorFilterPipe, name: "operatorFilter" }], changeDetection: i0.ChangeDetectionStrategy.Default }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: FilterMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-filter-menu", changeDetection: ChangeDetectionStrategy.Default, template: "<div class=\"mona-filter-menu\">\n    <div class=\"mona-filter-menu-item\">\n        <ng-container *ngIf=\"type==='string'\">\n            <mona-drop-down-list [data]=\"stringFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n            <mona-text-box [(ngModel)]=\"stringFilterValues[0]\" [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='number'\">\n            <mona-drop-down-list [data]=\"numericFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n            <mona-numeric-text-box [(ngModel)]=\"numberFilterValues[0]\" [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-numeric-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='date'\">\n            <mona-drop-down-list [data]=\"dateFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n\n            <mona-date-picker [(value)]=\"dateFilterValues[0]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='date'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-date-picker>\n\n            <mona-date-time-picker [(value)]=\"dateFilterValues[0]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='datetime'\"\n                                   [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-date-time-picker>\n\n            <mona-time-picker [(value)]=\"dateFilterValues[0]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='time'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-time-picker>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='boolean'\">\n            <mona-drop-down-list [data]=\"booleanFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n        </ng-container>\n\n    </div>\n    <div class=\"mona-filter-menu-item\" *ngIf=\"firstFilterValid\">\n        <mona-button-group selection=\"single\" [disabled]=\"!firstFilterValid\">\n            <button monaButton [selected]=\"item.value === selectedConnectorItem?.value\" (click)=\"onConnectorChange(item)\" *ngFor=\"let item of connectorDataItems\">{{item.text}}</button>\n        </mona-button-group>\n    </div>\n    <div class=\"mona-filter-menu-item\" *ngIf=\"!!selectedConnectorItem\">\n        <ng-container *ngIf=\"type==='string'\">\n            <mona-drop-down-list [data]=\"stringFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n            <mona-text-box [(ngModel)]=\"stringFilterValues[1]\" [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='number'\">\n            <mona-drop-down-list [data]=\"numericFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n\n            <mona-numeric-text-box [(ngModel)]=\"numberFilterValues[1]\" [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-numeric-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='date'\">\n            <mona-drop-down-list [data]=\"dateFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n\n            <mona-date-picker [(value)]=\"dateFilterValues[1]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='date'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-date-picker>\n\n            <mona-date-time-picker [(value)]=\"dateFilterValues[1]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='datetime'\"\n                                   [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-date-time-picker>\n\n            <mona-time-picker [(value)]=\"dateFilterValues[1]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='time'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-time-picker>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='boolean'\">\n            <mona-drop-down-list [data]=\"booleanFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n        </ng-container>\n\n    </div>\n    <div class=\"mona-filter-menu-item mona-filter-menu-actions\">\n        <button monaButton (click)=\"onFilterApply()\" [disabled]=\"applyDisabled\">Apply</button>\n        <button monaButton (click)=\"onFilterClear()\">Clear</button>\n    </div>\n</div>\n", styles: ["div.mona-filter-menu{width:100%;padding:5px;display:flex;flex-direction:column;row-gap:5px}div.mona-filter-menu-item{display:flex;flex-direction:column;row-gap:5px}div.mona-filter-menu-actions{display:flex;flex-direction:row;align-items:center;justify-content:center;column-gap:5px}div.mona-filter-menu-actions>button{flex:1}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { apply: [{
                type: Output
            }], dateOptions: [{
                type: Input
            }], field: [{
                type: Input
            }], operators: [{
                type: Input
            }], value: [{
                type: Input
            }], type: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLW1lbnUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2ZpbHRlci9jb21wb25lbnRzL2ZpbHRlci1tZW51L2ZpbHRlci1tZW51LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9maWx0ZXIvY29tcG9uZW50cy9maWx0ZXItbWVudS9maWx0ZXItbWVudS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7Ozs7OztBQXdCeEcsTUFBTSxPQUFPLG1CQUFtQjtJQXlFNUIsSUFDVyxLQUFLLENBQUMsS0FBc0I7UUFDbkMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsSUFBVyxLQUFLO1FBQ1osT0FBTyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUtEO1FBcEZRLHdCQUFtQixHQUFxQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3RCwrQkFBMEIsR0FBeUI7WUFDL0QsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDaEMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDbEMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDcEMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUU7U0FDOUMsQ0FBQztRQUVjLHVCQUFrQixHQUE4QjtZQUM1RCxFQUFFLElBQUksRUFBRSxLQUFLLEVB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aGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBGaWx0ZXJGaWVsZFR5cGUgfSBmcm9tIFwiLi4vLi4vbW9kZWxzL0ZpbHRlckZpZWxkVHlwZVwiO1xuaW1wb3J0IHsgRmlsdGVyTWVudURhdGFJdGVtIH0gZnJvbSBcIi4uLy4uL21vZGVscy9GaWx0ZXJNZW51RGF0YUl0ZW1cIjtcbmltcG9ydCB7IEZpbHRlck1lbnVDb25uZWN0b3JJdGVtIH0gZnJvbSBcIi4uLy4uL21vZGVscy9GaWx0ZXJNZW51Q29ubmVjdG9ySXRlbVwiO1xuaW1wb3J0IHtcbiAgICBCb29sZWFuRmlsdGVyRGVzY3JpcHRvcixcbiAgICBCb29sZWFuRmlsdGVyT3BlcmF0b3JzLFxuICAgIENvbXBvc2l0ZUZpbHRlckRlc2NyaXB0b3IsXG4gICAgRGF0ZUZpbHRlckRlc2NyaXB0b3IsXG4gICAgRGF0ZUZpbHRlck9wZXJhdG9ycyxcbiAgICBGaWx0ZXJPcGVyYXRvcnMsXG4gICAgTnVtZXJpY0ZpbHRlckRlc2NyaXB0b3IsXG4gICAgTnVtZXJpY0ZpbHRlck9wZXJhdG9ycyxcbiAgICBTdHJpbmdGaWx0ZXJEZXNjcmlwdG9yLFxuICAgIFN0cmluZ0ZpbHRlck9wZXJhdG9yc1xufSBmcm9tIFwiLi4vLi4vLi4vcXVlcnkvZmlsdGVyL0ZpbHRlckRlc2NyaXB0b3JcIjtcbmltcG9ydCB7IEZpbHRlck1lbnVWYWx1ZSB9IGZyb20gXCIuLi8uLi9tb2RlbHMvRmlsdGVyTWVudVZhbHVlXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm1vbmEtZmlsdGVyLW1lbnVcIixcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2ZpbHRlci1tZW51LmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL2ZpbHRlci1tZW51LmNvbXBvbmVudC5zY3NzXCJdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdFxufSlcbmV4cG9ydCBjbGFzcyBGaWx0ZXJNZW51Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwcml2YXRlIGJvb2xlYW5GaWx0ZXJWYWx1ZXM6IFtib29sZWFuIHwgbnVsbCwgYm9vbGVhbiB8IG51bGxdID0gW251bGwsIG51bGxdO1xuICAgIHB1YmxpYyByZWFkb25seSBib29sZWFuRmlsdGVyTWVudURhdGFJdGVtczogRmlsdGVyTWVudURhdGFJdGVtW10gPSBbXG4gICAgICAgIHsgdGV4dDogXCJJcyB0cnVlXCIsIHZhbHVlOiBcImVxXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIklzIGZhbHNlXCIsIHZhbHVlOiBcIm5lcVwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJJcyBudWxsXCIsIHZhbHVlOiBcImlzbnVsbFwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJJcyBub3QgbnVsbFwiLCB2YWx1ZTogXCJpc25vdG51bGxcIiB9XG4gICAgXTtcblxuICAgIHB1YmxpYyByZWFkb25seSBjb25uZWN0b3JEYXRhSXRlbXM6IEZpbHRlck1lbnVDb25uZWN0b3JJdGVtW10gPSBbXG4gICAgICAgIHsgdGV4dDogXCJBTkRcIiwgdmFsdWU6IFwiYW5kXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIk9SXCIsIHZhbHVlOiBcIm9yXCIgfVxuICAgIF07XG5cbiAgICBwdWJsaWMgcmVhZG9ubHkgZGF0ZUZpbHRlck1lbnVEYXRhSXRlbXM6IEZpbHRlck1lbnVEYXRhSXRlbVtdID0gW1xuICAgICAgICB7IHRleHQ6IFwiSXMgZXF1YWwgdG9cIiwgdmFsdWU6IFwiZXFcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiSXMgbm90IGVxdWFsIHRvXCIsIHZhbHVlOiBcIm5lcVwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJJcyBhZnRlclwiLCB2YWx1ZTogXCJndFwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJJcyBhZnRlciBvciBlcXVhbCB0b1wiLCB2YWx1ZTogXCJndGVcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiSXMgYmVmb3JlXCIsIHZhbHVlOiBcImx0XCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIklzIGJlZm9yZSBvciBlcXVhbCB0b1wiLCB2YWx1ZTogXCJsdGVcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiSXMgbnVsbFwiLCB2YWx1ZTogXCJpc251bGxcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiSXMgbm90IG51bGxcIiwgdmFsdWU6IFwiaXNub3RudWxsXCIgfVxuICAgIF07XG5cbiAgICAvLyBUT0RPOiBBZGQgbnVsbCBhbmQgZW1wdHkgZmlsdGVyIG9wZXJhdG9yc1xuICAgIHB1YmxpYyByZWFkb25seSBudW1lcmljRmlsdGVyTWVudURhdGFJdGVtczogRmlsdGVyTWVudURhdGFJdGVtW10gPSBbXG4gICAgICAgIHsgdGV4dDogXCJJcyBlcXVhbCB0b1wiLCB2YWx1ZTogXCJlcVwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJJcyBub3QgZXF1YWwgdG9cIiwgdmFsdWU6IFwibmVxXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIklzIGdyZWF0ZXIgdGhhblwiLCB2YWx1ZTogXCJndFwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJJcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG9cIiwgdmFsdWU6IFwiZ3RlXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIklzIGxlc3MgdGhhblwiLCB2YWx1ZTogXCJsdFwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJJcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG9cIiwgdmFsdWU6IFwibHRlXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIklzIG51bGxcIiwgdmFsdWU6IFwiaXNudWxsXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIklzIG5vdCBudWxsXCIsIHZhbHVlOiBcImlzbm90bnVsbFwiIH1cbiAgICBdO1xuXG4gICAgcHVibGljIHJlYWRvbmx5IHN0cmluZ0ZpbHRlck1lbnVEYXRhSXRlbXM6IEZpbHRlck1lbnVEYXRhSXRlbVtdID0gW1xuICAgICAgICB7IHRleHQ6IFwiQ29udGFpbnNcIiwgdmFsdWU6IFwiY29udGFpbnNcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiRG9lcyBub3QgY29udGFpblwiLCB2YWx1ZTogXCJkb2Vzbm90Y29udGFpblwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJFbmRzIHdpdGhcIiwgdmFsdWU6IFwiZW5kc3dpdGhcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiU3RhcnRzIHdpdGhcIiwgdmFsdWU6IFwic3RhcnRzd2l0aFwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJJcyBlcXVhbCB0b1wiLCB2YWx1ZTogXCJlcVwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJJcyBub3QgZXF1YWwgdG9cIiwgdmFsdWU6IFwibmVxXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIklzIGVtcHR5XCIsIHZhbHVlOiBcImlzZW1wdHlcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiSXMgbm90IGVtcHR5XCIsIHZhbHVlOiBcImlzbm90ZW1wdHlcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiSXMgbnVsbFwiLCB2YWx1ZTogXCJpc251bGxcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiSXMgbm90IG51bGxcIiwgdmFsdWU6IFwiaXNub3RudWxsXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIklzIG51bGwgb3IgZW1wdHlcIiwgdmFsdWU6IFwiaXNudWxsb3JlbXB0eVwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJJcyBub3QgbnVsbCBvciBlbXB0eVwiLCB2YWx1ZTogXCJpc25vdG51bGxvcmVtcHR5XCIgfVxuICAgIF07XG5cbiAgICBwdWJsaWMgZGF0ZUZpbHRlclZhbHVlczogW0RhdGUgfCBudWxsLCBEYXRlIHwgbnVsbF0gPSBbbnVsbCwgbnVsbF07XG4gICAgcHVibGljIG51bWJlckZpbHRlclZhbHVlczogW251bWJlciB8IG51bGwsIG51bWJlciB8IG51bGxdID0gW251bGwsIG51bGxdO1xuICAgIHB1YmxpYyBzZWxlY3RlZENvbm5lY3Rvckl0ZW06IEZpbHRlck1lbnVDb25uZWN0b3JJdGVtIHwgbnVsbCA9IG51bGw7XG4gICAgcHVibGljIHNlbGVjdGVkRmlsdGVyTWVudURhdGFJdGVtTGlzdDogQXJyYXk8RmlsdGVyTWVudURhdGFJdGVtIHwgdW5kZWZpbmVkPiA9IFt1bmRlZmluZWQsIHVuZGVmaW5lZF07XG4gICAgcHVibGljIHN0cmluZ0ZpbHRlclZhbHVlczogW3N0cmluZywgc3RyaW5nXSA9IFtcIlwiLCBcIlwiXTtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBhcHBseTogRXZlbnRFbWl0dGVyPENvbXBvc2l0ZUZpbHRlckRlc2NyaXB0b3I+ID0gbmV3IEV2ZW50RW1pdHRlcjxDb21wb3NpdGVGaWx0ZXJEZXNjcmlwdG9yPigpO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZGF0ZU9wdGlvbnM6IHsgZm9ybWF0OiBzdHJpbmc7IHR5cGU6IFwiZGF0ZVwiIHwgXCJ0aW1lXCIgfCBcImRhdGV0aW1lXCIgfSA9IHtcbiAgICAgICAgZm9ybWF0OiBcImRkL01NL3l5eXlcIixcbiAgICAgICAgdHlwZTogXCJkYXRlXCJcbiAgICB9O1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZmllbGQ6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBvcGVyYXRvcnM6IEZpbHRlck9wZXJhdG9yc1tdID0gW107XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IEZpbHRlck1lbnVWYWx1ZSkge1xuICAgICAgICB0aGlzLnNldEZpbHRlclZhbHVlcyh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCB2YWx1ZSgpOiBGaWx0ZXJNZW51VmFsdWUge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGaWx0ZXJWYWx1ZXMoKTtcbiAgICB9XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0eXBlOiBGaWx0ZXJGaWVsZFR5cGUgPSBcInN0cmluZ1wiO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge31cblxuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHt9XG5cbiAgICBwdWJsaWMgb25Db25uZWN0b3JDaGFuZ2UoaXRlbTogRmlsdGVyTWVudUNvbm5lY3Rvckl0ZW0pOiB2b2lkIHtcbiAgICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IHRoaXMuc2VsZWN0ZWRDb25uZWN0b3JJdGVtPy52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZENvbm5lY3Rvckl0ZW0gPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZENvbm5lY3Rvckl0ZW0gPSBpdGVtO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRCb29sZWFuRGVzY3JpcHRvcihvcGVyYXRvcjogQm9vbGVhbkZpbHRlck9wZXJhdG9ycyk6IEJvb2xlYW5GaWx0ZXJEZXNjcmlwdG9yIHwgbnVsbCB7XG4gICAgICAgIGlmIChvcGVyYXRvciA9PT0gXCJpc25vdG51bGxcIiB8fCBvcGVyYXRvciA9PT0gXCJpc251bGxcIikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmaWVsZDogdGhpcy5maWVsZCxcbiAgICAgICAgICAgICAgICBvcGVyYXRvcjogb3BlcmF0b3JcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGZpZWxkOiB0aGlzLmZpZWxkLFxuICAgICAgICAgICAgICAgIG9wZXJhdG9yOiBcImVxXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IG9wZXJhdG9yID09PSBcImVxXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldERhdGVEZXNjcmlwdG9yKG9wZXJhdG9yOiBEYXRlRmlsdGVyT3BlcmF0b3JzLCB2YWx1ZTogRGF0ZSB8IG51bGwpOiBEYXRlRmlsdGVyRGVzY3JpcHRvciB8IG51bGwge1xuICAgICAgICBpZiAob3BlcmF0b3IgPT09IFwiaXNub3RudWxsXCIgfHwgb3BlcmF0b3IgPT09IFwiaXNudWxsXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZmllbGQ6IHRoaXMuZmllbGQsXG4gICAgICAgICAgICAgICAgb3BlcmF0b3I6IG9wZXJhdG9yXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZmllbGQ6IHRoaXMuZmllbGQsXG4gICAgICAgICAgICAgICAgb3BlcmF0b3I6IG9wZXJhdG9yLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE51bWJlckRlc2NyaXB0b3IoXG4gICAgICAgIG9wZXJhdG9yOiBOdW1lcmljRmlsdGVyT3BlcmF0b3JzLFxuICAgICAgICB2YWx1ZTogbnVtYmVyIHwgbnVsbFxuICAgICk6IE51bWVyaWNGaWx0ZXJEZXNjcmlwdG9yIHwgbnVsbCB7XG4gICAgICAgIGlmIChvcGVyYXRvciA9PT0gXCJpc25vdG51bGxcIiB8fCBvcGVyYXRvciA9PT0gXCJpc251bGxcIikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmaWVsZDogdGhpcy5maWVsZCxcbiAgICAgICAgICAgICAgICBvcGVyYXRvcjogb3BlcmF0b3JcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBmaWVsZDogdGhpcy5maWVsZCxcbiAgICAgICAgICAgICAgICBvcGVyYXRvcjogb3BlcmF0b3IsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U3RyaW5nRGVzY3JpcHRvcihvcGVyYXRvcjogU3RyaW5nRmlsdGVyT3BlcmF0b3JzLCB2YWx1ZTogc3RyaW5nKTogU3RyaW5nRmlsdGVyRGVzY3JpcHRvciB8IG51bGwge1xuICAgICAgICBpZiAob3BlcmF0b3IgPT09IFwiaXNub3RudWxsXCIgfHwgb3BlcmF0b3IgPT09IFwiaXNudWxsXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZmllbGQ6IHRoaXMuZmllbGQsXG4gICAgICAgICAgICAgICAgb3BlcmF0b3I6IG9wZXJhdG9yXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdG9yID09PSBcImlzZW1wdHlcIiB8fCBvcGVyYXRvciA9PT0gXCJpc25vdGVtcHR5XCIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZmllbGQ6IHRoaXMuZmllbGQsXG4gICAgICAgICAgICAgICAgb3BlcmF0b3I6IG9wZXJhdG9yXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdG9yID09PSBcImlzbnVsbG9yZW1wdHlcIiB8fCBvcGVyYXRvciA9PT0gXCJpc25vdG51bGxvcmVtcHR5XCIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZmllbGQ6IHRoaXMuZmllbGQsXG4gICAgICAgICAgICAgICAgb3BlcmF0b3I6IG9wZXJhdG9yXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZmllbGQ6IHRoaXMuZmllbGQsXG4gICAgICAgICAgICAgICAgb3BlcmF0b3I6IG9wZXJhdG9yLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25GaWx0ZXJBcHBseSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUxID0gdGhpcy5zdHJpbmdGaWx0ZXJWYWx1ZXNbMF07XG4gICAgICAgICAgICBjb25zdCB2YWx1ZTIgPSB0aGlzLnN0cmluZ0ZpbHRlclZhbHVlc1sxXTtcbiAgICAgICAgICAgIGNvbnN0IG9wZXJhdG9yMSA9IHRoaXMuc2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0WzBdPy52YWx1ZSBhcyBTdHJpbmdGaWx0ZXJPcGVyYXRvcnM7XG4gICAgICAgICAgICBjb25zdCBvcGVyYXRvcjIgPSB0aGlzLnNlbGVjdGVkRmlsdGVyTWVudURhdGFJdGVtTGlzdFsxXT8udmFsdWUgYXMgU3RyaW5nRmlsdGVyT3BlcmF0b3JzO1xuICAgICAgICAgICAgY29uc3Qgc3RyaW5nRGVzY3JpcHRvcnM6IFN0cmluZ0ZpbHRlckRlc2NyaXB0b3JbXSA9IFtdO1xuXG4gICAgICAgICAgICBjb25zdCBkZXNjcmlwdG9yMSA9IHRoaXMuZ2V0U3RyaW5nRGVzY3JpcHRvcihvcGVyYXRvcjEsIHZhbHVlMSk7XG4gICAgICAgICAgICBpZiAoZGVzY3JpcHRvcjEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHN0cmluZ0Rlc2NyaXB0b3JzLnB1c2goZGVzY3JpcHRvcjEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZENvbm5lY3Rvckl0ZW0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdG9yMiA9IHRoaXMuZ2V0U3RyaW5nRGVzY3JpcHRvcihvcGVyYXRvcjIsIHZhbHVlMik7XG4gICAgICAgICAgICAgICAgaWYgKGRlc2NyaXB0b3IyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nRGVzY3JpcHRvcnMucHVzaChkZXNjcmlwdG9yMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBkZXNjcmlwdG9yOiBDb21wb3NpdGVGaWx0ZXJEZXNjcmlwdG9yID0ge1xuICAgICAgICAgICAgICAgIGxvZ2ljOiB0aGlzLnNlbGVjdGVkQ29ubmVjdG9ySXRlbT8udmFsdWUgPz8gXCJhbmRcIixcbiAgICAgICAgICAgICAgICBmaWx0ZXJzOiBzdHJpbmdEZXNjcmlwdG9yc1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5hcHBseS5lbWl0KGRlc2NyaXB0b3IpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUxID0gdGhpcy5udW1iZXJGaWx0ZXJWYWx1ZXNbMF07XG4gICAgICAgICAgICBjb25zdCB2YWx1ZTIgPSB0aGlzLm51bWJlckZpbHRlclZhbHVlc1sxXTtcbiAgICAgICAgICAgIGNvbnN0IG9wZXJhdG9yMSA9IHRoaXMuc2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0WzBdPy52YWx1ZSBhcyBOdW1lcmljRmlsdGVyT3BlcmF0b3JzO1xuICAgICAgICAgICAgY29uc3Qgb3BlcmF0b3IyID0gdGhpcy5zZWxlY3RlZEZpbHRlck1lbnVEYXRhSXRlbUxpc3RbMV0/LnZhbHVlIGFzIE51bWVyaWNGaWx0ZXJPcGVyYXRvcnM7XG4gICAgICAgICAgICBjb25zdCBudW1iZXJEZXNjcmlwdG9yczogTnVtZXJpY0ZpbHRlckRlc2NyaXB0b3JbXSA9IFtdO1xuXG4gICAgICAgICAgICBjb25zdCBkZXNjcmlwdG9yMSA9IHRoaXMuZ2V0TnVtYmVyRGVzY3JpcHRvcihvcGVyYXRvcjEsIHZhbHVlMSk7XG4gICAgICAgICAgICBpZiAoZGVzY3JpcHRvcjEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG51bWJlckRlc2NyaXB0b3JzLnB1c2goZGVzY3JpcHRvcjEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZENvbm5lY3Rvckl0ZW0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdG9yMiA9IHRoaXMuZ2V0TnVtYmVyRGVzY3JpcHRvcihvcGVyYXRvcjIsIHZhbHVlMik7XG4gICAgICAgICAgICAgICAgaWYgKGRlc2NyaXB0b3IyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyRGVzY3JpcHRvcnMucHVzaChkZXNjcmlwdG9yMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBkZXNjcmlwdG9yOiBDb21wb3NpdGVGaWx0ZXJEZXNjcmlwdG9yID0ge1xuICAgICAgICAgICAgICAgIGxvZ2ljOiB0aGlzLnNlbGVjdGVkQ29ubmVjdG9ySXRlbT8udmFsdWUgPz8gXCJhbmRcIixcbiAgICAgICAgICAgICAgICBmaWx0ZXJzOiBudW1iZXJEZXNjcmlwdG9yc1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5hcHBseS5lbWl0KGRlc2NyaXB0b3IpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gXCJkYXRlXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlMSA9IHRoaXMuZGF0ZUZpbHRlclZhbHVlc1swXTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlMiA9IHRoaXMuZGF0ZUZpbHRlclZhbHVlc1sxXTtcbiAgICAgICAgICAgIGNvbnN0IG9wZXJhdG9yMSA9IHRoaXMuc2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0WzBdPy52YWx1ZSBhcyBEYXRlRmlsdGVyT3BlcmF0b3JzO1xuICAgICAgICAgICAgY29uc3Qgb3BlcmF0b3IyID0gdGhpcy5zZWxlY3RlZEZpbHRlck1lbnVEYXRhSXRlbUxpc3RbMV0/LnZhbHVlIGFzIERhdGVGaWx0ZXJPcGVyYXRvcnM7XG4gICAgICAgICAgICBjb25zdCBkYXRlRGVzY3JpcHRvcnM6IERhdGVGaWx0ZXJEZXNjcmlwdG9yW10gPSBbXTtcblxuICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRvcjEgPSB0aGlzLmdldERhdGVEZXNjcmlwdG9yKG9wZXJhdG9yMSwgdmFsdWUxKTtcbiAgICAgICAgICAgIGlmIChkZXNjcmlwdG9yMSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0ZURlc2NyaXB0b3JzLnB1c2goZGVzY3JpcHRvcjEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZENvbm5lY3Rvckl0ZW0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdG9yMiA9IHRoaXMuZ2V0RGF0ZURlc2NyaXB0b3Iob3BlcmF0b3IyLCB2YWx1ZTIpO1xuICAgICAgICAgICAgICAgIGlmIChkZXNjcmlwdG9yMiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGVEZXNjcmlwdG9ycy5wdXNoKGRlc2NyaXB0b3IyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0b3I6IENvbXBvc2l0ZUZpbHRlckRlc2NyaXB0b3IgPSB7XG4gICAgICAgICAgICAgICAgbG9naWM6IHRoaXMuc2VsZWN0ZWRDb25uZWN0b3JJdGVtPy52YWx1ZSA/PyBcImFuZFwiLFxuICAgICAgICAgICAgICAgIGZpbHRlcnM6IGRhdGVEZXNjcmlwdG9yc1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5hcHBseS5lbWl0KGRlc2NyaXB0b3IpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IG9wZXJhdG9yMSA9IHRoaXMuc2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0WzBdPy52YWx1ZSBhcyBCb29sZWFuRmlsdGVyT3BlcmF0b3JzO1xuICAgICAgICAgICAgY29uc3Qgb3BlcmF0b3IyID0gdGhpcy5zZWxlY3RlZEZpbHRlck1lbnVEYXRhSXRlbUxpc3RbMV0/LnZhbHVlIGFzIEJvb2xlYW5GaWx0ZXJPcGVyYXRvcnM7XG4gICAgICAgICAgICBjb25zdCBib29sZWFuRGVzY3JpcHRvcnM6IEJvb2xlYW5GaWx0ZXJEZXNjcmlwdG9yW10gPSBbXTtcblxuICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRvcjEgPSB0aGlzLmdldEJvb2xlYW5EZXNjcmlwdG9yKG9wZXJhdG9yMSk7XG4gICAgICAgICAgICBpZiAoZGVzY3JpcHRvcjEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGJvb2xlYW5EZXNjcmlwdG9ycy5wdXNoKGRlc2NyaXB0b3IxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRDb25uZWN0b3JJdGVtKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRvcjIgPSB0aGlzLmdldEJvb2xlYW5EZXNjcmlwdG9yKG9wZXJhdG9yMik7XG4gICAgICAgICAgICAgICAgaWYgKGRlc2NyaXB0b3IyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgYm9vbGVhbkRlc2NyaXB0b3JzLnB1c2goZGVzY3JpcHRvcjIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRvcjogQ29tcG9zaXRlRmlsdGVyRGVzY3JpcHRvciA9IHtcbiAgICAgICAgICAgICAgICBsb2dpYzogdGhpcy5zZWxlY3RlZENvbm5lY3Rvckl0ZW0/LnZhbHVlID8/IFwiYW5kXCIsXG4gICAgICAgICAgICAgICAgZmlsdGVyczogYm9vbGVhbkRlc2NyaXB0b3JzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmFwcGx5LmVtaXQoZGVzY3JpcHRvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZpbHRlciB0eXBlIG5vdCBzdXBwb3J0ZWQgeWV0LlwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvbkZpbHRlckNsZWFyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm51bWJlckZpbHRlclZhbHVlcyA9IFtudWxsLCBudWxsXTtcbiAgICAgICAgdGhpcy5zdHJpbmdGaWx0ZXJWYWx1ZXMgPSBbXCJcIiwgXCJcIl07XG4gICAgICAgIHRoaXMuZGF0ZUZpbHRlclZhbHVlcyA9IFtudWxsLCBudWxsXTtcbiAgICAgICAgdGhpcy5ib29sZWFuRmlsdGVyVmFsdWVzID0gW251bGwsIG51bGxdO1xuICAgICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyTWVudURhdGFJdGVtTGlzdCA9IFt1bmRlZmluZWQsIHVuZGVmaW5lZF07XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRDb25uZWN0b3JJdGVtID0gbnVsbDtcbiAgICAgICAgdGhpcy5hcHBseS5lbWl0KHtcbiAgICAgICAgICAgIGxvZ2ljOiBcImFuZFwiLFxuICAgICAgICAgICAgZmlsdGVyczogW11cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uRmlsdGVyT3BlcmF0b3JDaGFuZ2UoaW5kZXg6IG51bWJlciwgaXRlbTogRmlsdGVyTWVudURhdGFJdGVtKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0W2luZGV4XSA9IGl0ZW07XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBmaXJzdEZpbHRlclZhbGlkKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBvcGVyYXRvciA9IHRoaXMuc2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0WzBdPy52YWx1ZTtcbiAgICAgICAgaWYgKCFvcGVyYXRvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcGVyYXRvciA9PT0gXCJpc251bGxcIiB8fCBvcGVyYXRvciA9PT0gXCJpc25vdG51bGxcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yID09PSBcImlzZW1wdHlcIiB8fFxuICAgICAgICAgICAgICAgICAgICBvcGVyYXRvciA9PT0gXCJpc25vdGVtcHR5XCIgfHxcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0b3IgPT09IFwiaXNudWxsb3JlbXB0eVwiIHx8XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yID09PSBcImlzbm90bnVsbG9yZW1wdHlcIlxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RyaW5nRmlsdGVyVmFsdWVzWzBdICE9PSBcIlwiO1xuICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm51bWJlckZpbHRlclZhbHVlc1swXSAhPT0gbnVsbDtcbiAgICAgICAgICAgIGNhc2UgXCJkYXRlXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZUZpbHRlclZhbHVlc1swXSAhPT0gbnVsbDtcbiAgICAgICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgc2Vjb25kRmlsdGVyVmFsaWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gdGhpcy5zZWxlY3RlZEZpbHRlck1lbnVEYXRhSXRlbUxpc3RbMV0/LnZhbHVlO1xuICAgICAgICBpZiAoIW9wZXJhdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wZXJhdG9yID09PSBcImlzbnVsbFwiIHx8IG9wZXJhdG9yID09PSBcImlzbm90bnVsbFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0b3IgPT09IFwiaXNlbXB0eVwiIHx8XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yID09PSBcImlzbm90ZW1wdHlcIiB8fFxuICAgICAgICAgICAgICAgICAgICBvcGVyYXRvciA9PT0gXCJpc251bGxvcmVtcHR5XCIgfHxcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0b3IgPT09IFwiaXNub3RudWxsb3JlbXB0eVwiXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdHJpbmdGaWx0ZXJWYWx1ZXNbMV0gIT09IFwiXCI7XG4gICAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubnVtYmVyRmlsdGVyVmFsdWVzWzFdICE9PSBudWxsO1xuICAgICAgICAgICAgY2FzZSBcImRhdGVcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRlRmlsdGVyVmFsdWVzWzFdICE9PSBudWxsO1xuICAgICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldEZpbHRlclZhbHVlcygpOiBGaWx0ZXJNZW51VmFsdWUge1xuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yMTogdGhpcy5zZWxlY3RlZEZpbHRlck1lbnVEYXRhSXRlbUxpc3RbMF0/LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTE6IHRoaXMuc3RyaW5nRmlsdGVyVmFsdWVzWzBdLFxuICAgICAgICAgICAgICAgICAgICBsb2dpYzogdGhpcy5zZWxlY3RlZENvbm5lY3Rvckl0ZW0/LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBvcGVyYXRvcjI6IHRoaXMuc2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0WzFdPy52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUyOiB0aGlzLnN0cmluZ0ZpbHRlclZhbHVlc1sxXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0b3IxOiB0aGlzLnNlbGVjdGVkRmlsdGVyTWVudURhdGFJdGVtTGlzdFswXT8udmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlMTogdGhpcy5udW1iZXJGaWx0ZXJWYWx1ZXNbMF0sXG4gICAgICAgICAgICAgICAgICAgIGxvZ2ljOiB0aGlzLnNlbGVjdGVkQ29ubmVjdG9ySXRlbT8udmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yMjogdGhpcy5zZWxlY3RlZEZpbHRlck1lbnVEYXRhSXRlbUxpc3RbMV0/LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTI6IHRoaXMubnVtYmVyRmlsdGVyVmFsdWVzWzFdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNhc2UgXCJkYXRlXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0b3IxOiB0aGlzLnNlbGVjdGVkRmlsdGVyTWVudURhdGFJdGVtTGlzdFswXT8udmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlMTogdGhpcy5kYXRlRmlsdGVyVmFsdWVzWzBdLFxuICAgICAgICAgICAgICAgICAgICBsb2dpYzogdGhpcy5zZWxlY3RlZENvbm5lY3Rvckl0ZW0/LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBvcGVyYXRvcjI6IHRoaXMuc2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0WzFdPy52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUyOiB0aGlzLmRhdGVGaWx0ZXJWYWx1ZXNbMV1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBvcGVyYXRvcjE6IHRoaXMuc2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0WzBdPy52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUxOiB0aGlzLmJvb2xlYW5GaWx0ZXJWYWx1ZXNbMF0sXG4gICAgICAgICAgICAgICAgICAgIGxvZ2ljOiB0aGlzLnNlbGVjdGVkQ29ubmVjdG9ySXRlbT8udmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yMjogdGhpcy5zZWxlY3RlZEZpbHRlck1lbnVEYXRhSXRlbUxpc3RbMV0/LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTI6IHRoaXMuYm9vbGVhbkZpbHRlclZhbHVlc1sxXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yMTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTE6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGxvZ2ljOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yMjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTI6IG51bGxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRGaWx0ZXJWYWx1ZXModmFsdWVzOiBGaWx0ZXJNZW51VmFsdWUpOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyTWVudURhdGFJdGVtTGlzdCA9IFtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJpbmdGaWx0ZXJNZW51RGF0YUl0ZW1zLmZpbmQoZiA9PiBmLnZhbHVlID09PSB2YWx1ZXMub3BlcmF0b3IxKSA/PyB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RyaW5nRmlsdGVyTWVudURhdGFJdGVtcy5maW5kKGYgPT4gZi52YWx1ZSA9PT0gdmFsdWVzLm9wZXJhdG9yMikgPz8gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0cmluZ0ZpbHRlclZhbHVlcyA9IFt2YWx1ZXMudmFsdWUxID8/IFwiXCIsIHZhbHVlcy52YWx1ZTIgPz8gXCJcIl07XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZENvbm5lY3Rvckl0ZW0gPSB0aGlzLmNvbm5lY3RvckRhdGFJdGVtcy5maW5kKGMgPT4gYy52YWx1ZSA9PT0gdmFsdWVzLmxvZ2ljKSA/PyBudWxsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0ID0gW1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm51bWVyaWNGaWx0ZXJNZW51RGF0YUl0ZW1zLmZpbmQoZiA9PiBmLnZhbHVlID09PSB2YWx1ZXMub3BlcmF0b3IxKSA/PyB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubnVtZXJpY0ZpbHRlck1lbnVEYXRhSXRlbXMuZmluZChmID0+IGYudmFsdWUgPT09IHZhbHVlcy5vcGVyYXRvcjIpID8/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgdGhpcy5udW1iZXJGaWx0ZXJWYWx1ZXMgPSBbdmFsdWVzLnZhbHVlMSA/PyBudWxsLCB2YWx1ZXMudmFsdWUyID8/IG51bGxdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImRhdGVcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyTWVudURhdGFJdGVtTGlzdCA9IFtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRlRmlsdGVyTWVudURhdGFJdGVtcy5maW5kKGYgPT4gZi52YWx1ZSA9PT0gdmFsdWVzLm9wZXJhdG9yMSkgPz8gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVGaWx0ZXJNZW51RGF0YUl0ZW1zLmZpbmQoZiA9PiBmLnZhbHVlID09PSB2YWx1ZXMub3BlcmF0b3IyKSA/PyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZUZpbHRlclZhbHVlcyA9IFt2YWx1ZXMudmFsdWUxID8/IG51bGwsIHZhbHVlcy52YWx1ZTIgPz8gbnVsbF07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0ID0gW1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvb2xlYW5GaWx0ZXJNZW51RGF0YUl0ZW1zLmZpbmQoZiA9PiBmLnZhbHVlID09PSB2YWx1ZXMub3BlcmF0b3IxKSA/PyB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9vbGVhbkZpbHRlck1lbnVEYXRhSXRlbXMuZmluZChmID0+IGYudmFsdWUgPT09IHZhbHVlcy5vcGVyYXRvcjIpID8/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgdGhpcy5ib29sZWFuRmlsdGVyVmFsdWVzID0gW3ZhbHVlcy52YWx1ZTEgPz8gbnVsbCwgdmFsdWVzLnZhbHVlMiA/PyBudWxsXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWxlY3RlZENvbm5lY3Rvckl0ZW0gPSB0aGlzLmNvbm5lY3RvckRhdGFJdGVtcy5maW5kKGMgPT4gYy52YWx1ZSA9PT0gdmFsdWVzLmxvZ2ljKSA/PyBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgYXBwbHlEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmZpcnN0RmlsdGVyVmFsaWQgfHwgKCEhdGhpcy5zZWxlY3RlZENvbm5lY3Rvckl0ZW0gJiYgIXRoaXMuc2Vjb25kRmlsdGVyVmFsaWQpO1xuICAgIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtb25hLWZpbHRlci1tZW51XCI+XG4gICAgPGRpdiBjbGFzcz1cIm1vbmEtZmlsdGVyLW1lbnUtaXRlbVwiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwidHlwZT09PSdzdHJpbmcnXCI+XG4gICAgICAgICAgICA8bW9uYS1kcm9wLWRvd24tbGlzdCBbZGF0YV09XCJzdHJpbmdGaWx0ZXJNZW51RGF0YUl0ZW1zfG9wZXJhdG9yRmlsdGVyOm9wZXJhdG9yc1wiIHRleHRGaWVsZD1cInRleHRcIiB2YWx1ZUZpZWxkPVwidmFsdWVcIiBbdmFsdWVdPVwic2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0WzBdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2YWx1ZUNoYW5nZSk9XCJvbkZpbHRlck9wZXJhdG9yQ2hhbmdlKDAsICRldmVudClcIj48L21vbmEtZHJvcC1kb3duLWxpc3Q+XG4gICAgICAgICAgICA8bW9uYS10ZXh0LWJveCBbKG5nTW9kZWwpXT1cInN0cmluZ0ZpbHRlclZhbHVlc1swXVwiIFtkaXNhYmxlZF09XCJzZWxlY3RlZEZpbHRlck1lbnVEYXRhSXRlbUxpc3RbMF0/LnZhbHVlfHZhbHVlbGVzc09wZXJhdG9yXCI+PC9tb25hLXRleHQtYm94PlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cblxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwidHlwZT09PSdudW1iZXInXCI+XG4gICAgICAgICAgICA8bW9uYS1kcm9wLWRvd24tbGlzdCBbZGF0YV09XCJudW1lcmljRmlsdGVyTWVudURhdGFJdGVtc3xvcGVyYXRvckZpbHRlcjpvcGVyYXRvcnNcIiB0ZXh0RmllbGQ9XCJ0ZXh0XCIgdmFsdWVGaWVsZD1cInZhbHVlXCIgW3ZhbHVlXT1cInNlbGVjdGVkRmlsdGVyTWVudURhdGFJdGVtTGlzdFswXVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsdWVDaGFuZ2UpPVwib25GaWx0ZXJPcGVyYXRvckNoYW5nZSgwLCAkZXZlbnQpXCI+PC9tb25hLWRyb3AtZG93bi1saXN0PlxuICAgICAgICAgICAgPG1vbmEtbnVtZXJpYy10ZXh0LWJveCBbKG5nTW9kZWwpXT1cIm51bWJlckZpbHRlclZhbHVlc1swXVwiIFtkaXNhYmxlZF09XCJzZWxlY3RlZEZpbHRlck1lbnVEYXRhSXRlbUxpc3RbMF0/LnZhbHVlfHZhbHVlbGVzc09wZXJhdG9yXCI+PC9tb25hLW51bWVyaWMtdGV4dC1ib3g+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJ0eXBlPT09J2RhdGUnXCI+XG4gICAgICAgICAgICA8bW9uYS1kcm9wLWRvd24tbGlzdCBbZGF0YV09XCJkYXRlRmlsdGVyTWVudURhdGFJdGVtc3xvcGVyYXRvckZpbHRlcjpvcGVyYXRvcnNcIiB0ZXh0RmllbGQ9XCJ0ZXh0XCIgdmFsdWVGaWVsZD1cInZhbHVlXCIgW3ZhbHVlXT1cInNlbGVjdGVkRmlsdGVyTWVudURhdGFJdGVtTGlzdFswXVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsdWVDaGFuZ2UpPVwib25GaWx0ZXJPcGVyYXRvckNoYW5nZSgwLCAkZXZlbnQpXCI+PC9tb25hLWRyb3AtZG93bi1saXN0PlxuXG4gICAgICAgICAgICA8bW9uYS1kYXRlLXBpY2tlciBbKHZhbHVlKV09XCJkYXRlRmlsdGVyVmFsdWVzWzBdXCIgW2Zvcm1hdF09XCJkYXRlT3B0aW9ucy5mb3JtYXRcIiAqbmdJZj1cImRhdGVPcHRpb25zLnR5cGU9PT0nZGF0ZSdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cInNlbGVjdGVkRmlsdGVyTWVudURhdGFJdGVtTGlzdFswXT8udmFsdWV8dmFsdWVsZXNzT3BlcmF0b3JcIj48L21vbmEtZGF0ZS1waWNrZXI+XG5cbiAgICAgICAgICAgIDxtb25hLWRhdGUtdGltZS1waWNrZXIgWyh2YWx1ZSldPVwiZGF0ZUZpbHRlclZhbHVlc1swXVwiIFtmb3JtYXRdPVwiZGF0ZU9wdGlvbnMuZm9ybWF0XCIgKm5nSWY9XCJkYXRlT3B0aW9ucy50eXBlPT09J2RhdGV0aW1lJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJzZWxlY3RlZEZpbHRlck1lbnVEYXRhSXRlbUxpc3RbMF0/LnZhbHVlfHZhbHVlbGVzc09wZXJhdG9yXCI+PC9tb25hLWRhdGUtdGltZS1waWNrZXI+XG5cbiAgICAgICAgICAgIDxtb25hLXRpbWUtcGlja2VyIFsodmFsdWUpXT1cImRhdGVGaWx0ZXJWYWx1ZXNbMF1cIiBbZm9ybWF0XT1cImRhdGVPcHRpb25zLmZvcm1hdFwiICpuZ0lmPVwiZGF0ZU9wdGlvbnMudHlwZT09PSd0aW1lJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwic2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0WzBdPy52YWx1ZXx2YWx1ZWxlc3NPcGVyYXRvclwiPjwvbW9uYS10aW1lLXBpY2tlcj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInR5cGU9PT0nYm9vbGVhbidcIj5cbiAgICAgICAgICAgIDxtb25hLWRyb3AtZG93bi1saXN0IFtkYXRhXT1cImJvb2xlYW5GaWx0ZXJNZW51RGF0YUl0ZW1zfG9wZXJhdG9yRmlsdGVyOm9wZXJhdG9yc1wiIHRleHRGaWVsZD1cInRleHRcIiB2YWx1ZUZpZWxkPVwidmFsdWVcIiBbdmFsdWVdPVwic2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0WzBdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2YWx1ZUNoYW5nZSk9XCJvbkZpbHRlck9wZXJhdG9yQ2hhbmdlKDAsICRldmVudClcIj48L21vbmEtZHJvcC1kb3duLWxpc3Q+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1vbmEtZmlsdGVyLW1lbnUtaXRlbVwiICpuZ0lmPVwiZmlyc3RGaWx0ZXJWYWxpZFwiPlxuICAgICAgICA8bW9uYS1idXR0b24tZ3JvdXAgc2VsZWN0aW9uPVwic2luZ2xlXCIgW2Rpc2FibGVkXT1cIiFmaXJzdEZpbHRlclZhbGlkXCI+XG4gICAgICAgICAgICA8YnV0dG9uIG1vbmFCdXR0b24gW3NlbGVjdGVkXT1cIml0ZW0udmFsdWUgPT09IHNlbGVjdGVkQ29ubmVjdG9ySXRlbT8udmFsdWVcIiAoY2xpY2spPVwib25Db25uZWN0b3JDaGFuZ2UoaXRlbSlcIiAqbmdGb3I9XCJsZXQgaXRlbSBvZiBjb25uZWN0b3JEYXRhSXRlbXNcIj57e2l0ZW0udGV4dH19PC9idXR0b24+XG4gICAgICAgIDwvbW9uYS1idXR0b24tZ3JvdXA+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1vbmEtZmlsdGVyLW1lbnUtaXRlbVwiICpuZ0lmPVwiISFzZWxlY3RlZENvbm5lY3Rvckl0ZW1cIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInR5cGU9PT0nc3RyaW5nJ1wiPlxuICAgICAgICAgICAgPG1vbmEtZHJvcC1kb3duLWxpc3QgW2RhdGFdPVwic3RyaW5nRmlsdGVyTWVudURhdGFJdGVtc3xvcGVyYXRvckZpbHRlcjpvcGVyYXRvcnNcIiB0ZXh0RmllbGQ9XCJ0ZXh0XCIgdmFsdWVGaWVsZD1cInZhbHVlXCIgW3ZhbHVlXT1cInNlbGVjdGVkRmlsdGVyTWVudURhdGFJdGVtTGlzdFsxXVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsdWVDaGFuZ2UpPVwib25GaWx0ZXJPcGVyYXRvckNoYW5nZSgxLCAkZXZlbnQpXCI+PC9tb25hLWRyb3AtZG93bi1saXN0PlxuICAgICAgICAgICAgPG1vbmEtdGV4dC1ib3ggWyhuZ01vZGVsKV09XCJzdHJpbmdGaWx0ZXJWYWx1ZXNbMV1cIiBbZGlzYWJsZWRdPVwic2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0WzFdPy52YWx1ZXx2YWx1ZWxlc3NPcGVyYXRvclwiPjwvbW9uYS10ZXh0LWJveD5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInR5cGU9PT0nbnVtYmVyJ1wiPlxuICAgICAgICAgICAgPG1vbmEtZHJvcC1kb3duLWxpc3QgW2RhdGFdPVwibnVtZXJpY0ZpbHRlck1lbnVEYXRhSXRlbXN8b3BlcmF0b3JGaWx0ZXI6b3BlcmF0b3JzXCIgdGV4dEZpZWxkPVwidGV4dFwiIHZhbHVlRmllbGQ9XCJ2YWx1ZVwiIFt2YWx1ZV09XCJzZWxlY3RlZEZpbHRlck1lbnVEYXRhSXRlbUxpc3RbMV1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbHVlQ2hhbmdlKT1cIm9uRmlsdGVyT3BlcmF0b3JDaGFuZ2UoMSwgJGV2ZW50KVwiPjwvbW9uYS1kcm9wLWRvd24tbGlzdD5cblxuICAgICAgICAgICAgPG1vbmEtbnVtZXJpYy10ZXh0LWJveCBbKG5nTW9kZWwpXT1cIm51bWJlckZpbHRlclZhbHVlc1sxXVwiIFtkaXNhYmxlZF09XCJzZWxlY3RlZEZpbHRlck1lbnVEYXRhSXRlbUxpc3RbMF0/LnZhbHVlfHZhbHVlbGVzc09wZXJhdG9yXCI+PC9tb25hLW51bWVyaWMtdGV4dC1ib3g+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJ0eXBlPT09J2RhdGUnXCI+XG4gICAgICAgICAgICA8bW9uYS1kcm9wLWRvd24tbGlzdCBbZGF0YV09XCJkYXRlRmlsdGVyTWVudURhdGFJdGVtc3xvcGVyYXRvckZpbHRlcjpvcGVyYXRvcnNcIiB0ZXh0RmllbGQ9XCJ0ZXh0XCIgdmFsdWVGaWVsZD1cInZhbHVlXCIgW3ZhbHVlXT1cInNlbGVjdGVkRmlsdGVyTWVudURhdGFJdGVtTGlzdFsxXVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsdWVDaGFuZ2UpPVwib25GaWx0ZXJPcGVyYXRvckNoYW5nZSgxLCAkZXZlbnQpXCI+PC9tb25hLWRyb3AtZG93bi1saXN0PlxuXG4gICAgICAgICAgICA8bW9uYS1kYXRlLXBpY2tlciBbKHZhbHVlKV09XCJkYXRlRmlsdGVyVmFsdWVzWzFdXCIgW2Zvcm1hdF09XCJkYXRlT3B0aW9ucy5mb3JtYXRcIiAqbmdJZj1cImRhdGVPcHRpb25zLnR5cGU9PT0nZGF0ZSdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cInNlbGVjdGVkRmlsdGVyTWVudURhdGFJdGVtTGlzdFsxXT8udmFsdWV8dmFsdWVsZXNzT3BlcmF0b3JcIj48L21vbmEtZGF0ZS1waWNrZXI+XG5cbiAgICAgICAgICAgIDxtb25hLWRhdGUtdGltZS1waWNrZXIgWyh2YWx1ZSldPVwiZGF0ZUZpbHRlclZhbHVlc1sxXVwiIFtmb3JtYXRdPVwiZGF0ZU9wdGlvbnMuZm9ybWF0XCIgKm5nSWY9XCJkYXRlT3B0aW9ucy50eXBlPT09J2RhdGV0aW1lJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJzZWxlY3RlZEZpbHRlck1lbnVEYXRhSXRlbUxpc3RbMV0/LnZhbHVlfHZhbHVlbGVzc09wZXJhdG9yXCI+PC9tb25hLWRhdGUtdGltZS1waWNrZXI+XG5cbiAgICAgICAgICAgIDxtb25hLXRpbWUtcGlja2VyIFsodmFsdWUpXT1cImRhdGVGaWx0ZXJWYWx1ZXNbMV1cIiBbZm9ybWF0XT1cImRhdGVPcHRpb25zLmZvcm1hdFwiICpuZ0lmPVwiZGF0ZU9wdGlvbnMudHlwZT09PSd0aW1lJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwic2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0WzFdPy52YWx1ZXx2YWx1ZWxlc3NPcGVyYXRvclwiPjwvbW9uYS10aW1lLXBpY2tlcj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInR5cGU9PT0nYm9vbGVhbidcIj5cbiAgICAgICAgICAgIDxtb25hLWRyb3AtZG93bi1saXN0IFtkYXRhXT1cImJvb2xlYW5GaWx0ZXJNZW51RGF0YUl0ZW1zfG9wZXJhdG9yRmlsdGVyOm9wZXJhdG9yc1wiIHRleHRGaWVsZD1cInRleHRcIiB2YWx1ZUZpZWxkPVwidmFsdWVcIiBbdmFsdWVdPVwic2VsZWN0ZWRGaWx0ZXJNZW51RGF0YUl0ZW1MaXN0WzFdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2YWx1ZUNoYW5nZSk9XCJvbkZpbHRlck9wZXJhdG9yQ2hhbmdlKDEsICRldmVudClcIj48L21vbmEtZHJvcC1kb3duLWxpc3Q+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1vbmEtZmlsdGVyLW1lbnUtaXRlbSBtb25hLWZpbHRlci1tZW51LWFjdGlvbnNcIj5cbiAgICAgICAgPGJ1dHRvbiBtb25hQnV0dG9uIChjbGljayk9XCJvbkZpbHRlckFwcGx5KClcIiBbZGlzYWJsZWRdPVwiYXBwbHlEaXNhYmxlZFwiPkFwcGx5PC9idXR0b24+XG4gICAgICAgIDxidXR0b24gbW9uYUJ1dHRvbiAoY2xpY2spPVwib25GaWx0ZXJDbGVhcigpXCI+Q2xlYXI8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuIl19