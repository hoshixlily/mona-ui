import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FilterFieldType } from "../../models/FilterFieldType";
import { FilterMenuDataItem } from "../../models/FilterMenuDataItem";
import { FilterMenuConnectorItem } from "../../models/FilterMenuConnectorItem";
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
import { FilterMenuValue } from "../../models/FilterMenuValue";

@Component({
    selector: "mona-filter-menu",
    templateUrl: "./filter-menu.component.html",
    styleUrls: ["./filter-menu.component.scss"],
    changeDetection: ChangeDetectionStrategy.Default
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
    public type: FilterFieldType = "string";

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
        switch (this.type) {
            case "string":
                return {
                    value1: this.stringFilterValues[0],
                    value2: this.stringFilterValues[1],
                    logic: this.selectedConnectorItem?.value
                };
            case "number":
                return {
                    value1: this.numberFilterValues[0],
                    value2: this.numberFilterValues[1],
                    logic: this.selectedConnectorItem?.value
                };
            case "date":
                return {
                    value1: this.dateFilterValues[0],
                    value2: this.dateFilterValues[1],
                    logic: this.selectedConnectorItem?.value
                };
            case "boolean":
                return {
                    value1: this.booleanFilterValues[0],
                    value2: this.booleanFilterValues[1],
                    logic: this.selectedConnectorItem?.value
                };
            default:
                return {
                    value1: null,
                    value2: null,
                    logic: undefined
                };
        }
    }

    private setFilterValues(values: FilterMenuValue): void {
        switch (this.type) {
            case "string":
                this.stringFilterValues = [values.value1 ?? "", values.value2 ?? ""];
                this.selectedConnectorItem = this.connectorDataItems.find(c => c.value === values.logic) ?? null;
                break;
            case "number":
                this.numberFilterValues = [values.value1 ?? null, values.value2 ?? null];
                break;
            case "date":
                this.dateFilterValues = [values.value1 ?? null, values.value2 ?? null];
                break;
            case "boolean":
                this.booleanFilterValues = [values.value1 ?? null, values.value2 ?? null];
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
