import { Action } from "../../utils/Action";

export type ItemDisablerAction = Action<any, boolean>;
export type ItemDisabler = ItemDisablerAction | string;
