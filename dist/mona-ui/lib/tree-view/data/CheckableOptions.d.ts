import { CheckMode } from "./CheckMode";
export interface CheckableOptions {
    checkChildren?: boolean;
    checkParents?: boolean;
    enabled?: boolean;
    mode?: CheckMode;
}
