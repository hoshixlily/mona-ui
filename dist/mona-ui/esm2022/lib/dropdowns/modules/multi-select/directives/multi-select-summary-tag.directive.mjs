import { ContentChild, Directive, Input, TemplateRef } from "@angular/core";
import { MultiSelectSummaryTagTemplateDirective } from "./multi-select-summary-tag-template.directive";
import * as i0 from "@angular/core";
import * as i1 from "../components/multi-select/multi-select.component";
export class MultiSelectSummaryTagDirective {
    constructor(host) {
        this.host = host;
        this.summaryTagTemplate = null;
        this.tagCount = 0;
    }
    ngAfterContentInit() {
        this.host.summaryTagTemplate = this.summaryTagTemplate;
    }
    ngOnInit() {
        this.host.tagCount = this.tagCount;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectSummaryTagDirective, deps: [{ token: i1.MultiSelectComponent }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MultiSelectSummaryTagDirective, selector: "[monaMultiSelectSummaryTag]", inputs: { tagCount: ["monaMultiSelectSummaryTag", "tagCount"] }, queries: [{ propertyName: "summaryTagTemplate", first: true, predicate: MultiSelectSummaryTagTemplateDirective, descendants: true, read: TemplateRef }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectSummaryTagDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[monaMultiSelectSummaryTag]"
                }]
        }], ctorParameters: function () { return [{ type: i1.MultiSelectComponent }]; }, propDecorators: { summaryTagTemplate: [{
                type: ContentChild,
                args: [MultiSelectSummaryTagTemplateDirective, { read: TemplateRef }]
            }], tagCount: [{
                type: Input,
                args: ["monaMultiSelectSummaryTag"]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGktc2VsZWN0LXN1bW1hcnktdGFnLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9kcm9wZG93bnMvbW9kdWxlcy9tdWx0aS1zZWxlY3QvZGlyZWN0aXZlcy9tdWx0aS1zZWxlY3Qtc3VtbWFyeS10YWcuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBb0IsWUFBWSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXRHLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxNQUFNLCtDQUErQyxDQUFDOzs7QUFLdkcsTUFBTSxPQUFPLDhCQUE4QjtJQU92QyxZQUFvQyxJQUEwQjtRQUExQixTQUFJLEdBQUosSUFBSSxDQUFzQjtRQUx2RCx1QkFBa0IsR0FBNEIsSUFBSSxDQUFDO1FBR25ELGFBQVEsR0FBVyxDQUFDLENBQUM7SUFFcUMsQ0FBQztJQUUzRCxrQkFBa0I7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7SUFDM0QsQ0FBQztJQUVNLFFBQVE7UUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZDLENBQUM7OEdBZlEsOEJBQThCO2tHQUE5Qiw4QkFBOEIsb0xBQ3pCLHNDQUFzQywyQkFBVSxXQUFXOzsyRkFEaEUsOEJBQThCO2tCQUgxQyxTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSw2QkFBNkI7aUJBQzFDOzJHQUdVLGtCQUFrQjtzQkFEeEIsWUFBWTt1QkFBQyxzQ0FBc0MsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7Z0JBSXBFLFFBQVE7c0JBRGQsS0FBSzt1QkFBQywyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlckNvbnRlbnRJbml0LCBDb250ZW50Q2hpbGQsIERpcmVjdGl2ZSwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgTXVsdGlTZWxlY3RDb21wb25lbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9tdWx0aS1zZWxlY3QvbXVsdGktc2VsZWN0LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgTXVsdGlTZWxlY3RTdW1tYXJ5VGFnVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9tdWx0aS1zZWxlY3Qtc3VtbWFyeS10YWctdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiBcIlttb25hTXVsdGlTZWxlY3RTdW1tYXJ5VGFnXVwiXG59KVxuZXhwb3J0IGNsYXNzIE11bHRpU2VsZWN0U3VtbWFyeVRhZ0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCB7XG4gICAgQENvbnRlbnRDaGlsZChNdWx0aVNlbGVjdFN1bW1hcnlUYWdUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICAgIHB1YmxpYyBzdW1tYXJ5VGFnVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gfCBudWxsID0gbnVsbDtcblxuICAgIEBJbnB1dChcIm1vbmFNdWx0aVNlbGVjdFN1bW1hcnlUYWdcIilcbiAgICBwdWJsaWMgdGFnQ291bnQ6IG51bWJlciA9IDA7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBob3N0OiBNdWx0aVNlbGVjdENvbXBvbmVudCkge31cblxuICAgIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaG9zdC5zdW1tYXJ5VGFnVGVtcGxhdGUgPSB0aGlzLnN1bW1hcnlUYWdUZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaG9zdC50YWdDb3VudCA9IHRoaXMudGFnQ291bnQ7XG4gICAgfVxufVxuIl19