import { StepOptions } from "./Step";

export interface StepperTemplateContext<T = any> {
    $implicit: StepOptions<T>;
    index: number;
}
