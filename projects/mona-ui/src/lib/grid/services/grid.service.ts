import { Injectable } from "@angular/core";
import { Column } from "../models/Column";
import { Dictionary } from "@mirei/ts-collections";
import { ColumnFilterState } from "../models/ColumnFilterState";
import { ColumnSortState } from "../models/ColumnSortState";
import { TempGridData } from "../models/TempGridData";
import { Products, SampleProducts } from "../models/SampleProducts";
import { SampleOrders } from "../models/SampleOrders";

@Injectable()
export class GridService {
    public appliedFilters: Dictionary<string, ColumnFilterState> = new Dictionary<string, ColumnFilterState>();
    public appliedSorts: Dictionary<string, ColumnSortState> = new Dictionary<string, ColumnSortState>();
    public productColumns: Column[] = [
        new Column({ field: "ProductID", title: "Product ID", filterType: "number" }),
        new Column({ field: "ProductName", title: "Product Name", filterType: "string" }),
        new Column({ field: "SupplierID", title: "Supplier ID", filterType: "number" }),
        new Column({ field: "CategoryID", title: "Category ID", filterType: "number" }),
        new Column({ field: "QuantityPerUnit", title: "Quantity Per Unit", filterType: "string" }),
        new Column({ field: "UnitPrice", title: "Unit Price", filterType: "number" }),
        new Column({ field: "UnitsInStock", title: "Units In Stock", filterType: "number" }),
        new Column({ field: "UnitsOnOrder", title: "Units On Order", filterType: "number" }),
        new Column({ field: "ReorderLevel", title: "Reorder Level", filterType: "number" }),
        new Column({ field: "Discontinued", title: "Discontinued", filterType: "boolean" }),
        new Column({ field: "FirstOrderedOn", title: "First Ordered On", filterType: "date" })
    ];

    public orderColumns: Column[] = [
        new Column({ field: "OrderID", title: "Order ID", filterType: "number" }),
        new Column({ field: "ShipCountry", title: "Ship Country", filterType: "string" }),
        new Column({ field: "OrderDate", title: "Order Date", filterType: "date" }),
        new Column({ field: "Freight", title: "Freight", filterType: "number" })
        // new Column({ field: "CustomerID", title: "Customer ID", filterType: "string" }),
        // new Column({ field: "EmployeeID", title: "Employee ID", filterType: "number" }),
        // new Column({ field: "RequiredDate", title: "Required Date", filterType: "date" }),
        // new Column({ field: "ShippedDate", title: "Shipped Date", filterType: "date" }),
        // new Column({ field: "ShipVia", title: "Ship Via", filterType: "number" }),
        // new Column({ field: "ShipName", title: "Ship Name", filterType: "string" }),
        // new Column({ field: "ShipAddress", title: "Ship Address", filterType: "string" }),
        // new Column({ field: "ShipCity", title: "Ship City", filterType: "string" }),
        // new Column({ field: "ShipRegion", title: "Ship Region", filterType: "string" }),
        // new Column({ field: "ShipPostalCode", title: "Ship Postal Code", filterType: "string" }),
    ];

    public get columns(): Column[] {
        return this.orderColumns;
    }

    public gridHeaderElement?: HTMLDivElement;
    public pageState: { skip: number; take: number } = { skip: 0, take: 10 };
    public rows: any[] = SampleOrders;
    public constructor() {}
}
