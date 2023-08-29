import { Component, ContentChild, EventEmitter, Input, Output, signal, WritableSignal } from "@angular/core";
import { List } from "@mirei/ts-collections";
import { BreadcrumbItem } from "../../models/BreadcrumbItem";
import { faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { BreadcrumbItemTemplateDirective } from "../../directives/breadcrumb-item-template.directive";
import { BreadcrumbSeparatorTemplateDirective } from "../../directives/breadcrumb-separator-template.directive";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgFor, NgClass, NgIf, NgTemplateOutlet } from "@angular/common";

@Component({
    selector: "mona-breadcrumb",
    templateUrl: "./breadcrumb.component.html",
    styleUrls: ["./breadcrumb.component.scss"],
    standalone: true,
    imports: [NgFor, NgClass, NgIf, NgTemplateOutlet, FontAwesomeModule]
})
export class BreadcrumbComponent {
    public readonly separator: IconDefinition = faChevronRight;
    public breadcrumbItems: WritableSignal<List<BreadcrumbItem>> = signal<List<BreadcrumbItem>>(
        new List<BreadcrumbItem>()
    );

    @Output()
    public itemClick: EventEmitter<BreadcrumbItem> = new EventEmitter<BreadcrumbItem>();

    @ContentChild(BreadcrumbItemTemplateDirective)
    public itemTemplate: BreadcrumbItemTemplateDirective | null = null;

    @ContentChild(BreadcrumbSeparatorTemplateDirective)
    public separatorTemplate: BreadcrumbSeparatorTemplateDirective | null = null;

    @Input()
    public set items(value: Iterable<BreadcrumbItem>) {
        this.breadcrumbItems.set(new List<BreadcrumbItem>(value));
    }

    public onItemClick(item: BreadcrumbItem): void {
        this.itemClick.emit(item);
    }
}
