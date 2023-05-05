import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComboBoxComponent } from "./components/combo-box/combo-box.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { PopupListComponent } from "../../components/popup-list/popup-list.component";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { ListGroupTemplateDirective } from "../../directives/list-group-template.directive";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { FormsModule } from "@angular/forms";
import { ComboBoxGroupTemplateDirective } from "./directives/combo-box-group-template.directive";
import { ComboBoxItemTemplateDirective } from "./directives/combo-box-item-template.directive";
import * as i0 from "@angular/core";
export class ComboBoxModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxModule, declarations: [ComboBoxComponent, ComboBoxGroupTemplateDirective, ComboBoxItemTemplateDirective], imports: [CommonModule,
            FontAwesomeModule,
            ButtonModule,
            PopupListComponent,
            ListItemTemplateDirective,
            ListGroupTemplateDirective,
            TextBoxModule,
            FormsModule], exports: [ComboBoxComponent, ComboBoxGroupTemplateDirective, ComboBoxItemTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxModule, imports: [CommonModule,
            FontAwesomeModule,
            ButtonModule,
            PopupListComponent,
            TextBoxModule,
            FormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ComboBoxComponent, ComboBoxGroupTemplateDirective, ComboBoxItemTemplateDirective],
                    imports: [
                        CommonModule,
                        FontAwesomeModule,
                        ButtonModule,
                        PopupListComponent,
                        ListItemTemplateDirective,
                        ListGroupTemplateDirective,
                        TextBoxModule,
                        FormsModule
                    ],
                    exports: [ComboBoxComponent, ComboBoxGroupTemplateDirective, ComboBoxItemTemplateDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYm8tYm94Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9kcm9wZG93bnMvbW9kdWxlcy9jb21iby1ib3gvY29tYm8tYm94Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUMvRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDdEYsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDMUYsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDNUYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUNqRyxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQzs7QUFnQi9GLE1BQU0sT0FBTyxjQUFjOzhHQUFkLGNBQWM7K0dBQWQsY0FBYyxpQkFiUixpQkFBaUIsRUFBRSw4QkFBOEIsRUFBRSw2QkFBNkIsYUFFM0YsWUFBWTtZQUNaLGlCQUFpQjtZQUNqQixZQUFZO1lBQ1osa0JBQWtCO1lBQ2xCLHlCQUF5QjtZQUN6QiwwQkFBMEI7WUFDMUIsYUFBYTtZQUNiLFdBQVcsYUFFTCxpQkFBaUIsRUFBRSw4QkFBOEIsRUFBRSw2QkFBNkI7K0dBRWpGLGNBQWMsWUFYbkIsWUFBWTtZQUNaLGlCQUFpQjtZQUNqQixZQUFZO1lBQ1osa0JBQWtCO1lBR2xCLGFBQWE7WUFDYixXQUFXOzsyRkFJTixjQUFjO2tCQWQxQixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRSxDQUFDLGlCQUFpQixFQUFFLDhCQUE4QixFQUFFLDZCQUE2QixDQUFDO29CQUNoRyxPQUFPLEVBQUU7d0JBQ0wsWUFBWTt3QkFDWixpQkFBaUI7d0JBQ2pCLFlBQVk7d0JBQ1osa0JBQWtCO3dCQUNsQix5QkFBeUI7d0JBQ3pCLDBCQUEwQjt3QkFDMUIsYUFBYTt3QkFDYixXQUFXO3FCQUNkO29CQUNELE9BQU8sRUFBRSxDQUFDLGlCQUFpQixFQUFFLDhCQUE4QixFQUFFLDZCQUE2QixDQUFDO2lCQUM5RiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IENvbWJvQm94Q29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9jb21iby1ib3gvY29tYm8tYm94LmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgRm9udEF3ZXNvbWVNb2R1bGUgfSBmcm9tIFwiQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWVcIjtcbmltcG9ydCB7IEJ1dHRvbk1vZHVsZSB9IGZyb20gXCIuLi8uLi8uLi9idXR0b25zL21vZHVsZXMvYnV0dG9uL2J1dHRvbi5tb2R1bGVcIjtcbmltcG9ydCB7IFBvcHVwTGlzdENvbXBvbmVudCB9IGZyb20gXCIuLi8uLi9jb21wb25lbnRzL3BvcHVwLWxpc3QvcG9wdXAtbGlzdC5jb21wb25lbnRcIjtcbmltcG9ydCB7IExpc3RJdGVtVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi4vLi4vZGlyZWN0aXZlcy9saXN0LWl0ZW0tdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBMaXN0R3JvdXBUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gXCIuLi8uLi9kaXJlY3RpdmVzL2xpc3QtZ3JvdXAtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBUZXh0Qm94TW9kdWxlIH0gZnJvbSBcIi4uLy4uLy4uL2lucHV0cy9tb2R1bGVzL3RleHQtYm94L3RleHQtYm94Lm1vZHVsZVwiO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IENvbWJvQm94R3JvdXBUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gXCIuL2RpcmVjdGl2ZXMvY29tYm8tYm94LWdyb3VwLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgQ29tYm9Cb3hJdGVtVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL2NvbWJvLWJveC1pdGVtLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW0NvbWJvQm94Q29tcG9uZW50LCBDb21ib0JveEdyb3VwVGVtcGxhdGVEaXJlY3RpdmUsIENvbWJvQm94SXRlbVRlbXBsYXRlRGlyZWN0aXZlXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgRm9udEF3ZXNvbWVNb2R1bGUsXG4gICAgICAgIEJ1dHRvbk1vZHVsZSxcbiAgICAgICAgUG9wdXBMaXN0Q29tcG9uZW50LFxuICAgICAgICBMaXN0SXRlbVRlbXBsYXRlRGlyZWN0aXZlLFxuICAgICAgICBMaXN0R3JvdXBUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgVGV4dEJveE1vZHVsZSxcbiAgICAgICAgRm9ybXNNb2R1bGVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtDb21ib0JveENvbXBvbmVudCwgQ29tYm9Cb3hHcm91cFRlbXBsYXRlRGlyZWN0aXZlLCBDb21ib0JveEl0ZW1UZW1wbGF0ZURpcmVjdGl2ZV1cbn0pXG5leHBvcnQgY2xhc3MgQ29tYm9Cb3hNb2R1bGUge31cbiJdfQ==