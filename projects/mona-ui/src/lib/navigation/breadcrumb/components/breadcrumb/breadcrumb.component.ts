import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    EventEmitter,
    input,
    InputSignalWithTransform,
    Output
} from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { BreadcrumbItemTemplateDirective } from "../../directives/breadcrumb-item-template.directive";
import { BreadcrumbSeparatorTemplateDirective } from "../../directives/breadcrumb-separator-template.directive";
import { BreadcrumbItem } from "../../models/BreadcrumbItem";

@Component({
    selector: "mona-breadcrumb",
    templateUrl: "./breadcrumb.component.html",
    styleUrls: ["./breadcrumb.component.scss"],
    standalone: true,
    imports: [NgClass, NgTemplateOutlet, FontAwesomeModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "mona-breadcrumb"
    }
})
export class BreadcrumbComponent {
    protected readonly separator: IconDefinition = faChevronRight;
    public items: InputSignalWithTransform<BreadcrumbItem[], Iterable<BreadcrumbItem>> = input([], {
        transform: value => Array.from(value)
    });

    @Output()
    public itemClick: EventEmitter<BreadcrumbItem> = new EventEmitter<BreadcrumbItem>();

    @ContentChild(BreadcrumbItemTemplateDirective)
    public itemTemplate: BreadcrumbItemTemplateDirective | null = null;

    @ContentChild(BreadcrumbSeparatorTemplateDirective)
    public separatorTemplate: BreadcrumbSeparatorTemplateDirective | null = null;

    public onItemClick(item: BreadcrumbItem): void {
        this.itemClick.emit(item);
    }
}
