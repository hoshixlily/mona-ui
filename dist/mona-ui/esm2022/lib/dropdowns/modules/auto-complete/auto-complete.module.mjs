import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AutoCompleteComponent } from "./components/auto-complete/auto-complete.component";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { PopupListComponent } from "../../components/popup-list/popup-list.component";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { ListGroupTemplateDirective } from "../../directives/list-group-template.directive";
import * as i0 from "@angular/core";
export class AutoCompleteModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AutoCompleteModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: AutoCompleteModule, declarations: [AutoCompleteComponent], imports: [CommonModule,
            TextBoxModule,
            FormsModule,
            ButtonModule,
            FontAwesomeModule,
            PopupListComponent,
            ListItemTemplateDirective,
            ListGroupTemplateDirective], exports: [AutoCompleteComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AutoCompleteModule, imports: [CommonModule,
            TextBoxModule,
            FormsModule,
            ButtonModule,
            FontAwesomeModule,
            PopupListComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AutoCompleteModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [AutoCompleteComponent],
                    imports: [
                        CommonModule,
                        TextBoxModule,
                        FormsModule,
                        ButtonModule,
                        FontAwesomeModule,
                        PopupListComponent,
                        ListItemTemplateDirective,
                        ListGroupTemplateDirective
                    ],
                    exports: [AutoCompleteComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1jb21wbGV0ZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZHJvcGRvd25zL21vZHVsZXMvYXV0by1jb21wbGV0ZS9hdXRvLWNvbXBsZXRlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUMzRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDakYsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUM3RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUN0RixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUMxRixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQzs7QUFnQjVGLE1BQU0sT0FBTyxrQkFBa0I7OEdBQWxCLGtCQUFrQjsrR0FBbEIsa0JBQWtCLGlCQWJaLHFCQUFxQixhQUVoQyxZQUFZO1lBQ1osYUFBYTtZQUNiLFdBQVc7WUFDWCxZQUFZO1lBQ1osaUJBQWlCO1lBQ2pCLGtCQUFrQjtZQUNsQix5QkFBeUI7WUFDekIsMEJBQTBCLGFBRXBCLHFCQUFxQjsrR0FFdEIsa0JBQWtCLFlBWHZCLFlBQVk7WUFDWixhQUFhO1lBQ2IsV0FBVztZQUNYLFlBQVk7WUFDWixpQkFBaUI7WUFDakIsa0JBQWtCOzsyRkFNYixrQkFBa0I7a0JBZDlCLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFLENBQUMscUJBQXFCLENBQUM7b0JBQ3JDLE9BQU8sRUFBRTt3QkFDTCxZQUFZO3dCQUNaLGFBQWE7d0JBQ2IsV0FBVzt3QkFDWCxZQUFZO3dCQUNaLGlCQUFpQjt3QkFDakIsa0JBQWtCO3dCQUNsQix5QkFBeUI7d0JBQ3pCLDBCQUEwQjtxQkFDN0I7b0JBQ0QsT0FBTyxFQUFFLENBQUMscUJBQXFCLENBQUM7aUJBQ25DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuaW1wb3J0IHsgQXV0b0NvbXBsZXRlQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9hdXRvLWNvbXBsZXRlL2F1dG8tY29tcGxldGUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBUZXh0Qm94TW9kdWxlIH0gZnJvbSBcIi4uLy4uLy4uL2lucHV0cy9tb2R1bGVzL3RleHQtYm94L3RleHQtYm94Lm1vZHVsZVwiO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IEJ1dHRvbk1vZHVsZSB9IGZyb20gXCIuLi8uLi8uLi9idXR0b25zL21vZHVsZXMvYnV0dG9uL2J1dHRvbi5tb2R1bGVcIjtcbmltcG9ydCB7IEZvbnRBd2Vzb21lTW9kdWxlIH0gZnJvbSBcIkBmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lXCI7XG5pbXBvcnQgeyBQb3B1cExpc3RDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vY29tcG9uZW50cy9wb3B1cC1saXN0L3BvcHVwLWxpc3QuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBMaXN0SXRlbVRlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSBcIi4uLy4uL2RpcmVjdGl2ZXMvbGlzdC1pdGVtLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgTGlzdEdyb3VwVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi4vLi4vZGlyZWN0aXZlcy9saXN0LWdyb3VwLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW0F1dG9Db21wbGV0ZUNvbXBvbmVudF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIFRleHRCb3hNb2R1bGUsXG4gICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICBCdXR0b25Nb2R1bGUsXG4gICAgICAgIEZvbnRBd2Vzb21lTW9kdWxlLFxuICAgICAgICBQb3B1cExpc3RDb21wb25lbnQsXG4gICAgICAgIExpc3RJdGVtVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIExpc3RHcm91cFRlbXBsYXRlRGlyZWN0aXZlXG4gICAgXSxcbiAgICBleHBvcnRzOiBbQXV0b0NvbXBsZXRlQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBBdXRvQ29tcGxldGVNb2R1bGUge31cbiJdfQ==