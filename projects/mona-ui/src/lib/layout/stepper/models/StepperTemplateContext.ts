import { StepOptions } from "./Step";

export interface StepperTemplateContext<T = any> {
    $implicit: StepOptions<T>;
    active: boolean;
    index: number;
}
