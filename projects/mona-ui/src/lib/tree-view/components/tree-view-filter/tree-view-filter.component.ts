import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { TextBoxComponent } from "../../../inputs/text-box/components/text-box/text-box.component";
import { TextBoxPrefixTemplateDirective } from "../../../inputs/text-box/directives/text-box-prefix-template.directive";
import { FilterChangeEvent } from "../../models/FilterChangeEvent";
import { TreeViewService } from "../../services/tree-view.service";

@Component({
    selector: "mona-tree-view-filter",
    standalone: true,
    imports: [FaIconComponent, TextBoxComponent, FormsModule, TextBoxPrefixTemplateDirective],
    templateUrl: "./tree-view-filter.component.html",
    styleUrl: "./tree-view-filter.component.scss"
})
export class TreeViewFilterComponent {
    protected readonly filterIcon = faSearch;

    public constructor(protected readonly treeViewService: TreeViewService) {}

    public onFilterChange(value: string): void {
        const event = new FilterChangeEvent(value);
        this.treeViewService.filterChange.emit(event);
        if (!event.isDefaultPrevented()) {
            this.treeViewService.filter$.next(value);
        }
    }
}
