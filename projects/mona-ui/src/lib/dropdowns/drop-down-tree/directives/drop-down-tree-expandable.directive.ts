import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ExpandableOptions } from "../../../tree-view/models/ExpandableOptions";
import { DropDownTreeService } from "../services/drop-down-tree.service";

@Directive({
    selector: "mona-drop-down-tree[monaDropDownTreeExpandable]",
    standalone: true
})
export class DropDownTreeExpandableDirective implements OnInit, OnChanges {
    @Input()
    public set expandedKeys(expandedKeys: Iterable<unknown>) {
        this.dropdownTreeService.expandedKeys.update(set => set.clear().addAll(expandedKeys));
    }

    @Output()
    public expandedKeysChange: EventEmitter<unknown[]> = new EventEmitter<unknown[]>();

    @Input("monaDropDownTreeExpandable")
    public options?: ExpandableOptions | "";

    public constructor(private readonly dropdownTreeService: DropDownTreeService) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes["expandedKeys"] && !changes["expandedKeys"].isFirstChange()) {
            this.dropdownTreeService.loadExpandedKeys(this.dropdownTreeService.expandedKeys());
        }
    }

    public ngOnInit(): void {
        this.dropdownTreeService.expandedKeysChange = this.expandedKeysChange;
        if (this.options) {
            this.dropdownTreeService.setExpandableOptions(this.options);
        } else if (this.options === "") {
            this.dropdownTreeService.setExpandableOptions({ enabled: true });
        }
        this.dropdownTreeService.loadExpandedKeys(this.dropdownTreeService.expandedKeys());
    }
}
