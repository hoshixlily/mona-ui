import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GridComponent } from "./components/grid/grid.component";
import { GridListComponent } from "./components/grid-list/grid-list.component";
import { GridColumnResizeHandlerDirective } from "./directives/grid-column-resize-handler.directive";
import { GridFilterMenuComponent } from "./components/grid-filter-menu/grid-filter-menu.component";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { GridFilterPipe } from "./pipes/grid-filter.pipe";
import { PagerModule } from "../pager/pager.module";
import { SlicePipe } from "../pipes/slice.pipe";
import { GridPagePipe } from "./pipes/grid-page.pipe";
import { GridColumnComponent } from "./components/grid-column/grid-column.component";
import { GridCellTemplateDirective } from "./directives/grid-cell-template.directive";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { GridGroupPipe } from "./pipes/grid-group.pipe";
import { ChipModule } from "../buttons/modules/chip/chip.module";
import { GridSelectableDirective } from "./directives/grid-selectable.directive";
import { GridCellComponent } from "./components/grid-cell/grid-cell.component";
import { TextBoxModule } from "../inputs/modules/text-box/text-box.module";
import { ReactiveFormsModule } from "@angular/forms";
import { NumericTextBoxModule } from "../inputs/modules/numeric-text-box/numeric-text-box.module";
import { A11yModule } from "@angular/cdk/a11y";
import { DatePickerModule } from "../date-inputs/modules/date-picker/date-picker.module";
import { CheckBoxModule } from "../inputs/modules/check-box/check-box.module";
import { GridEditableDirective } from "./directives/grid-editable.directive";
import * as i0 from "@angular/core";
export class GridModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: GridModule, declarations: [GridComponent,
            GridListComponent,
            GridColumnResizeHandlerDirective,
            GridFilterMenuComponent,
            GridFilterPipe,
            GridPagePipe,
            GridColumnComponent,
            GridCellTemplateDirective,
            GridGroupPipe,
            GridSelectableDirective,
            GridCellComponent,
            GridEditableDirective], imports: [CommonModule,
            ButtonModule,
            FontAwesomeModule,
            PagerModule,
            SlicePipe,
            DragDropModule,
            ChipModule,
            TextBoxModule,
            ReactiveFormsModule,
            NumericTextBoxModule,
            A11yModule,
            DatePickerModule,
            CheckBoxModule], exports: [GridComponent,
            GridColumnComponent,
            GridCellTemplateDirective,
            GridEditableDirective,
            GridSelectableDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridModule, imports: [CommonModule,
            ButtonModule,
            FontAwesomeModule,
            PagerModule,
            DragDropModule,
            ChipModule,
            TextBoxModule,
            ReactiveFormsModule,
            NumericTextBoxModule,
            A11yModule,
            DatePickerModule,
            CheckBoxModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        GridComponent,
                        GridListComponent,
                        GridColumnResizeHandlerDirective,
                        GridFilterMenuComponent,
                        GridFilterPipe,
                        GridPagePipe,
                        GridColumnComponent,
                        GridCellTemplateDirective,
                        GridGroupPipe,
                        GridSelectableDirective,
                        GridCellComponent,
                        GridEditableDirective
                    ],
                    imports: [
                        CommonModule,
                        ButtonModule,
                        FontAwesomeModule,
                        PagerModule,
                        SlicePipe,
                        DragDropModule,
                        ChipModule,
                        TextBoxModule,
                        ReactiveFormsModule,
                        NumericTextBoxModule,
                        A11yModule,
                        DatePickerModule,
                        CheckBoxModule
                    ],
                    exports: [
                        GridComponent,
                        GridColumnComponent,
                        GridCellTemplateDirective,
                        GridEditableDirective,
                        GridSelectableDirective
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZ3JpZC9ncmlkLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDakUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDL0UsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0sbURBQW1ELENBQUM7QUFDckcsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDbkcsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDcEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN0RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUNyRixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUN0RixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNqRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNqRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUMvRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDM0UsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDbEcsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUM5RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQzs7QUF3QzdFLE1BQU0sT0FBTyxVQUFVOzhHQUFWLFVBQVU7K0dBQVYsVUFBVSxpQkFwQ2YsYUFBYTtZQUNiLGlCQUFpQjtZQUNqQixnQ0FBZ0M7WUFDaEMsdUJBQXVCO1lBQ3ZCLGNBQWM7WUFDZCxZQUFZO1lBQ1osbUJBQW1CO1lBQ25CLHlCQUF5QjtZQUN6QixhQUFhO1lBQ2IsdUJBQXVCO1lBQ3ZCLGlCQUFpQjtZQUNqQixxQkFBcUIsYUFHckIsWUFBWTtZQUNaLFlBQVk7WUFDWixpQkFBaUI7WUFDakIsV0FBVztZQUNYLFNBQVM7WUFDVCxjQUFjO1lBQ2QsVUFBVTtZQUNWLGFBQWE7WUFDYixtQkFBbUI7WUFDbkIsb0JBQW9CO1lBQ3BCLFVBQVU7WUFDVixnQkFBZ0I7WUFDaEIsY0FBYyxhQUdkLGFBQWE7WUFDYixtQkFBbUI7WUFDbkIseUJBQXlCO1lBQ3pCLHFCQUFxQjtZQUNyQix1QkFBdUI7K0dBR2xCLFVBQVUsWUF0QmYsWUFBWTtZQUNaLFlBQVk7WUFDWixpQkFBaUI7WUFDakIsV0FBVztZQUVYLGNBQWM7WUFDZCxVQUFVO1lBQ1YsYUFBYTtZQUNiLG1CQUFtQjtZQUNuQixvQkFBb0I7WUFDcEIsVUFBVTtZQUNWLGdCQUFnQjtZQUNoQixjQUFjOzsyRkFVVCxVQUFVO2tCQXRDdEIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1YsYUFBYTt3QkFDYixpQkFBaUI7d0JBQ2pCLGdDQUFnQzt3QkFDaEMsdUJBQXVCO3dCQUN2QixjQUFjO3dCQUNkLFlBQVk7d0JBQ1osbUJBQW1CO3dCQUNuQix5QkFBeUI7d0JBQ3pCLGFBQWE7d0JBQ2IsdUJBQXVCO3dCQUN2QixpQkFBaUI7d0JBQ2pCLHFCQUFxQjtxQkFDeEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLFlBQVk7d0JBQ1osWUFBWTt3QkFDWixpQkFBaUI7d0JBQ2pCLFdBQVc7d0JBQ1gsU0FBUzt3QkFDVCxjQUFjO3dCQUNkLFVBQVU7d0JBQ1YsYUFBYTt3QkFDYixtQkFBbUI7d0JBQ25CLG9CQUFvQjt3QkFDcEIsVUFBVTt3QkFDVixnQkFBZ0I7d0JBQ2hCLGNBQWM7cUJBQ2pCO29CQUNELE9BQU8sRUFBRTt3QkFDTCxhQUFhO3dCQUNiLG1CQUFtQjt3QkFDbkIseUJBQXlCO3dCQUN6QixxQkFBcUI7d0JBQ3JCLHVCQUF1QjtxQkFDMUI7aUJBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBHcmlkQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9ncmlkL2dyaWQuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBHcmlkTGlzdENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvZ3JpZC1saXN0L2dyaWQtbGlzdC5jb21wb25lbnRcIjtcbmltcG9ydCB7IEdyaWRDb2x1bW5SZXNpemVIYW5kbGVyRGlyZWN0aXZlIH0gZnJvbSBcIi4vZGlyZWN0aXZlcy9ncmlkLWNvbHVtbi1yZXNpemUtaGFuZGxlci5kaXJlY3RpdmVcIjtcbmltcG9ydCB7IEdyaWRGaWx0ZXJNZW51Q29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9ncmlkLWZpbHRlci1tZW51L2dyaWQtZmlsdGVyLW1lbnUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBCdXR0b25Nb2R1bGUgfSBmcm9tIFwiLi4vYnV0dG9ucy9tb2R1bGVzL2J1dHRvbi9idXR0b24ubW9kdWxlXCI7XG5pbXBvcnQgeyBGb250QXdlc29tZU1vZHVsZSB9IGZyb20gXCJAZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZVwiO1xuaW1wb3J0IHsgR3JpZEZpbHRlclBpcGUgfSBmcm9tIFwiLi9waXBlcy9ncmlkLWZpbHRlci5waXBlXCI7XG5pbXBvcnQgeyBQYWdlck1vZHVsZSB9IGZyb20gXCIuLi9wYWdlci9wYWdlci5tb2R1bGVcIjtcbmltcG9ydCB7IFNsaWNlUGlwZSB9IGZyb20gXCIuLi9waXBlcy9zbGljZS5waXBlXCI7XG5pbXBvcnQgeyBHcmlkUGFnZVBpcGUgfSBmcm9tIFwiLi9waXBlcy9ncmlkLXBhZ2UucGlwZVwiO1xuaW1wb3J0IHsgR3JpZENvbHVtbkNvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvZ3JpZC1jb2x1bW4vZ3JpZC1jb2x1bW4uY29tcG9uZW50XCI7XG5pbXBvcnQgeyBHcmlkQ2VsbFRlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSBcIi4vZGlyZWN0aXZlcy9ncmlkLWNlbGwtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBEcmFnRHJvcE1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jZGsvZHJhZy1kcm9wXCI7XG5pbXBvcnQgeyBHcmlkR3JvdXBQaXBlIH0gZnJvbSBcIi4vcGlwZXMvZ3JpZC1ncm91cC5waXBlXCI7XG5pbXBvcnQgeyBDaGlwTW9kdWxlIH0gZnJvbSBcIi4uL2J1dHRvbnMvbW9kdWxlcy9jaGlwL2NoaXAubW9kdWxlXCI7XG5pbXBvcnQgeyBHcmlkU2VsZWN0YWJsZURpcmVjdGl2ZSB9IGZyb20gXCIuL2RpcmVjdGl2ZXMvZ3JpZC1zZWxlY3RhYmxlLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgR3JpZENlbGxDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL2dyaWQtY2VsbC9ncmlkLWNlbGwuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBUZXh0Qm94TW9kdWxlIH0gZnJvbSBcIi4uL2lucHV0cy9tb2R1bGVzL3RleHQtYm94L3RleHQtYm94Lm1vZHVsZVwiO1xuaW1wb3J0IHsgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xuaW1wb3J0IHsgTnVtZXJpY1RleHRCb3hNb2R1bGUgfSBmcm9tIFwiLi4vaW5wdXRzL21vZHVsZXMvbnVtZXJpYy10ZXh0LWJveC9udW1lcmljLXRleHQtYm94Lm1vZHVsZVwiO1xuaW1wb3J0IHsgQTExeU1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jZGsvYTExeVwiO1xuaW1wb3J0IHsgRGF0ZVBpY2tlck1vZHVsZSB9IGZyb20gXCIuLi9kYXRlLWlucHV0cy9tb2R1bGVzL2RhdGUtcGlja2VyL2RhdGUtcGlja2VyLm1vZHVsZVwiO1xuaW1wb3J0IHsgQ2hlY2tCb3hNb2R1bGUgfSBmcm9tIFwiLi4vaW5wdXRzL21vZHVsZXMvY2hlY2stYm94L2NoZWNrLWJveC5tb2R1bGVcIjtcbmltcG9ydCB7IEdyaWRFZGl0YWJsZURpcmVjdGl2ZSB9IGZyb20gXCIuL2RpcmVjdGl2ZXMvZ3JpZC1lZGl0YWJsZS5kaXJlY3RpdmVcIjtcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgR3JpZENvbXBvbmVudCxcbiAgICAgICAgR3JpZExpc3RDb21wb25lbnQsXG4gICAgICAgIEdyaWRDb2x1bW5SZXNpemVIYW5kbGVyRGlyZWN0aXZlLFxuICAgICAgICBHcmlkRmlsdGVyTWVudUNvbXBvbmVudCxcbiAgICAgICAgR3JpZEZpbHRlclBpcGUsXG4gICAgICAgIEdyaWRQYWdlUGlwZSxcbiAgICAgICAgR3JpZENvbHVtbkNvbXBvbmVudCxcbiAgICAgICAgR3JpZENlbGxUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgR3JpZEdyb3VwUGlwZSxcbiAgICAgICAgR3JpZFNlbGVjdGFibGVEaXJlY3RpdmUsXG4gICAgICAgIEdyaWRDZWxsQ29tcG9uZW50LFxuICAgICAgICBHcmlkRWRpdGFibGVEaXJlY3RpdmVcbiAgICBdLFxuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgICAgICBCdXR0b25Nb2R1bGUsXG4gICAgICAgIEZvbnRBd2Vzb21lTW9kdWxlLFxuICAgICAgICBQYWdlck1vZHVsZSxcbiAgICAgICAgU2xpY2VQaXBlLFxuICAgICAgICBEcmFnRHJvcE1vZHVsZSxcbiAgICAgICAgQ2hpcE1vZHVsZSxcbiAgICAgICAgVGV4dEJveE1vZHVsZSxcbiAgICAgICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICAgICAgTnVtZXJpY1RleHRCb3hNb2R1bGUsXG4gICAgICAgIEExMXlNb2R1bGUsXG4gICAgICAgIERhdGVQaWNrZXJNb2R1bGUsXG4gICAgICAgIENoZWNrQm94TW9kdWxlXG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIEdyaWRDb21wb25lbnQsXG4gICAgICAgIEdyaWRDb2x1bW5Db21wb25lbnQsXG4gICAgICAgIEdyaWRDZWxsVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIEdyaWRFZGl0YWJsZURpcmVjdGl2ZSxcbiAgICAgICAgR3JpZFNlbGVjdGFibGVEaXJlY3RpdmVcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIEdyaWRNb2R1bGUge31cbiJdfQ==