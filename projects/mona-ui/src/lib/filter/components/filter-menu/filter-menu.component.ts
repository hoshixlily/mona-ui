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
    NumericFilterDescriptor,
    NumericFilterOperators,
    StringFilterDescriptor,
    StringFilterOperators
} from "../../../query/filter/FilterDescriptor";

@Component({
    selector: "mona-filter-menu",
    templateUrl: "./filter-menu.component.html",
    styleUrls: ["./filter-menu.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterMenuComponent implements OnInit {
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
        { text: "Is less than or equal to", value: "lte" }
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
    public selectedFilterMenuDataItemList: FilterMenuDataItem[] = [
        this.stringFilterMenuDataItems[0],
        this.stringFilterMenuDataItems[0]
    ];
    public stringFilterValues: string[] = ["", ""];

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
    public type: FilterFieldType = "string";

    public constructor() {}

    public ngOnInit(): void {
        if (this.type === "number") {
            this.selectedFilterMenuDataItemList = [
                this.numericFilterMenuDataItems[0],
                this.numericFilterMenuDataItems[1]
            ];
        } else if (this.type === "string") {
            this.selectedFilterMenuDataItemList = [
                this.stringFilterMenuDataItems[0],
                this.stringFilterMenuDataItems[1]
            ];
        } else if (this.type === "date") {
            this.selectedFilterMenuDataItemList = [this.dateFilterMenuDataItems[0], this.dateFilterMenuDataItems[1]];
        } else if (this.type === "boolean") {
            this.selectedFilterMenuDataItemList = [
                this.booleanFilterMenuDataItems[0],
                this.booleanFilterMenuDataItems[1]
            ];
        }
    }

    public onConnectorChange(item: FilterMenuConnectorItem): void {
        if (item.value === this.selectedConnectorItem?.value) {
            this.selectedConnectorItem = null;
        } else {
            this.selectedConnectorItem = item;
        }
    }

    public onFilterApply(): void {
        if (this.type === "string") {
            if (this.stringFilterValues[0] === "" && this.stringFilterValues[1] === "") {
                return;
            }
            const stringDescriptors: StringFilterDescriptor[] = [];
            if (this.stringFilterValues[0] !== "") {
                stringDescriptors.push({
                    field: this.field,
                    operator: this.selectedFilterMenuDataItemList[0].value as StringFilterOperators,
                    value: this.stringFilterValues[0]
                });
            }
            if (this.selectedConnectorItem && this.stringFilterValues[1] !== "") {
                stringDescriptors.push({
                    field: this.field,
                    operator: this.selectedFilterMenuDataItemList[1].value as StringFilterOperators,
                    value: this.stringFilterValues[1]
                });
            }

            const descriptor: CompositeFilterDescriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: stringDescriptors
            };
            this.apply.emit(descriptor);
        } else if (this.type === "number") {
            if (this.numberFilterValues[0] === null && this.numberFilterValues[1] === null) {
                return;
            }
            const numberDescriptors: NumericFilterDescriptor[] = [];
            if (this.numberFilterValues[0] !== null) {
                numberDescriptors.push({
                    field: this.field,
                    operator: this.selectedFilterMenuDataItemList[0].value as NumericFilterOperators,
                    value: this.numberFilterValues[0]
                });
            }
            if (this.selectedConnectorItem && this.numberFilterValues[1] !== null) {
                numberDescriptors.push({
                    field: this.field,
                    operator: this.selectedFilterMenuDataItemList[1].value as NumericFilterOperators,
                    value: this.numberFilterValues[1]
                });
            }
            const descriptor: CompositeFilterDescriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: numberDescriptors
            };
            this.apply.emit(descriptor);
        } else if (this.type === "date") {
            if (this.dateFilterValues[0] === null && this.dateFilterValues[1] === null) {
                return;
            }
            const dateDescriptors: DateFilterDescriptor[] = [];
            if (this.dateFilterValues[0] !== null) {
                dateDescriptors.push({
                    field: this.field,
                    operator: this.selectedFilterMenuDataItemList[0].value as DateFilterOperators,
                    value: this.dateFilterValues[0]
                });
            }
            if (this.selectedConnectorItem && this.dateFilterValues[1] !== null) {
                dateDescriptors.push({
                    field: this.field,
                    operator: this.selectedFilterMenuDataItemList[1].value as DateFilterOperators,
                    value: this.dateFilterValues[1]
                });
            }
            const descriptor: CompositeFilterDescriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: dateDescriptors
            };
            this.apply.emit(descriptor);
        } else if (this.type === "boolean") {
            const booleanDescriptors: BooleanFilterDescriptor[] = [];
            booleanDescriptors.push({
                field: this.field,
                operator: this.selectedFilterMenuDataItemList[0].value === "isnotnull" ? "neq" : "eq",
                value: this.getBooleanFilterValue(
                    this.selectedFilterMenuDataItemList[0].value as BooleanFilterOperators
                )
            });
            if (this.selectedConnectorItem) {
                booleanDescriptors.push({
                    field: this.field,
                    operator: this.selectedFilterMenuDataItemList[1].value === "isnotnull" ? "neq" : "eq",
                    value: this.getBooleanFilterValue(
                        this.selectedFilterMenuDataItemList[1].value as BooleanFilterOperators
                    )
                });
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
        this.apply.emit({
            logic: "and",
            filters: []
        });
    }

    public onFilterOperatorChange(index: number, item: FilterMenuDataItem): void {
        this.selectedFilterMenuDataItemList[index] = item;
    }

    private getBooleanFilterValue(operator: BooleanFilterOperators): boolean | null {
        switch (operator) {
            case "eq":
                return true;
            case "neq":
                return false;
            case "isnull":
                return null;
            case "isnotnull":
                return null;
            default:
                return null;
        }
    }

    public get firstFilterValid(): boolean {
        switch (this.type) {
            case "string":
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
        switch (this.type) {
            case "string":
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

    public get applyDisabled(): boolean {
        return !this.firstFilterValid && !this.secondFilterValid;
    }
}
