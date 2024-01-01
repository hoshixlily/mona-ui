import { v4 } from "uuid";

export interface ListItemOptions {
    data?: any | null;
    header?: string;
}

export class ListItem {
    public readonly data: any | null = null;
    public readonly header: string = "";
    public readonly uid: string = v4();

    public constructor(options?: ListItemOptions) {
        if (options) {
            this.data = options.data ?? this.data;
            this.header = options.header ?? this.header;
        }
    }
}
