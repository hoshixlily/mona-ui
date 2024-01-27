import { Subject } from "rxjs";
import { Action } from "../../../utils/Action";

export interface Popup2RefOptions<R = void> {
    close: Action<R>;
    close$: Subject<R>;
}
