import { Action } from "../../utils/Action";

export interface ListDataCreationOptions {
    data: Iterable<any>;
    disabler?: Action<any, boolean>;
    groupField?: string;
    textField?: string;
    valueField?: string;
}
