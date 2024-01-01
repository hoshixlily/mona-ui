import { v4 } from "uuid";

export interface ListItemOptions<T> {
    data: T;
    header?: string;
}

export class ListItem<TData> {
    public readonly data: TData;
    public readonly header: string = "";
    public readonly uid: string = v4();

    public constructor(options: ListItemOptions<TData>) {
        this.data = options.data;
        this.header = options.header ?? this.header;
    }
}
