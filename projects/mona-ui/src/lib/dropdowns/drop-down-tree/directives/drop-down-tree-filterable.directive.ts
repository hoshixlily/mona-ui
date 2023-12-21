import { Directive, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FilterChangeEvent } from "../../../common/models/FilterChangeEvent";
import { FilterableOptions } from "../../../tree-view/models/FilterableOptions";
import { DropDownTreeService } from "../services/drop-down-tree.service";

@Directive({
    selector: "mona-drop-down-tree[monaDropDownTreeFilterable]",
    standalone: true
})
export class DropDownTreeFilterableDirective implements OnInit {
    @Input()
    public set filter(value: string) {
        this.dropdownTreeService.filter$.next(value);
    }

    @Output()
    public filterChange: EventEmitter<FilterChangeEvent> = new EventEmitter<FilterChangeEvent>();

    @Input("monaDropDownTreeFilterable")
    public options?: FilterableOptions | "";

    public constructor(private readonly dropdownTreeService: DropDownTreeService) {}

    public ngOnInit(): void {
        this.dropdownTreeService.filterChange = this.filterChange;
        if (this.options) {
            this.dropdownTreeService.setFilterableOptions(this.options);
        } else if (this.options === "") {
            this.dropdownTreeService.setFilterableOptions({ enabled: true });
        }
    }
}
