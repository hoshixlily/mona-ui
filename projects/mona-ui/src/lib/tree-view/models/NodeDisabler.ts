import { Action } from "../../utils/Action";

export type NodeDisablerAction = Action<unknown, boolean>;
export type NodeDisabler = NodeDisablerAction | string;
