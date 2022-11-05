import { CheckMode } from "./CheckMode";

export interface CheckableOptions {
    checkChildren?: boolean;
    checkMode?: CheckMode;
    checkParents?: boolean;
    enabled?: boolean;
}
