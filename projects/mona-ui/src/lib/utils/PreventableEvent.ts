export class PreventableEvent<E = unknown> {
    readonly #event?: E;
    readonly #type?: string;
    #defaultPrevented: boolean = false;

    protected constructor(type?: string, event?: E) {
        this.#type = type;
        this.#event = event;
    }

    public isDefaultPrevented(): boolean {
        return this.#defaultPrevented;
    }

    public preventDefault(): void {
        this.#defaultPrevented = true;
    }

    public get originalEvent(): E | undefined {
        return this.#event;
    }

    public get type(): string | undefined {
        return this.#type;
    }
}
