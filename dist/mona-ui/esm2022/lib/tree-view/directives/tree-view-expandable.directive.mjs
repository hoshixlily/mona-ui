import { Directive, EventEmitter, Input, Output } from "@angular/core";
import * as i0 from "@angular/core";
import * as i1 from "../components/tree-view/tree-view.component";
import * as i2 from "../services/tree-view.service";
export class TreeViewExpandableDirective {
    set expandedKeys(expandedKeys) {
        this.treeViewService.expandedKeys.clear();
        this.treeViewService.expandedKeys.addAll(expandedKeys);
    }
    constructor(treeView, treeViewService) {
        this.treeView = treeView;
        this.treeViewService = treeViewService;
        this.expandedKeysChange = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes && changes["expandedKeys"] && !changes["expandedKeys"].isFirstChange()) {
            this.treeViewService.loadExpandedKeys(this.treeViewService.expandedKeys);
        }
    }
    ngOnInit() {
        this.treeViewService.expandedKeysChange = this.expandedKeysChange;
        this.treeViewService.loadExpandedKeys(this.treeViewService.expandedKeys);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewExpandableDirective, deps: [{ token: i1.TreeViewComponent }, { token: i2.TreeViewService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TreeViewExpandableDirective, selector: "mona-tree-view[monaTreeViewExpandable]", inputs: { expandedKeys: "expandedKeys" }, outputs: { expandedKeysChange: "expandedKeysChange" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewExpandableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "mona-tree-view[monaTreeViewExpandable]"
                }]
        }], ctorParameters: function () { return [{ type: i1.TreeViewComponent }, { type: i2.TreeViewService }]; }, propDecorators: { expandedKeys: [{
                type: Input
            }], expandedKeysChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS12aWV3LWV4cGFuZGFibGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL3RyZWUtdmlldy9kaXJlY3RpdmVzL3RyZWUtdmlldy1leHBhbmRhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBaUIsTUFBTSxlQUFlLENBQUM7Ozs7QUFPekcsTUFBTSxPQUFPLDJCQUEyQjtJQUNwQyxJQUNXLFlBQVksQ0FBQyxZQUE4QjtRQUNsRCxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUtELFlBQ3FCLFFBQTJCLEVBQzNCLGVBQWdDO1FBRGhDLGFBQVEsR0FBUixRQUFRLENBQW1CO1FBQzNCLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUo5Qyx1QkFBa0IsR0FBMkIsSUFBSSxZQUFZLEVBQVksQ0FBQztJQUs5RSxDQUFDO0lBRUcsV0FBVyxDQUFDLE9BQXNCO1FBQ3JDLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUNoRixJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDNUU7SUFDTCxDQUFDO0lBRU0sUUFBUTtRQUNYLElBQUksQ0FBQyxlQUFlLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBQ2xFLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM3RSxDQUFDOzhHQXhCUSwyQkFBMkI7a0dBQTNCLDJCQUEyQjs7MkZBQTNCLDJCQUEyQjtrQkFIdkMsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsd0NBQXdDO2lCQUNyRDtzSUFHYyxZQUFZO3NCQUR0QixLQUFLO2dCQU9DLGtCQUFrQjtzQkFEeEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIE91dHB1dCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBUcmVlVmlld0NvbXBvbmVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL3RyZWUtdmlldy90cmVlLXZpZXcuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBUcmVlVmlld1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvdHJlZS12aWV3LnNlcnZpY2VcIjtcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6IFwibW9uYS10cmVlLXZpZXdbbW9uYVRyZWVWaWV3RXhwYW5kYWJsZV1cIlxufSlcbmV4cG9ydCBjbGFzcyBUcmVlVmlld0V4cGFuZGFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IGV4cGFuZGVkS2V5cyhleHBhbmRlZEtleXM6IEl0ZXJhYmxlPHN0cmluZz4pIHtcbiAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2UuZXhwYW5kZWRLZXlzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLmV4cGFuZGVkS2V5cy5hZGRBbGwoZXhwYW5kZWRLZXlzKTtcbiAgICB9XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgZXhwYW5kZWRLZXlzQ2hhbmdlOiBFdmVudEVtaXR0ZXI8c3RyaW5nW10+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmdbXT4oKTtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSB0cmVlVmlldzogVHJlZVZpZXdDb21wb25lbnQsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgdHJlZVZpZXdTZXJ2aWNlOiBUcmVlVmlld1NlcnZpY2VcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBpZiAoY2hhbmdlcyAmJiBjaGFuZ2VzW1wiZXhwYW5kZWRLZXlzXCJdICYmICFjaGFuZ2VzW1wiZXhwYW5kZWRLZXlzXCJdLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2UubG9hZEV4cGFuZGVkS2V5cyh0aGlzLnRyZWVWaWV3U2VydmljZS5leHBhbmRlZEtleXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRyZWVWaWV3U2VydmljZS5leHBhbmRlZEtleXNDaGFuZ2UgPSB0aGlzLmV4cGFuZGVkS2V5c0NoYW5nZTtcbiAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2UubG9hZEV4cGFuZGVkS2V5cyh0aGlzLnRyZWVWaWV3U2VydmljZS5leHBhbmRlZEtleXMpO1xuICAgIH1cbn1cbiJdfQ==