import { Predicate, Selector } from "@mirei/ts-collections";
import { CompositeFilterDescriptor, FilterDescriptor } from "./FilterDescriptor";
export declare abstract class FilterUtils {
    static compositeDescriptorToPredicate<T>(descriptor: CompositeFilterDescriptor, fieldSelector?: Selector<T, any>): Predicate<T>;
    static descriptorToPredicate<T>(descriptor: FilterDescriptor, fieldSelector?: Selector<T, any>): Predicate<T>;
}
