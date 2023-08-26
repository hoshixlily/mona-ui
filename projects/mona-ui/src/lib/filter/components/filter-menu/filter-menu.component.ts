import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonGroupComponent } from "../../../buttons/modules/button-group/components/button-group/button-group.component";
import { ButtonDirective } from "../../../buttons/modules/button/directives/button.directive";
import { DatePickerComponent } from "../../../date-inputs/modules/date-picker/components/date-picker/date-picker.component";
import { DateTimePickerComponent } from "../../../date-inputs/modules/date-time-picker/components/date-time-picker/date-time-picker.component";
import { TimePickerComponent } from "../../../date-inputs/modules/time-picker/components/time-picker/time-picker.component";
import { DropDownListComponent } from "../../../dropdowns/modules/drop-down-list/components/drop-down-list/drop-down-list.component";
import { NumericTextBoxComponent } from "../../../inputs/modules/numeric-text-box/components/numeric-text-box/numeric-text-box.component";
import { TextBoxComponent } from "../../../inputs/modules/text-box/components/text-box/text-box.component";
import { DataType } from "../../../models/DataType";
import {
    BooleanFilterDescriptor,
    BooleanFilterOperators,
    CompositeFilterDescriptor,
    DateFilterDescriptor,
    DateFilterOperators,
    FilterOperators,
    NumericFilterDescriptor,
    NumericFilterOperators,
    StringFilterDescriptor,
    StringFilterOperators
} from "../../../query/filter/FilterDescriptor";
import { FilterMenuConnectorItem } from "../../models/FilterMenuConnectorItem";
import { FilterMenuDataItem } from "../../models/FilterMenuDataItem";
import { FilterMenuValue } from "../../models/FilterMenuValue";
import { OperatorFilterPipe } from "../../pipes/operator-filter.pipe";
import { ValuelessOperatorPipe } from "../../pipes/valueless-operator.pipe";

@Component({
    selector: "mona-filter-menu",
    templateUrl: "./filter-menu.component.html",
    styleUrls: ["./filter-menu.component.scss"],
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: true,
    imports: [
        NgIf,
        DropDownListComponent,
        FormsModule,
        TextBoxComponent,
        NumericTextBoxComponent,
        DatePickerComponent,
        DateTimePickerComponent,
        TimePickerComponent,
        ButtonGroupComponent,
        NgFor,
        ButtonDirective,
        ValuelessOperatorPipe,
        OperatorFilterPipe
    ]
})
export class FilterMenuComponent implements OnInit {
    private booleanFilterValues: [boolean | null, boolean | null] = [null, null];
    public readonly booleanFilterMenuDataItems: FilterMenuDataItem[] = [
        { text: "Is true", value: "eq" },
        { text: "Is false", value: "neq" },
        { text: "Is null", value: "isnull" },
        { text: "Is not null", value: "isnotnull" }
    ];

    public readonly connectorDataItems: FilterMenuConnectorItem[] = [
        { text: "AND", value: "and" },
        { text: "OR", value: "or" }
    ];

    public readonly dateFilterMenuDataItems: FilterMenuDataItem[] = [
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
    public readonly numericFilterMenuDataItems: FilterMenuDataItem[] = [
        { text: "Is equal to", value: "eq" },
        { text: "Is not equal to", value: "neq" },
        { text: "Is greater than", value: "gt" },
        { text: "Is greater than or equal to", value: "gte" },
        { text: "Is less than", value: "lt" },
        { text: "Is less than or equal to", value: "lte" },
        { text: "Is null", value: "isnull" },
        { text: "Is not null", value: "isnotnull" }
    ];

    public readonly stringFilterMenuDataItems: FilterMenuDataItem[] = [
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

    public dateFilterValues: [Date | null, Date | null] = [null, null];
    public numberFilterValues: [number | null, number | null] = [null, null];
    public selectedConnectorItem: FilterMenuConnectorItem | null = null;
    public selectedFilterMenuDataItemList: Array<FilterMenuDataItem | undefined> = [undefined, undefined];
    public stringFilterValues: [string, string] = ["", ""];

    @Output()
    public apply: EventEmitter<CompositeFilterDescriptor> = new EventEmitter<CompositeFilterDescriptor>();

    @Input()
    public dateOptions: { format: string; type: "date" | "time" | "datetime" } = {
        format: "dd/MM/yyyy",
        type: "date"
    };

    @Input()
    public field: string = "";

    @Input()
    public operators: FilterOperators[] = [];

    @Input()
    public set value(value: FilterMenuValue) {
        this.setFilterValues(value);
    }

    public get value(): FilterMenuValue {
        return this.getFilterValues();
    }

    @Input()
    public type: DataType = "string";

    public constructor() {}

    public ngOnInit(): void {}

    public onConnectorChange(item: FilterMenuConnectorItem): void {
        if (item.value === this.selectedConnectorItem?.value) {
            this.selectedConnectorItem = null;
        } else {
            this.selectedConnectorItem = item;
        }
    }

    private getBooleanDescriptor(operator: BooleanFilterOperators): BooleanFilterDescriptor | null {
        if (operator === "isnotnull" || operator === "isnull") {
            return {
                field: this.field,
                operator: operator
            };
        } else {
            return {
                field: this.field,
                operator: "eq",
                value: operator === "eq"
            };
        }
    }

    private getDateDescriptor(operator: DateFilterOperators, value: Date | null): DateFilterDescriptor | null {
        if (operator === "isnotnull" || operator === "isnull") {
            return {
                field: this.field,
                operator: operator
            };
        } else if (value != null) {
            return {
                field: this.field,
                operator: operator,
                value: value
            };
        }
        return null;
    }

    private getNumberDescriptor(
        operator: NumericFilterOperators,
        value: number | null
    ): NumericFilterDescriptor | null {
        if (operator === "isnotnull" || operator === "isnull") {
            return {
                field: this.field,
                operator: operator
            };
        } else if (value != null) {
            return {
                field: this.field,
                operator: operator,
                value: value
            };
        }
        return null;
    }

    private getStringDescriptor(operator: StringFilterOperators, value: string): StringFilterDescriptor | null {
        if (operator === "isnotnull" || operator === "isnull") {
            return {
                field: this.field,
                operator: operator
            };
        } else if (operator === "isempty" || operator === "isnotempty") {
            return {
                field: this.field,
                operator: operator
            };
        } else if (operator === "isnullorempty" || operator === "isnotnullorempty") {
            return {
                field: this.field,
                operator: operator
            };
        } else if (value != null) {
            return {
                field: this.field,
                operator: operator,
                value: value
            };
        }
        return null;
    }

    public onFilterApply(): void {
        if (!this.selectedConnectorItem) {
            this.clearSecondFilterValues();
        }
        if (this.type === "string") {
            const value1 = this.stringFilterValues[0];
            const value2 = this.stringFilterValues[1];
            const operator1 = this.selectedFilterMenuDataItemList[0]?.value as StringFilterOperators;
            const operator2 = this.selectedFilterMenuDataItemList[1]?.value as StringFilterOperators;
            const stringDescriptors: StringFilterDescriptor[] = [];

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

            const descriptor: CompositeFilterDescriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: stringDescriptors
            };

            this.apply.emit(descriptor);
        } else if (this.type === "number") {
            const value1 = this.numberFilterValues[0];
            const value2 = this.numberFilterValues[1];
            const operator1 = this.selectedFilterMenuDataItemList[0]?.value as NumericFilterOperators;
            const operator2 = this.selectedFilterMenuDataItemList[1]?.value as NumericFilterOperators;
            const numberDescriptors: NumericFilterDescriptor[] = [];

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

            const descriptor: CompositeFilterDescriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: numberDescriptors
            };

            this.apply.emit(descriptor);
        } else if (this.type === "date") {
            const value1 = this.dateFilterValues[0];
            const value2 = this.dateFilterValues[1];
            const operator1 = this.selectedFilterMenuDataItemList[0]?.value as DateFilterOperators;
            const operator2 = this.selectedFilterMenuDataItemList[1]?.value as DateFilterOperators;
            const dateDescriptors: DateFilterDescriptor[] = [];

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

            const descriptor: CompositeFilterDescriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: dateDescriptors
            };

            this.apply.emit(descriptor);
        } else if (this.type === "boolean") {
            const operator1 = this.selectedFilterMenuDataItemList[0]?.value as BooleanFilterOperators;
            const operator2 = this.selectedFilterMenuDataItemList[1]?.value as BooleanFilterOperators;
            const booleanDescriptors: BooleanFilterDescriptor[] = [];

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

            const descriptor: CompositeFilterDescriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: booleanDescriptors
            };

            this.apply.emit(descriptor);
        } else {
            console.log("Filter type not supported yet.");
        }
    }

    public onFilterClear(): void {
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

    public onFilterOperatorChange(index: number, item: FilterMenuDataItem): void {
        this.selectedFilterMenuDataItemList[index] = item;
    }

    public get firstFilterValid(): boolean {
        const operator = this.selectedFilterMenuDataItemList[0]?.value;
        if (!operator) {
            return false;
        }
        if (operator === "isnull" || operator === "isnotnull") {
            return true;
        }
        switch (this.type) {
            case "string":
                if (
                    operator === "isempty" ||
                    operator === "isnotempty" ||
                    operator === "isnullorempty" ||
                    operator === "isnotnullorempty"
                ) {
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

    public get secondFilterValid(): boolean {
        const operator = this.selectedFilterMenuDataItemList[1]?.value;
        if (!operator) {
            return false;
        }
        if (operator === "isnull" || operator === "isnotnull") {
            return true;
        }
        switch (this.type) {
            case "string":
                if (
                    operator === "isempty" ||
                    operator === "isnotempty" ||
                    operator === "isnullorempty" ||
                    operator === "isnotnullorempty"
                ) {
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

    public getFilterValues(): FilterMenuValue {
        type TargetType = string | number | Date | boolean | null;
        const filterValue = (target: [TargetType, TargetType]) => {
            return {
                operator1: this.selectedFilterMenuDataItemList[0]?.value,
                value1: target[0],
                logic: this.selectedConnectorItem?.value,
                operator2: this.selectedFilterMenuDataItemList[1]?.value,
                value2: target[1]
            };
        };

        switch (this.type) {
            case "string":
                return filterValue(this.stringFilterValues);
            case "number":
                return filterValue(this.numberFilterValues);
            case "date":
                return filterValue(this.dateFilterValues);
            case "boolean":
                return filterValue(this.booleanFilterValues);
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

    private clearSecondFilterValues(): void {
        this.selectedFilterMenuDataItemList[1] = undefined;
        switch (this.type) {
            case "string":
                this.stringFilterValues[1] = "";
                break;
            case "number":
                this.numberFilterValues[1] = null;
                break;
            case "date":
                this.dateFilterValues[1] = null;
                break;
            case "boolean":
                this.booleanFilterValues[1] = null;
                break;
            default:
                break;
        }
    }

    private setFilterValues(values: FilterMenuValue): void {
        type TargetType = string | number | Date | boolean | null;
        let filterMenuDataItems: FilterMenuDataItem[];
        let filterValues: [TargetType, TargetType];

        switch (this.type) {
            case "string":
                filterMenuDataItems = this.stringFilterMenuDataItems;
                filterValues = [values.value1 ?? "", values.value2 ?? ""];
                break;
            case "number":
                filterMenuDataItems = this.numericFilterMenuDataItems;
                filterValues = [values.value1 ?? null, values.value2 ?? null];
                break;
            case "date":
            case "boolean":
                filterMenuDataItems =
                    this.type === "date" ? this.dateFilterMenuDataItems : this.booleanFilterMenuDataItems;
                filterValues = [values.value1 ?? null, values.value2 ?? null];
                break;
            default:
                filterMenuDataItems = [];
                filterValues = [null, null];
                break;
        }

        this.selectedFilterMenuDataItemList = [
            filterMenuDataItems.find(f => f.value === values.operator1) ?? undefined,
            filterMenuDataItems.find(f => f.value === values.operator2) ?? undefined
        ];

        switch (this.type) {
            case "string":
                this.stringFilterValues = filterValues as [string, string];
                break;
            case "number":
                this.numberFilterValues = filterValues as [number, number];
                break;
            case "date":
            case "boolean":
                if (this.type === "date") {
                    this.dateFilterValues = filterValues as [Date, Date];
                } else {
                    this.booleanFilterValues = filterValues as [boolean, boolean];
                }
                break;
            default:
                break;
        }

        this.selectedConnectorItem = this.connectorDataItems.find(c => c.value === values.logic) ?? null;
    }

    public get applyDisabled(): boolean {
        return !this.firstFilterValid || (!!this.selectedConnectorItem && !this.secondFilterValid);
    }
}
