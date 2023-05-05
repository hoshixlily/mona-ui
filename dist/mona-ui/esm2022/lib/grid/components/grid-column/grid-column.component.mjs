import { Component, ContentChild, Input } from "@angular/core";
import { Column } from "../../models/Column";
import { GridCellTemplateDirective } from "../../directives/grid-cell-template.directive";
import * as i0 from "@angular/core";
export class GridColumnComponent {
    set cellTemplate(value) {
        this.column.cellTemplate = value;
    }
    set field(value) {
        this.column.field = value;
    }
    set filterType(value) {
        this.column.filterType = value;
    }
    set maxWidth(value) {
        this.column.maxWidth = value;
    }
    set minWidth(value) {
        this.column.minWidth = value;
    }
    set title(value) {
        this.column.title = value;
    }
    set width(value) {
        this.column.width = value;
    }
    constructor() {
        this.column = new Column();
    }
    ngOnInit() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridColumnComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: GridColumnComponent, selector: "mona-grid-column", inputs: { field: "field", filterType: "filterType", maxWidth: "maxWidth", minWidth: "minWidth", title: "title", width: "width" }, queries: [{ propertyName: "cellTemplate", first: true, predicate: GridCellTemplateDirective, descendants: true }], ngImport: i0, template: "", isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridColumnComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-grid-column", template: "" }]
        }], ctorParameters: function () { return []; }, propDecorators: { cellTemplate: [{
                type: ContentChild,
                args: [GridCellTemplateDirective]
            }], field: [{
                type: Input
            }], filterType: [{
                type: Input
            }], maxWidth: [{
                type: Input
            }], minWidth: [{
                type: Input
            }], title: [{
                type: Input
            }], width: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1jb2x1bW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2dyaWQvY29tcG9uZW50cy9ncmlkLWNvbHVtbi9ncmlkLWNvbHVtbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQzs7QUFRMUYsTUFBTSxPQUFPLG1CQUFtQjtJQUc1QixJQUNXLFlBQVksQ0FBQyxLQUFnQztRQUNwRCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDckMsQ0FBQztJQUVELElBQ1csS0FBSyxDQUFDLEtBQWE7UUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUNXLFVBQVUsQ0FBQyxLQUFzQjtRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDbkMsQ0FBQztJQUVELElBQ1csUUFBUSxDQUFDLEtBQWE7UUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxJQUNXLFFBQVEsQ0FBQyxLQUFhO1FBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFDVyxLQUFLLENBQUMsS0FBYTtRQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUVELElBQ1csS0FBSyxDQUFDLEtBQWE7UUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQzlCLENBQUM7SUFFRDtRQXJDTyxXQUFNLEdBQVcsSUFBSSxNQUFNLEVBQUUsQ0FBQztJQXFDZixDQUFDO0lBRWhCLFFBQVEsS0FBVSxDQUFDOzhHQXhDakIsbUJBQW1CO2tHQUFuQixtQkFBbUIsb09BR2QseUJBQXlCLGdEQU43QixFQUFFOzsyRkFHSCxtQkFBbUI7a0JBTC9CLFNBQVM7K0JBQ0ksa0JBQWtCLFlBQ2xCLEVBQUU7MEVBT0QsWUFBWTtzQkFEdEIsWUFBWTt1QkFBQyx5QkFBeUI7Z0JBTTVCLEtBQUs7c0JBRGYsS0FBSztnQkFNSyxVQUFVO3NCQURwQixLQUFLO2dCQU1LLFFBQVE7c0JBRGxCLEtBQUs7Z0JBTUssUUFBUTtzQkFEbEIsS0FBSztnQkFNSyxLQUFLO3NCQURmLEtBQUs7Z0JBTUssS0FBSztzQkFEZixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIElucHV0LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQ29sdW1uIH0gZnJvbSBcIi4uLy4uL21vZGVscy9Db2x1bW5cIjtcbmltcG9ydCB7IEdyaWRDZWxsVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi4vLi4vZGlyZWN0aXZlcy9ncmlkLWNlbGwtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBGaWx0ZXJGaWVsZFR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vZmlsdGVyL21vZGVscy9GaWx0ZXJGaWVsZFR5cGVcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibW9uYS1ncmlkLWNvbHVtblwiLFxuICAgIHRlbXBsYXRlOiBcIlwiLFxuICAgIHN0eWxlVXJsczogW11cbn0pXG5leHBvcnQgY2xhc3MgR3JpZENvbHVtbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcHVibGljIGNvbHVtbjogQ29sdW1uID0gbmV3IENvbHVtbigpO1xuXG4gICAgQENvbnRlbnRDaGlsZChHcmlkQ2VsbFRlbXBsYXRlRGlyZWN0aXZlKVxuICAgIHB1YmxpYyBzZXQgY2VsbFRlbXBsYXRlKHZhbHVlOiBHcmlkQ2VsbFRlbXBsYXRlRGlyZWN0aXZlKSB7XG4gICAgICAgIHRoaXMuY29sdW1uLmNlbGxUZW1wbGF0ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBmaWVsZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY29sdW1uLmZpZWxkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IGZpbHRlclR5cGUodmFsdWU6IEZpbHRlckZpZWxkVHlwZSkge1xuICAgICAgICB0aGlzLmNvbHVtbi5maWx0ZXJUeXBlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IG1heFdpZHRoKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5jb2x1bW4ubWF4V2lkdGggPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgbWluV2lkdGgodmFsdWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLmNvbHVtbi5taW5XaWR0aCA9IHZhbHVlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCB0aXRsZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY29sdW1uLnRpdGxlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2V0IHdpZHRoKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5jb2x1bW4ud2lkdGggPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge31cbn1cbiJdfQ==