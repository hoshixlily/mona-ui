import { Predicate } from "@mirei/ts-collections";
import { CompositeFilterDescriptor, FilterDescriptor } from "./FilterDescriptor";

export abstract class FilterUtils {
    public static compositeDescriptorToPredicate<T>(descriptor: CompositeFilterDescriptor): Predicate<T> {
        return (item: T) => {
            const filters = descriptor.filters;
            const logic = descriptor.logic;
            if (logic === "and") {
                return filters.every(f => {
                    if (f.hasOwnProperty("field")) {
                        return FilterUtils.descriptorToPredicate(f as FilterDescriptor)(item);
                    } else {
                        return FilterUtils.compositeDescriptorToPredicate(f as CompositeFilterDescriptor)(item);
                    }
                });
            } else if (logic === "or") {
                return filters.some(f => {
                    if (f.hasOwnProperty("field")) {
                        return FilterUtils.descriptorToPredicate(f as FilterDescriptor)(item);
                    } else {
                        return FilterUtils.compositeDescriptorToPredicate(f as CompositeFilterDescriptor)(item);
                    }
                });
            } else {
                return false;
            }
        };
    }
    public static descriptorToPredicate<T>(descriptor: FilterDescriptor): Predicate<T> {
        return (item: T) => {
            const value = (item as any)[descriptor.field];
            switch (descriptor.operator) {
                case "eq":
                    return value === descriptor.value;
                case "neq":
                    return value !== descriptor.value;
                case "gt":
                    return value > descriptor.value;
                case "gte":
                    return value >= descriptor.value;
                case "lt":
                    return value < descriptor.value;
                case "lte":
                    return value <= descriptor.value;
                case "startswith":
                    return value.startsWith(descriptor.value);
                case "endswith":
                    return value.endsWith(descriptor.value);
                case "contains":
                    return value.includes(descriptor.value);
                case "doesnotcontain":
                    return !value.includes(descriptor.value);
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
                    return (descriptor.value as T[]).includes(value);
                case "notin":
                    return !(descriptor.value as T[]).includes(value);
                case "between":
                    return (
                        value >= (descriptor.value as unknown as T[])[0] &&
                        value <= (descriptor.value as unknown as T[])[1]
                    );
                case "notbetween":
                    return (
                        value < (descriptor.value as unknown as T[])[0] ||
                        value > (descriptor.value as unknown as T[])[1]
                    );
                case "function":
                    return (descriptor.value as Predicate<T>)(value);
                default:
                    return false;
            }
        };
    }
}
