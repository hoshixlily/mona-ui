import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    contentChild,
    input,
    InputSignalWithTransform,
    output,
    OutputEmitterRef,
    Signal,
    TemplateRef
} from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { BreadcrumbItemTemplateDirective } from "../../directives/breadcrumb-item-template.directive";
import { BreadcrumbSeparatorTemplateDirective } from "../../directives/breadcrumb-separator-template.directive";
import { BreadcrumbItem } from "../../models/BreadcrumbItem";
import { BreadcrumbItemTemplateContext } from "../../models/BreadcrumbItemTemplateContext";

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
    protected readonly itemTemplate: Signal<TemplateRef<BreadcrumbItemTemplateContext> | undefined> = contentChild(
        BreadcrumbItemTemplateDirective,
        { read: TemplateRef }
    );
    protected readonly separator: IconDefinition = faChevronRight;
    protected readonly separatorTemplate: Signal<TemplateRef<BreadcrumbItemTemplateContext> | undefined> = contentChild(
        BreadcrumbSeparatorTemplateDirective,
        { read: TemplateRef }
    );

    public readonly itemClick: OutputEmitterRef<BreadcrumbItem> = output();
    public items: InputSignalWithTransform<BreadcrumbItem[], Iterable<BreadcrumbItem>> = input([], {
        transform: value => Array.from(value)
    });

    public onItemClick(item: BreadcrumbItem): void {
        this.itemClick.emit(item);
    }
}
