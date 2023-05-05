import { Directive, Input } from "@angular/core";
import * as i0 from "@angular/core";
import * as i1 from "../services/grid.service";
export class GridEditableDirective {
    constructor(gridService) {
        this.gridService = gridService;
    }
    ngOnInit() {
        if (this.options) {
            this.gridService.setEditableOptions(this.options);
        }
        else if (this.options === "") {
            this.gridService.setEditableOptions({ enabled: true });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridEditableDirective, deps: [{ token: i1.GridService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: GridEditableDirective, selector: "[monaGridEditable]", inputs: { options: ["monaGridEditable", "options"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridEditableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[monaGridEditable]"
                }]
        }], ctorParameters: function () { return [{ type: i1.GridService }]; }, propDecorators: { options: [{
                type: Input,
                args: ["monaGridEditable"]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1lZGl0YWJsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZ3JpZC9kaXJlY3RpdmVzL2dyaWQtZWRpdGFibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDOzs7QUFPekQsTUFBTSxPQUFPLHFCQUFxQjtJQUk5QixZQUFvQyxXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUFHLENBQUM7SUFFekQsUUFBUTtRQUNYLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3JEO2FBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEVBQUUsRUFBRTtZQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7U0FDMUQ7SUFDTCxDQUFDOzhHQVpRLHFCQUFxQjtrR0FBckIscUJBQXFCOzsyRkFBckIscUJBQXFCO2tCQUhqQyxTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxvQkFBb0I7aUJBQ2pDO2tHQUdVLE9BQU87c0JBRGIsS0FBSzt1QkFBQyxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgR3JpZFNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvZ3JpZC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBFZGl0YWJsZU9wdGlvbnMgfSBmcm9tIFwiLi4vbW9kZWxzL0VkaXRhYmxlT3B0aW9uc1wiO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogXCJbbW9uYUdyaWRFZGl0YWJsZV1cIlxufSlcbmV4cG9ydCBjbGFzcyBHcmlkRWRpdGFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBJbnB1dChcIm1vbmFHcmlkRWRpdGFibGVcIilcbiAgICBwdWJsaWMgb3B0aW9ucz86IEVkaXRhYmxlT3B0aW9ucyB8IFwiXCI7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBncmlkU2VydmljZTogR3JpZFNlcnZpY2UpIHt9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFNlcnZpY2Uuc2V0RWRpdGFibGVPcHRpb25zKHRoaXMub3B0aW9ucyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zID09PSBcIlwiKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLnNldEVkaXRhYmxlT3B0aW9ucyh7IGVuYWJsZWQ6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=