import { Action } from "../../utils/Action";
export type NodeDisablerAction = Action<any, boolean>;
export type NodeDisabler = NodeDisablerAction | string;
