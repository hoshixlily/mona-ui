import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { PlaceholderComponent } from "../../../../layout/placeholder/placeholder.component";
import { FilterInputComponent } from "../../../filter-input/components/filter-input/filter-input.component";
import { FilterChangeEvent } from "../../../filter-input/models/FilterChangeEvent";
import { ListGroupHeaderTemplateDirective } from "../../directives/list-group-header-template.directive";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { ListItemDirective } from "../../directives/list-item.directive";
import { ListNoDataTemplateDirective } from "../../directives/list-no-data-template.directive";
import { ListItemTemplateContext } from "../../models/ListItemTemplateContext";
import { ListService } from "../../services/list.service";
import { ListItemComponent } from "../list-item/list-item.component";

@Component({
    selector: "mona-list",
    standalone: true,
    imports: [
        FilterInputComponent,
        ListItemComponent,
        NgTemplateOutlet,
        ListItemDirective,
        PlaceholderComponent,
        CdkVirtualScrollViewport,
        CdkFixedSizeVirtualScroll,
        CdkVirtualForOf
    ],
    templateUrl: "./list.component.html",
    styleUrl: "./list.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent<TData> {
    @Input({ required: false })
    public set data(value: Iterable<TData>) {
        this.listService.setData(value);
    }

    @ContentChild(ListGroupHeaderTemplateDirective, { read: TemplateRef })
    public groupHeaderTemplate: TemplateRef<ListItemTemplateContext<string>> | null = null;

    @ContentChild(ListItemTemplateDirective, { read: TemplateRef })
    public itemTemplate: TemplateRef<ListItemTemplateContext<TData>> | null = null;

    @ContentChild(ListNoDataTemplateDirective, { read: TemplateRef })
    public noDataTemplate: TemplateRef<any> | null = null;

    @Input()
    public set textField(textField: string | Selector<TData, string> | null | undefined) {
        this.listService.setTextField(textField ?? "");
    }

    public constructor(protected readonly listService: ListService<TData>) {}

    public onFilterChange(event: FilterChangeEvent): void {
        this.listService.filterChange.emit(event);
        if (!event.isDefaultPrevented()) {
            this.listService.setFilter(event.filter);
        }
    }
}
