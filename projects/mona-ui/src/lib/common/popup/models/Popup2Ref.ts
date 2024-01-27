import { Observable, Subject } from "rxjs";
import { Popup2RefOptions } from "./Popup2RefOptions";

export class Popup2Ref {
    readonly #close$ = new Subject<void>();
    public readonly closed: Observable<void>;
    public constructor(private readonly options: Popup2RefOptions) {
        this.#close$ = options.close$;
        this.closed = this.#close$.asObservable();
    }

    public close(): void {
        this.options.close();
    }
}
