import { PreventableEvent } from "../../../utils/PreventableEvent";

export class FilterChangeEvent extends PreventableEvent {
    readonly #filter: string;
    public constructor(filterText: string) {
        super("filterInputChange");
        this.#filter = filterText;
    }

    public get filter(): string {
        return this.#filter;
    }
}
