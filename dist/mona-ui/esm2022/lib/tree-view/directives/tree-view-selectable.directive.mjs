import { Directive, EventEmitter, Input, Output } from "@angular/core";
import * as i0 from "@angular/core";
import * as i1 from "../components/tree-view/tree-view.component";
import * as i2 from "../services/tree-view.service";
export class TreeViewSelectableDirective {
    set selectedKeys(selectedKeys) {
        this.treeViewService.selectedKeys.clear();
        this.treeViewService.selectedKeys.addAll(selectedKeys);
    }
    constructor(treeView, treeViewService) {
        this.treeView = treeView;
        this.treeViewService = treeViewService;
        this.selectedKeysChange = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes && changes["selectedKeys"] && !changes["selectedKeys"].isFirstChange()) {
            this.treeViewService.loadSelectedKeys(this.treeViewService.selectedKeys);
        }
    }
    ngOnInit() {
        this.treeViewService.selectedKeysChange = this.selectedKeysChange;
        if (this.options) {
            this.treeViewService.setSelectableOptions(this.options);
        }
        else if (this.options === "") {
            this.treeViewService.setSelectableOptions({ enabled: true });
        }
        this.treeViewService.loadSelectedKeys(this.treeViewService.selectedKeys);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewSelectableDirective, deps: [{ token: i1.TreeViewComponent }, { token: i2.TreeViewService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TreeViewSelectableDirective, selector: "mona-tree-view[monaTreeViewSelectable]", inputs: { selectedKeys: "selectedKeys", options: ["monaTreeViewSelectable", "options"] }, outputs: { selectedKeysChange: "selectedKeysChange" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewSelectableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "mona-tree-view[monaTreeViewSelectable]"
                }]
        }], ctorParameters: function () { return [{ type: i1.TreeViewComponent }, { type: i2.TreeViewService }]; }, propDecorators: { selectedKeys: [{
                type: Input
            }], selectedKeysChange: [{
                type: Output
            }], options: [{
                type: Input,
                args: ["monaTreeViewSelectable"]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS12aWV3LXNlbGVjdGFibGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL3RyZWUtdmlldy9kaXJlY3RpdmVzL3RyZWUtdmlldy1zZWxlY3RhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBaUIsTUFBTSxlQUFlLENBQUM7Ozs7QUFRekcsTUFBTSxPQUFPLDJCQUEyQjtJQUNwQyxJQUNXLFlBQVksQ0FBQyxZQUE4QjtRQUNsRCxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQVFELFlBQ3FCLFFBQTJCLEVBQzNCLGVBQWdDO1FBRGhDLGFBQVEsR0FBUixRQUFRLENBQW1CO1FBQzNCLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQVA5Qyx1QkFBa0IsR0FBMkIsSUFBSSxZQUFZLEVBQVksQ0FBQztJQVE5RSxDQUFDO0lBRUcsV0FBVyxDQUFDLE9BQXNCO1FBQ3JDLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUNoRixJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDNUU7SUFDTCxDQUFDO0lBRU0sUUFBUTtRQUNYLElBQUksQ0FBQyxlQUFlLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBQ2xFLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLElBQUksQ0FBQyxlQUFlLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzNEO2FBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEVBQUUsRUFBRTtZQUM1QixJQUFJLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7U0FDaEU7UUFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDN0UsQ0FBQzs4R0FoQ1EsMkJBQTJCO2tHQUEzQiwyQkFBMkI7OzJGQUEzQiwyQkFBMkI7a0JBSHZDLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLHdDQUF3QztpQkFDckQ7c0lBR2MsWUFBWTtzQkFEdEIsS0FBSztnQkFPQyxrQkFBa0I7c0JBRHhCLE1BQU07Z0JBSUEsT0FBTztzQkFEYixLQUFLO3VCQUFDLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIE91dHB1dCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBTZWxlY3RhYmxlT3B0aW9ucyB9IGZyb20gXCIuLi9kYXRhL1NlbGVjdGFibGVPcHRpb25zXCI7XG5pbXBvcnQgeyBUcmVlVmlld0NvbXBvbmVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL3RyZWUtdmlldy90cmVlLXZpZXcuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBUcmVlVmlld1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvdHJlZS12aWV3LnNlcnZpY2VcIjtcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6IFwibW9uYS10cmVlLXZpZXdbbW9uYVRyZWVWaWV3U2VsZWN0YWJsZV1cIlxufSlcbmV4cG9ydCBjbGFzcyBUcmVlVmlld1NlbGVjdGFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IHNlbGVjdGVkS2V5cyhzZWxlY3RlZEtleXM6IEl0ZXJhYmxlPHN0cmluZz4pIHtcbiAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2Uuc2VsZWN0ZWRLZXlzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLnNlbGVjdGVkS2V5cy5hZGRBbGwoc2VsZWN0ZWRLZXlzKTtcbiAgICB9XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgc2VsZWN0ZWRLZXlzQ2hhbmdlOiBFdmVudEVtaXR0ZXI8c3RyaW5nW10+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmdbXT4oKTtcblxuICAgIEBJbnB1dChcIm1vbmFUcmVlVmlld1NlbGVjdGFibGVcIilcbiAgICBwdWJsaWMgb3B0aW9ucz86IFNlbGVjdGFibGVPcHRpb25zIHwgXCJcIjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSB0cmVlVmlldzogVHJlZVZpZXdDb21wb25lbnQsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgdHJlZVZpZXdTZXJ2aWNlOiBUcmVlVmlld1NlcnZpY2VcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBpZiAoY2hhbmdlcyAmJiBjaGFuZ2VzW1wic2VsZWN0ZWRLZXlzXCJdICYmICFjaGFuZ2VzW1wic2VsZWN0ZWRLZXlzXCJdLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2UubG9hZFNlbGVjdGVkS2V5cyh0aGlzLnRyZWVWaWV3U2VydmljZS5zZWxlY3RlZEtleXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRyZWVWaWV3U2VydmljZS5zZWxlY3RlZEtleXNDaGFuZ2UgPSB0aGlzLnNlbGVjdGVkS2V5c0NoYW5nZTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2Uuc2V0U2VsZWN0YWJsZU9wdGlvbnModGhpcy5vcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLnNldFNlbGVjdGFibGVPcHRpb25zKHsgZW5hYmxlZDogdHJ1ZSB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRyZWVWaWV3U2VydmljZS5sb2FkU2VsZWN0ZWRLZXlzKHRoaXMudHJlZVZpZXdTZXJ2aWNlLnNlbGVjdGVkS2V5cyk7XG4gICAgfVxufVxuIl19