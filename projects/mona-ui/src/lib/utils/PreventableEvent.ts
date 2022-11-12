export class PreventableEvent<E extends Event> {
    private readonly event?: E;
    private readonly type: string = "";
    private defaultPrevented: boolean = false;

    protected constructor(type: string, event?: E) {
        this.type = type;
        this.event = event;
    }

    public isDefaultPrevented(): boolean {
        return this.defaultPrevented;
    }

    public preventDefault(): void {
        this.defaultPrevented = true;
    }

    public get originalEvent(): E | undefined {
        return this.event;
    }
}
