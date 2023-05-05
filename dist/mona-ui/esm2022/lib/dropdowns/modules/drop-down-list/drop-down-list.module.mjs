import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DropDownListComponent } from "./components/drop-down-list/drop-down-list.component";
import { PopupListComponent } from "../../components/popup-list/popup-list.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { DropDownListItemTemplateDirective } from "./directives/drop-down-list-item-template.directive";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { DropDownListValueTemplateDirective } from "./directives/drop-down-list-value-template.directive";
import { DropDownListGroupTemplateDirective } from "./directives/drop-down-list-group-template.directive";
import { ListGroupTemplateDirective } from "../../directives/list-group-template.directive";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import * as i0 from "@angular/core";
export class DropDownListModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: DropDownListModule, declarations: [DropDownListComponent,
            DropDownListItemTemplateDirective,
            DropDownListValueTemplateDirective,
            DropDownListGroupTemplateDirective], imports: [CommonModule,
            PopupListComponent,
            FontAwesomeModule,
            ListItemTemplateDirective,
            ListGroupTemplateDirective,
            ButtonModule], exports: [DropDownListComponent,
            DropDownListItemTemplateDirective,
            DropDownListValueTemplateDirective,
            DropDownListGroupTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownListModule, imports: [CommonModule,
            PopupListComponent,
            FontAwesomeModule,
            ButtonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownListModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        DropDownListComponent,
                        DropDownListItemTemplateDirective,
                        DropDownListValueTemplateDirective,
                        DropDownListGroupTemplateDirective
                    ],
                    imports: [
                        CommonModule,
                        PopupListComponent,
                        FontAwesomeModule,
                        ListItemTemplateDirective,
                        ListGroupTemplateDirective,
                        ButtonModule
                    ],
                    exports: [
                        DropDownListComponent,
                        DropDownListItemTemplateDirective,
                        DropDownListValueTemplateDirective,
                        DropDownListGroupTemplateDirective
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcC1kb3duLWxpc3QubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2Ryb3Bkb3ducy9tb2R1bGVzL2Ryb3AtZG93bi1saXN0L2Ryb3AtZG93bi1saXN0Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUM3RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUN0RixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUN4RyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUMxRixPQUFPLEVBQUUsa0NBQWtDLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUMxRyxPQUFPLEVBQUUsa0NBQWtDLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUMxRyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUM1RixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sK0NBQStDLENBQUM7O0FBd0I3RSxNQUFNLE9BQU8sa0JBQWtCOzhHQUFsQixrQkFBa0I7K0dBQWxCLGtCQUFrQixpQkFwQnZCLHFCQUFxQjtZQUNyQixpQ0FBaUM7WUFDakMsa0NBQWtDO1lBQ2xDLGtDQUFrQyxhQUdsQyxZQUFZO1lBQ1osa0JBQWtCO1lBQ2xCLGlCQUFpQjtZQUNqQix5QkFBeUI7WUFDekIsMEJBQTBCO1lBQzFCLFlBQVksYUFHWixxQkFBcUI7WUFDckIsaUNBQWlDO1lBQ2pDLGtDQUFrQztZQUNsQyxrQ0FBa0M7K0dBRzdCLGtCQUFrQixZQWR2QixZQUFZO1lBQ1osa0JBQWtCO1lBQ2xCLGlCQUFpQjtZQUdqQixZQUFZOzsyRkFTUCxrQkFBa0I7a0JBdEI5QixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRTt3QkFDVixxQkFBcUI7d0JBQ3JCLGlDQUFpQzt3QkFDakMsa0NBQWtDO3dCQUNsQyxrQ0FBa0M7cUJBQ3JDO29CQUNELE9BQU8sRUFBRTt3QkFDTCxZQUFZO3dCQUNaLGtCQUFrQjt3QkFDbEIsaUJBQWlCO3dCQUNqQix5QkFBeUI7d0JBQ3pCLDBCQUEwQjt3QkFDMUIsWUFBWTtxQkFDZjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wscUJBQXFCO3dCQUNyQixpQ0FBaUM7d0JBQ2pDLGtDQUFrQzt3QkFDbEMsa0NBQWtDO3FCQUNyQztpQkFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IERyb3BEb3duTGlzdENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvZHJvcC1kb3duLWxpc3QvZHJvcC1kb3duLWxpc3QuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBQb3B1cExpc3RDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9wb3B1cC1saXN0L3BvcHVwLWxpc3QuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBGb250QXdlc29tZU1vZHVsZSB9IGZyb20gXCJAZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZVwiO1xuaW1wb3J0IHsgRHJvcERvd25MaXN0SXRlbVRlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSBcIi4vZGlyZWN0aXZlcy9kcm9wLWRvd24tbGlzdC1pdGVtLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgTGlzdEl0ZW1UZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gXCIuLi8uLi9kaXJlY3RpdmVzL2xpc3QtaXRlbS10ZW1wbGF0ZS5kaXJlY3RpdmVcIjtcbmltcG9ydCB7IERyb3BEb3duTGlzdFZhbHVlVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL2Ryb3AtZG93bi1saXN0LXZhbHVlLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgRHJvcERvd25MaXN0R3JvdXBUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gXCIuL2RpcmVjdGl2ZXMvZHJvcC1kb3duLWxpc3QtZ3JvdXAtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBMaXN0R3JvdXBUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gXCIuLi8uLi9kaXJlY3RpdmVzL2xpc3QtZ3JvdXAtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBCdXR0b25Nb2R1bGUgfSBmcm9tIFwiLi4vLi4vLi4vYnV0dG9ucy9tb2R1bGVzL2J1dHRvbi9idXR0b24ubW9kdWxlXCI7XG5cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIERyb3BEb3duTGlzdENvbXBvbmVudCxcbiAgICAgICAgRHJvcERvd25MaXN0SXRlbVRlbXBsYXRlRGlyZWN0aXZlLFxuICAgICAgICBEcm9wRG93bkxpc3RWYWx1ZVRlbXBsYXRlRGlyZWN0aXZlLFxuICAgICAgICBEcm9wRG93bkxpc3RHcm91cFRlbXBsYXRlRGlyZWN0aXZlXG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgUG9wdXBMaXN0Q29tcG9uZW50LFxuICAgICAgICBGb250QXdlc29tZU1vZHVsZSxcbiAgICAgICAgTGlzdEl0ZW1UZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgTGlzdEdyb3VwVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIEJ1dHRvbk1vZHVsZVxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBEcm9wRG93bkxpc3RDb21wb25lbnQsXG4gICAgICAgIERyb3BEb3duTGlzdEl0ZW1UZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgRHJvcERvd25MaXN0VmFsdWVUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgRHJvcERvd25MaXN0R3JvdXBUZW1wbGF0ZURpcmVjdGl2ZVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgRHJvcERvd25MaXN0TW9kdWxlIHt9XG4iXX0=