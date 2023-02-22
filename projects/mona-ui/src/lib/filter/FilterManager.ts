import { CompositeFilterDescriptor, FilterDescriptor } from "./FilterDescriptor";

export const FilterManager = <T = any>(data: T[], filterDescriptors: Array<CompositeFilterDescriptor>): T[] => {
    if (filterDescriptors.length === 0) {
        return data;
    }

    const filter = (row: any, filterDescriptor: FilterDescriptor<T>): boolean => {
        const value = row[filterDescriptor.field];
        switch (filterDescriptor.operator) {
            case "eq":
                return value === filterDescriptor.value;
            case "neq":
                return value !== filterDescriptor.value;
            case "gt":
                return value > filterDescriptor.value;
            case "gte":
                return value >= filterDescriptor.value;
            case "lt":
                return value < filterDescriptor.value;
            case "lte":
                return value <= filterDescriptor.value;
            case "startswith":
                return value.startsWith(filterDescriptor.value);
            case "endswith":
                return value.endsWith(filterDescriptor.value);
            case "contains":
                return value.includes(filterDescriptor.value);
            case "doesnotcontain":
                return !value.includes(filterDescriptor.value);
            case "isnull":
                return value == null;
            case "isnotnull":
                return value != null;
            case "isempty":
                return value === "";
            case "isnotempty":
                return value !== "";
            case "isnullorempty":
                return value == null || value === "";
            case "isnotnullorempty":
                return value != null && value !== "";
            case "in":
                return (filterDescriptor.value as T[]).includes(value);
            case "notin":
                return !(filterDescriptor.value as T[]).includes(value);
            case "between":
                return value >= (filterDescriptor.value as T[])[0] && value <= (filterDescriptor.value as T[])[1];
            case "notbetween":
                return value < (filterDescriptor.value as T[])[0] || value > (filterDescriptor.value as T[])[1];
            default:
                return false;
        }
    };

    const filterComposite = (row: T, compositeFilterDescriptor: CompositeFilterDescriptor<T>): boolean => {
        const filters = compositeFilterDescriptor.filters;
        const logic = compositeFilterDescriptor.logic;
        if (logic === "and") {
            return filters.every(f => {
                if (f.hasOwnProperty("field")) {
                    return filter(row, f as FilterDescriptor<T>);
                } else {
                    return filterComposite(row, f as CompositeFilterDescriptor<T>);
                }
            });
        } else if (logic === "or") {
            return filters.some(f => {
                if (f.hasOwnProperty("field")) {
                    return filter(row, f as FilterDescriptor<T>);
                } else {
                    return filterComposite(row, f as CompositeFilterDescriptor<T>);
                }
            });
        } else {
            return false;
        }
    };

    return data.filter(row => {
        return filterDescriptors.every(f => {
            if (f.hasOwnProperty("field")) {
                return filter(row, f as unknown as FilterDescriptor<T>);
            } else {
                return filterComposite(row, f as CompositeFilterDescriptor<T>);
            }
        });
    });
};
