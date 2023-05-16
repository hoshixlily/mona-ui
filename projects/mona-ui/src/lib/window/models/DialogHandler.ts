import { Subject } from "rxjs";

/**
 * Interface for passing data to the dialog component from the dialog service.
 * @internal This interface is not supposed to be used by the end user. Do not export it.
 */
export interface DialogHandler {
    close: () => void;
    closed$: Subject<{ viaClose?: boolean }>;
}
