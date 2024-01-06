import { Directive, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FilterChangeEvent } from "../../common/filter-input/models/FilterChangeEvent";
import { FilterableOptions } from "../models/FilterableOptions";
import { TreeViewService } from "../services/tree-view.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewFilterable]",
    standalone: true
})
export class TreeViewFilterableDirective implements OnInit {
    @Input()
    public set filter(value: string) {
        this.treeViewService.filter$.next(value);
    }

    @Output()
    public filterChange: EventEmitter<FilterChangeEvent> = new EventEmitter<FilterChangeEvent>();

    @Input()
    public set filterPlaceholder(value: string) {
        this.treeViewService.filterPlaceholder.set(value);
    }

    @Input("monaTreeViewFilterable")
    public options?: FilterableOptions | "";

    public constructor(private readonly treeViewService: TreeViewService) {}

    public ngOnInit(): void {
        this.treeViewService.filterChange = this.filterChange;
        if (this.options) {
            this.treeViewService.setFilterableOptions(this.options);
        } else if (this.options === "") {
            this.treeViewService.setFilterableOptions({ enabled: true });
        }
    }
}
