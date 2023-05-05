import { Directive, EventEmitter, Input, Output } from "@angular/core";
import * as i0 from "@angular/core";
import * as i1 from "../components/tree-view/tree-view.component";
import * as i2 from "../services/tree-view.service";
export class TreeViewCheckableDirective {
    set checkedKeys(checkedKeys) {
        this.treeViewService.checkedKeys.clear();
        this.treeViewService.checkedKeys.addAll(checkedKeys);
    }
    constructor(treeView, treeViewService) {
        this.treeView = treeView;
        this.treeViewService = treeViewService;
        this.checkedKeysChange = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes && changes["checkedKeys"] && !changes["checkedKeys"].isFirstChange()) {
            this.treeViewService.loadCheckedKeys(this.treeViewService.checkedKeys);
        }
    }
    ngOnInit() {
        this.treeViewService.checkedKeysChange = this.checkedKeysChange;
        if (this.options) {
            this.treeViewService.setCheckableOptions(this.options);
        }
        else if (this.options === "") {
            this.treeViewService.setCheckableOptions({ enabled: true });
        }
        this.treeViewService.loadCheckedKeys(this.treeViewService.checkedKeys);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewCheckableDirective, deps: [{ token: i1.TreeViewComponent }, { token: i2.TreeViewService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TreeViewCheckableDirective, selector: "mona-tree-view[monaTreeViewCheckable]", inputs: { checkedKeys: "checkedKeys", options: ["monaTreeViewCheckable", "options"] }, outputs: { checkedKeysChange: "checkedKeysChange" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewCheckableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "mona-tree-view[monaTreeViewCheckable]"
                }]
        }], ctorParameters: function () { return [{ type: i1.TreeViewComponent }, { type: i2.TreeViewService }]; }, propDecorators: { checkedKeys: [{
                type: Input
            }], checkedKeysChange: [{
                type: Output
            }], options: [{
                type: Input,
                args: ["monaTreeViewCheckable"]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS12aWV3LWNoZWNrYWJsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvdHJlZS12aWV3L2RpcmVjdGl2ZXMvdHJlZS12aWV3LWNoZWNrYWJsZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQWlCLE1BQU0sZUFBZSxDQUFDOzs7O0FBUXpHLE1BQU0sT0FBTywwQkFBMEI7SUFDbkMsSUFDVyxXQUFXLENBQUMsV0FBNkI7UUFDaEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFRRCxZQUNxQixRQUEyQixFQUMzQixlQUFnQztRQURoQyxhQUFRLEdBQVIsUUFBUSxDQUFtQjtRQUMzQixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFQOUMsc0JBQWlCLEdBQTJCLElBQUksWUFBWSxFQUFZLENBQUM7SUFRN0UsQ0FBQztJQUVHLFdBQVcsQ0FBQyxPQUFzQjtRQUNyQyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7WUFDOUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUMxRTtJQUNMLENBQUM7SUFFTSxRQUFRO1FBQ1gsSUFBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDaEUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDMUQ7YUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssRUFBRSxFQUFFO1lBQzVCLElBQUksQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUMvRDtRQUNELElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDM0UsQ0FBQzs4R0FoQ1EsMEJBQTBCO2tHQUExQiwwQkFBMEI7OzJGQUExQiwwQkFBMEI7a0JBSHRDLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLHVDQUF1QztpQkFDcEQ7c0lBR2MsV0FBVztzQkFEckIsS0FBSztnQkFPQyxpQkFBaUI7c0JBRHZCLE1BQU07Z0JBSUEsT0FBTztzQkFEYixLQUFLO3VCQUFDLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIE91dHB1dCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBUcmVlVmlld0NvbXBvbmVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL3RyZWUtdmlldy90cmVlLXZpZXcuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDaGVja2FibGVPcHRpb25zIH0gZnJvbSBcIi4uL2RhdGEvQ2hlY2thYmxlT3B0aW9uc1wiO1xuaW1wb3J0IHsgVHJlZVZpZXdTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL3RyZWUtdmlldy5zZXJ2aWNlXCI7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiBcIm1vbmEtdHJlZS12aWV3W21vbmFUcmVlVmlld0NoZWNrYWJsZV1cIlxufSlcbmV4cG9ydCBjbGFzcyBUcmVlVmlld0NoZWNrYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgY2hlY2tlZEtleXMoY2hlY2tlZEtleXM6IEl0ZXJhYmxlPHN0cmluZz4pIHtcbiAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2UuY2hlY2tlZEtleXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2UuY2hlY2tlZEtleXMuYWRkQWxsKGNoZWNrZWRLZXlzKTtcbiAgICB9XG5cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgY2hlY2tlZEtleXNDaGFuZ2U6IEV2ZW50RW1pdHRlcjxzdHJpbmdbXT4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZ1tdPigpO1xuXG4gICAgQElucHV0KFwibW9uYVRyZWVWaWV3Q2hlY2thYmxlXCIpXG4gICAgcHVibGljIG9wdGlvbnM/OiBDaGVja2FibGVPcHRpb25zIHwgXCJcIjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSB0cmVlVmlldzogVHJlZVZpZXdDb21wb25lbnQsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgdHJlZVZpZXdTZXJ2aWNlOiBUcmVlVmlld1NlcnZpY2VcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBpZiAoY2hhbmdlcyAmJiBjaGFuZ2VzW1wiY2hlY2tlZEtleXNcIl0gJiYgIWNoYW5nZXNbXCJjaGVja2VkS2V5c1wiXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLmxvYWRDaGVja2VkS2V5cyh0aGlzLnRyZWVWaWV3U2VydmljZS5jaGVja2VkS2V5cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudHJlZVZpZXdTZXJ2aWNlLmNoZWNrZWRLZXlzQ2hhbmdlID0gdGhpcy5jaGVja2VkS2V5c0NoYW5nZTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2Uuc2V0Q2hlY2thYmxlT3B0aW9ucyh0aGlzLm9wdGlvbnMpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucyA9PT0gXCJcIikge1xuICAgICAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2Uuc2V0Q2hlY2thYmxlT3B0aW9ucyh7IGVuYWJsZWQ6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cmVlVmlld1NlcnZpY2UubG9hZENoZWNrZWRLZXlzKHRoaXMudHJlZVZpZXdTZXJ2aWNlLmNoZWNrZWRLZXlzKTtcbiAgICB9XG59XG4iXX0=