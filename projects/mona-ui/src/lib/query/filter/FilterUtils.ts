import { Predicate, Selector } from "@mirei/ts-collections";
import { CompositeFilterDescriptor, FilterDescriptor } from "./FilterDescriptor";
import { DateTime } from "luxon";

export abstract class FilterUtils {
    public static compositeDescriptorToPredicate<T>(
        descriptor: CompositeFilterDescriptor,
        fieldSelector?: Selector<T, any>
    ): Predicate<T> {
        return (item: T) => {
            const filters = descriptor.filters;
            const logic = descriptor.logic;

            const processFilter = (f: any) => {
                if (f.hasOwnProperty("field")) {
                    return FilterUtils.descriptorToPredicate(f as FilterDescriptor, fieldSelector)(item);
                } else {
                    return FilterUtils.compositeDescriptorToPredicate(
                        f as CompositeFilterDescriptor,
                        fieldSelector
                    )(item);
                }
            };

            if (logic === "and") {
                return filters.every(processFilter);
            } else if (logic === "or") {
                return filters.some(processFilter);
            } else {
                return false;
            }
        };
    }
    public static descriptorToPredicate<T>(
        descriptor: FilterDescriptor,
        fieldSelector?: Selector<T, any>
    ): Predicate<T> {
        return (item: T) => {
            const value = (fieldSelector ? fieldSelector(item) : (item as any))[descriptor.field];
            switch (descriptor.operator) {
                case "eq":
                    return value == null && descriptor.value == null
                        ? true
                        : (value == null && descriptor.value != null) || (value != null && descriptor.value == null)
                        ? false
                        : value instanceof Date
                        ? DateTime.fromJSDate(value).equals(DateTime.fromJSDate(descriptor.value))
                        : value === descriptor.value;
                case "neq":
                    return value == null && descriptor.value == null
                        ? false
                        : (value == null && descriptor.value != null) || (value != null && descriptor.value == null)
                        ? true
                        : value instanceof Date
                        ? !DateTime.fromJSDate(value).equals(DateTime.fromJSDate(descriptor.value))
                        : value !== descriptor.value;
                case "gt":
                    return value == null || descriptor.value == null ? false : value > descriptor.value;
                case "gte":
                    return value == null || descriptor.value == null ? false : value >= descriptor.value;
                case "lt":
                    return value == null || descriptor.value == null ? false : value < descriptor.value;
                case "lte":
                    return value == null || descriptor.value == null ? false : value <= descriptor.value;
                case "startswith":
                    return typeof value === "string"
                        ? value.toLowerCase().startsWith(descriptor.value.toLowerCase())
                        : false;
                case "endswith":
                    return typeof value === "string"
                        ? value.toLowerCase().endsWith(descriptor.value.toLowerCase())
                        : false;
                case "contains":
                    return typeof value === "string"
                        ? value.toLowerCase().includes(descriptor.value.toLowerCase())
                        : false;
                case "doesnotcontain":
                    return typeof value === "string"
                        ? !value.toLowerCase().includes(descriptor.value.toLowerCase())
                        : false;
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
                case "function":
                    return (descriptor.predicate as Predicate<T>)(value);
                default:
                    return false;
            }
        };
    }
}
