import { Component, EventEmitter, Input, Output, signal, WritableSignal } from "@angular/core";
import { BreadcrumbItem } from "../../models/BreadcrumbItem";
import { faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "mona-breadcrumb",
    templateUrl: "./breadcrumb.component.html",
    styleUrls: ["./breadcrumb.component.scss"]
})
export class BreadcrumbComponent {
    public readonly separator: IconDefinition = faChevronRight;
    public breadcrumbItems: WritableSignal<BreadcrumbItem[]> = signal<BreadcrumbItem[]>([]);

    @Output()
    public itemClick: EventEmitter<BreadcrumbItem> = new EventEmitter<BreadcrumbItem>();

    @Input()
    public set items(value: Iterable<BreadcrumbItem>) {
        if (Array.isArray(value)) {
            this.breadcrumbItems.set(value);
        } else {
            this.breadcrumbItems.set(Array.from(value));
        }
    }

    public onItemClick(item: BreadcrumbItem): void {
        this.itemClick.emit(item);
    }
}
