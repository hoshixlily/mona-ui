import { Directive, Input } from "@angular/core";
import * as i0 from "@angular/core";
import * as i1 from "../components/tree-view/tree-view.component";
import * as i2 from "../services/tree-view.service";
export class TreeViewDisableDirective {
    set disabledKeys(disabledKeys) {
        this.treeViewService.disabledKeys.clear();
        this.treeViewService.disabledKeys.addAll(disabledKeys);
    }
    constructor(treeView, treeViewService) {
        this.treeView = treeView;
        this.treeViewService = treeViewService;
    }
    ngOnChanges(changes) {
        if (changes && changes["disabledKeys"] && !changes["disabledKeys"].isFirstChange()) {
            this.treeViewService.loadDisabledKeys(this.treeViewService.disabledKeys);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewDisableDirective, deps: [{ token: i1.TreeViewComponent }, { token: i2.TreeViewService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TreeViewDisableDirective, selector: "mona-tree-view[monaTreeViewDisable]", inputs: { disabledKeys: "disabledKeys" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewDisableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "mona-tree-view[monaTreeViewDisable]"
                }]
        }], ctorParameters: function () { return [{ type: i1.TreeViewComponent }, { type: i2.TreeViewService }]; }, propDecorators: { disabledKeys: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS12aWV3LWRpc2FibGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL3RyZWUtdmlldy9kaXJlY3RpdmVzL3RyZWUtdmlldy1kaXNhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBNEIsTUFBTSxlQUFlLENBQUM7Ozs7QUFPM0UsTUFBTSxPQUFPLHdCQUF3QjtJQUNqQyxJQUNXLFlBQVksQ0FBQyxZQUE4QjtRQUNsRCxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELFlBQ3FCLFFBQTJCLEVBQzNCLGVBQWdDO1FBRGhDLGFBQVEsR0FBUixRQUFRLENBQW1CO1FBQzNCLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtJQUNsRCxDQUFDO0lBRUcsV0FBVyxDQUFDLE9BQXNCO1FBQ3JDLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUNoRixJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDNUU7SUFDTCxDQUFDOzhHQWhCUSx3QkFBd0I7a0dBQXhCLHdCQUF3Qjs7MkZBQXhCLHdCQUF3QjtrQkFIcEMsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUscUNBQXFDO2lCQUNsRDtzSUFHYyxZQUFZO3NCQUR0QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFRyZWVWaWV3Q29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvdHJlZS12aWV3L3RyZWUtdmlldy5jb21wb25lbnRcIjtcbmltcG9ydCB7IFRyZWVWaWV3U2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy90cmVlLXZpZXcuc2VydmljZVwiO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogXCJtb25hLXRyZWUtdmlld1ttb25hVHJlZVZpZXdEaXNhYmxlXVwiXG59KVxuZXhwb3J0IGNsYXNzIFRyZWVWaWV3RGlzYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IGRpc2FibGVkS2V5cyhkaXNhYmxlZEtleXM6IEl0ZXJhYmxlPHN0cmluZz4pIHtcbiAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2UuZGlzYWJsZWRLZXlzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLmRpc2FibGVkS2V5cy5hZGRBbGwoZGlzYWJsZWRLZXlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgdHJlZVZpZXc6IFRyZWVWaWV3Q29tcG9uZW50LFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHRyZWVWaWV3U2VydmljZTogVHJlZVZpZXdTZXJ2aWNlXG4gICAgKSB7fVxuXG4gICAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgaWYgKGNoYW5nZXMgJiYgY2hhbmdlc1tcImRpc2FibGVkS2V5c1wiXSAmJiAhY2hhbmdlc1tcImRpc2FibGVkS2V5c1wiXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLmxvYWREaXNhYmxlZEtleXModGhpcy50cmVlVmlld1NlcnZpY2UuZGlzYWJsZWRLZXlzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==