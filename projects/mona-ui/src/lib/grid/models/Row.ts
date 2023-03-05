export class Row<T = any> {
    public data: T;
    public selected: boolean = false;
    public constructor(data: T) {
        this.data = data;
    }
}
