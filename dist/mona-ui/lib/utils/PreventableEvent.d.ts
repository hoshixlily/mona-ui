export declare class PreventableEvent<E = unknown> {
    #private;
    protected constructor(type?: string, event?: E);
    isDefaultPrevented(): boolean;
    preventDefault(): void;
    get originalEvent(): E | undefined;
    get type(): string | undefined;
}
