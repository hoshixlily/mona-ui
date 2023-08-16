export interface ListViewItemTemplateContext<T = any> {
    $implicit: T;
    first: boolean;
    index: number;
    last: boolean;
}
