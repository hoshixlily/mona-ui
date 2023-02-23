import { ChangeDetectionStrategy, Component, EventEmitter, Host, Input, OnInit, Output } from "@angular/core";
import { FilterFieldType } from "../../models/FilterFieldType";
import { FilterService } from "../../services/filter.service";
import { FilterMenuDataItem } from "../../models/FilterMenuDataItem";
import { FilterMenuConnectorItem } from "../../models/FilterMenuConnectorItem";
import {
    CompositeFilterDescriptor,
    FilterDescriptor,
    FilterOperators,
    FunctionFilterOperators,
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
    public readonly connectorDataItems: FilterMenuConnectorItem[] = [
        { text: "AND", value: "and" },
        { text: "OR", value: "or" }
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

    public numberFilterValues: [number | null, number | null] = [null, null];
    public selectedConnectorItem: FilterMenuConnectorItem = this.connectorDataItems[0];
    public selectedFilterMenuDataItemList: FilterMenuDataItem[] = [
        this.stringFilterMenuDataItems[0],
        this.stringFilterMenuDataItems[0]
    ];
    public stringFilterValues: string[] = ["", ""];

    @Output()
    public apply: EventEmitter<CompositeFilterDescriptor> = new EventEmitter<CompositeFilterDescriptor>();

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
        }
    }

    public onConnectorChange(item: FilterMenuConnectorItem): void {
        this.selectedConnectorItem = item;
    }

    public onFilterApply(): void {
        switch (this.type) {
            case "string":
                if (this.stringFilterValues[0] === "" && this.stringFilterValues[1] === "") {
                    return;
                }
                const stringDescriptors: FilterDescriptor[] = [];
                if (this.stringFilterValues[0] !== "") {
                    stringDescriptors.push({
                        field: this.field,
                        operator: this.selectedFilterMenuDataItemList[0].value as StringFilterOperators,
                        value: this.stringFilterValues[0]
                    });
                }
                if (this.stringFilterValues[1] !== "") {
                    stringDescriptors.push({
                        field: this.field,
                        operator: this.selectedFilterMenuDataItemList[1].value as StringFilterOperators,
                        value: this.stringFilterValues[1]
                    });
                }

                const compositeDescriptor: CompositeFilterDescriptor = {
                    logic: this.selectedConnectorItem.value,
                    filters: stringDescriptors
                };
                this.apply.emit(compositeDescriptor);
                break;
            case "number":
                if (this.numberFilterValues[0] === null && this.numberFilterValues[1] === null) {
                    return;
                }
                const numberDescriptors: FilterDescriptor[] = [];
                if (this.numberFilterValues[0] !== null) {
                    numberDescriptors.push({
                        field: this.field,
                        operator: this.selectedFilterMenuDataItemList[0].value as NumericFilterOperators,
                        value: this.numberFilterValues[0]
                    });
                }
                if (this.numberFilterValues[1] !== null) {
                    numberDescriptors.push({
                        field: this.field,
                        operator: this.selectedFilterMenuDataItemList[1].value as NumericFilterOperators,
                        value: this.numberFilterValues[1]
                    });
                }
                const compositeDescriptor2: CompositeFilterDescriptor = {
                    logic: this.selectedConnectorItem.value,
                    filters: numberDescriptors
                };
                this.apply.emit(compositeDescriptor2);
                break;
            default:
                console.log("Filter type not supported yet.");
                break;
        }
    }

    public onFilterClear(): void {
        this.numberFilterValues = [null, null];
        this.stringFilterValues = ["", ""];
        this.apply.emit({
            logic: "and",
            filters: []
        });
    }

    public onFilterOperatorChange(index: number, item: FilterMenuDataItem): void {
        this.selectedFilterMenuDataItemList[index] = item;
    }

    public get applyDisabled(): boolean {
        switch (this.type) {
            case "string":
                return this.stringFilterValues[0] === "" && this.stringFilterValues[1] === "";
            case "number":
                return this.numberFilterValues[0] === null && this.numberFilterValues[1] === null;
            default:
                return true;
        }
    }
}
