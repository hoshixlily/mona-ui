export interface BreadcrumbItem<T = any> {
    data?: T;
    disabled?: boolean;
    label?: string;
    url?: string;
    title?: string;
}
