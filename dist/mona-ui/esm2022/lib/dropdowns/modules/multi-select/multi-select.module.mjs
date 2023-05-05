import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MultiSelectComponent } from "./components/multi-select/multi-select.component";
import { ChipModule } from "../../../buttons/modules/chip/chip.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { PopupListComponent } from "../../components/popup-list/popup-list.component";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { ListGroupTemplateDirective } from "../../directives/list-group-template.directive";
import { MultiSelectGroupTemplateDirective } from "./directives/multi-select-group-template.directive";
import { MultiSelectItemTemplateDirective } from "./directives/multi-select-item-template.directive";
import { MultiSelectTagTemplateDirective } from "./directives/multi-select-tag-template.directive";
import { MultiSelectSummaryTagTemplateDirective } from "./directives/multi-select-summary-tag-template.directive";
import { MultiSelectSummaryTagDirective } from "./directives/multi-select-summary-tag.directive";
import * as i0 from "@angular/core";
export class MultiSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectModule, declarations: [MultiSelectComponent,
            MultiSelectGroupTemplateDirective,
            MultiSelectItemTemplateDirective,
            MultiSelectTagTemplateDirective,
            MultiSelectSummaryTagTemplateDirective,
            MultiSelectSummaryTagDirective], imports: [CommonModule,
            ChipModule,
            FontAwesomeModule,
            TextBoxModule,
            PopupListComponent,
            ListItemTemplateDirective,
            ListGroupTemplateDirective], exports: [MultiSelectComponent,
            MultiSelectGroupTemplateDirective,
            MultiSelectItemTemplateDirective,
            MultiSelectTagTemplateDirective,
            MultiSelectSummaryTagDirective,
            MultiSelectSummaryTagTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectModule, imports: [CommonModule,
            ChipModule,
            FontAwesomeModule,
            TextBoxModule,
            PopupListComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        MultiSelectComponent,
                        MultiSelectGroupTemplateDirective,
                        MultiSelectItemTemplateDirective,
                        MultiSelectTagTemplateDirective,
                        MultiSelectSummaryTagTemplateDirective,
                        MultiSelectSummaryTagDirective
                    ],
                    imports: [
                        CommonModule,
                        ChipModule,
                        FontAwesomeModule,
                        TextBoxModule,
                        PopupListComponent,
                        ListItemTemplateDirective,
                        ListGroupTemplateDirective
                    ],
                    exports: [
                        MultiSelectComponent,
                        MultiSelectGroupTemplateDirective,
                        MultiSelectItemTemplateDirective,
                        MultiSelectTagTemplateDirective,
                        MultiSelectSummaryTagDirective,
                        MultiSelectSummaryTagTemplateDirective
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGktc2VsZWN0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9kcm9wZG93bnMvbW9kdWxlcy9tdWx0aS1zZWxlY3QvbXVsdGktc2VsZWN0Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ3RGLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQzFGLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSxpQ0FBaUMsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ3ZHLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQ3JHLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ25HLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBQ2xILE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDOztBQTZCakcsTUFBTSxPQUFPLGlCQUFpQjs4R0FBakIsaUJBQWlCOytHQUFqQixpQkFBaUIsaUJBekJ0QixvQkFBb0I7WUFDcEIsaUNBQWlDO1lBQ2pDLGdDQUFnQztZQUNoQywrQkFBK0I7WUFDL0Isc0NBQXNDO1lBQ3RDLDhCQUE4QixhQUc5QixZQUFZO1lBQ1osVUFBVTtZQUNWLGlCQUFpQjtZQUNqQixhQUFhO1lBQ2Isa0JBQWtCO1lBQ2xCLHlCQUF5QjtZQUN6QiwwQkFBMEIsYUFHMUIsb0JBQW9CO1lBQ3BCLGlDQUFpQztZQUNqQyxnQ0FBZ0M7WUFDaEMsK0JBQStCO1lBQy9CLDhCQUE4QjtZQUM5QixzQ0FBc0M7K0dBR2pDLGlCQUFpQixZQWpCdEIsWUFBWTtZQUNaLFVBQVU7WUFDVixpQkFBaUI7WUFDakIsYUFBYTtZQUNiLGtCQUFrQjs7MkZBYWIsaUJBQWlCO2tCQTNCN0IsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1Ysb0JBQW9CO3dCQUNwQixpQ0FBaUM7d0JBQ2pDLGdDQUFnQzt3QkFDaEMsK0JBQStCO3dCQUMvQixzQ0FBc0M7d0JBQ3RDLDhCQUE4QjtxQkFDakM7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLFlBQVk7d0JBQ1osVUFBVTt3QkFDVixpQkFBaUI7d0JBQ2pCLGFBQWE7d0JBQ2Isa0JBQWtCO3dCQUNsQix5QkFBeUI7d0JBQ3pCLDBCQUEwQjtxQkFDN0I7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLG9CQUFvQjt3QkFDcEIsaUNBQWlDO3dCQUNqQyxnQ0FBZ0M7d0JBQ2hDLCtCQUErQjt3QkFDL0IsOEJBQThCO3dCQUM5QixzQ0FBc0M7cUJBQ3pDO2lCQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuaW1wb3J0IHsgTXVsdGlTZWxlY3RDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL211bHRpLXNlbGVjdC9tdWx0aS1zZWxlY3QuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDaGlwTW9kdWxlIH0gZnJvbSBcIi4uLy4uLy4uL2J1dHRvbnMvbW9kdWxlcy9jaGlwL2NoaXAubW9kdWxlXCI7XG5pbXBvcnQgeyBGb250QXdlc29tZU1vZHVsZSB9IGZyb20gXCJAZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZVwiO1xuaW1wb3J0IHsgVGV4dEJveE1vZHVsZSB9IGZyb20gXCIuLi8uLi8uLi9pbnB1dHMvbW9kdWxlcy90ZXh0LWJveC90ZXh0LWJveC5tb2R1bGVcIjtcbmltcG9ydCB7IFBvcHVwTGlzdENvbXBvbmVudCB9IGZyb20gXCIuLi8uLi9jb21wb25lbnRzL3BvcHVwLWxpc3QvcG9wdXAtbGlzdC5jb21wb25lbnRcIjtcbmltcG9ydCB7IExpc3RJdGVtVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi4vLi4vZGlyZWN0aXZlcy9saXN0LWl0ZW0tdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBMaXN0R3JvdXBUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gXCIuLi8uLi9kaXJlY3RpdmVzL2xpc3QtZ3JvdXAtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBNdWx0aVNlbGVjdEdyb3VwVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL211bHRpLXNlbGVjdC1ncm91cC10ZW1wbGF0ZS5kaXJlY3RpdmVcIjtcbmltcG9ydCB7IE11bHRpU2VsZWN0SXRlbVRlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSBcIi4vZGlyZWN0aXZlcy9tdWx0aS1zZWxlY3QtaXRlbS10ZW1wbGF0ZS5kaXJlY3RpdmVcIjtcbmltcG9ydCB7IE11bHRpU2VsZWN0VGFnVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL211bHRpLXNlbGVjdC10YWctdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBNdWx0aVNlbGVjdFN1bW1hcnlUYWdUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gXCIuL2RpcmVjdGl2ZXMvbXVsdGktc2VsZWN0LXN1bW1hcnktdGFnLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgTXVsdGlTZWxlY3RTdW1tYXJ5VGFnRGlyZWN0aXZlIH0gZnJvbSBcIi4vZGlyZWN0aXZlcy9tdWx0aS1zZWxlY3Qtc3VtbWFyeS10YWcuZGlyZWN0aXZlXCI7XG5cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIE11bHRpU2VsZWN0Q29tcG9uZW50LFxuICAgICAgICBNdWx0aVNlbGVjdEdyb3VwVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIE11bHRpU2VsZWN0SXRlbVRlbXBsYXRlRGlyZWN0aXZlLFxuICAgICAgICBNdWx0aVNlbGVjdFRhZ1RlbXBsYXRlRGlyZWN0aXZlLFxuICAgICAgICBNdWx0aVNlbGVjdFN1bW1hcnlUYWdUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgTXVsdGlTZWxlY3RTdW1tYXJ5VGFnRGlyZWN0aXZlXG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgQ2hpcE1vZHVsZSxcbiAgICAgICAgRm9udEF3ZXNvbWVNb2R1bGUsXG4gICAgICAgIFRleHRCb3hNb2R1bGUsXG4gICAgICAgIFBvcHVwTGlzdENvbXBvbmVudCxcbiAgICAgICAgTGlzdEl0ZW1UZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgTGlzdEdyb3VwVGVtcGxhdGVEaXJlY3RpdmVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgTXVsdGlTZWxlY3RDb21wb25lbnQsXG4gICAgICAgIE11bHRpU2VsZWN0R3JvdXBUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgTXVsdGlTZWxlY3RJdGVtVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIE11bHRpU2VsZWN0VGFnVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIE11bHRpU2VsZWN0U3VtbWFyeVRhZ0RpcmVjdGl2ZSxcbiAgICAgICAgTXVsdGlTZWxlY3RTdW1tYXJ5VGFnVGVtcGxhdGVEaXJlY3RpdmVcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIE11bHRpU2VsZWN0TW9kdWxlIHt9XG4iXX0=