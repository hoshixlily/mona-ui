import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenubarComponent } from "./components/menubar/menubar.component";
import { MenuComponent } from "./components/menu/menu.component";
import { ContextMenuModule } from "../context-menu/context-menu.module";
import { MenuTextTemplateDirective } from "./directives/menu-text-template.directive";
import * as i0 from "@angular/core";
export class MenubarModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenubarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MenubarModule, declarations: [MenubarComponent, MenuComponent, MenuTextTemplateDirective], imports: [CommonModule, ContextMenuModule], exports: [MenubarComponent, MenuComponent, MenuTextTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenubarModule, imports: [CommonModule, ContextMenuModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenubarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [MenubarComponent, MenuComponent, MenuTextTemplateDirective],
                    imports: [CommonModule, ContextMenuModule],
                    exports: [MenubarComponent, MenuComponent, MenuTextTemplateDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudWJhci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvbWVudXMvbW9kdWxlcy9tZW51YmFyL21lbnViYXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNqRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN4RSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQzs7QUFPdEYsTUFBTSxPQUFPLGFBQWE7OEdBQWIsYUFBYTsrR0FBYixhQUFhLGlCQUpQLGdCQUFnQixFQUFFLGFBQWEsRUFBRSx5QkFBeUIsYUFDL0QsWUFBWSxFQUFFLGlCQUFpQixhQUMvQixnQkFBZ0IsRUFBRSxhQUFhLEVBQUUseUJBQXlCOytHQUUzRCxhQUFhLFlBSFosWUFBWSxFQUFFLGlCQUFpQjs7MkZBR2hDLGFBQWE7a0JBTHpCLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFLHlCQUF5QixDQUFDO29CQUMxRSxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsaUJBQWlCLENBQUM7b0JBQzFDLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixFQUFFLGFBQWEsRUFBRSx5QkFBeUIsQ0FBQztpQkFDeEUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBNZW51YmFyQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9tZW51YmFyL21lbnViYXIuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBNZW51Q29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9tZW51L21lbnUuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBDb250ZXh0TWVudU1vZHVsZSB9IGZyb20gXCIuLi9jb250ZXh0LW1lbnUvY29udGV4dC1tZW51Lm1vZHVsZVwiO1xuaW1wb3J0IHsgTWVudVRleHRUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gXCIuL2RpcmVjdGl2ZXMvbWVudS10ZXh0LXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW01lbnViYXJDb21wb25lbnQsIE1lbnVDb21wb25lbnQsIE1lbnVUZXh0VGVtcGxhdGVEaXJlY3RpdmVdLFxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIENvbnRleHRNZW51TW9kdWxlXSxcbiAgICBleHBvcnRzOiBbTWVudWJhckNvbXBvbmVudCwgTWVudUNvbXBvbmVudCwgTWVudVRleHRUZW1wbGF0ZURpcmVjdGl2ZV1cbn0pXG5leHBvcnQgY2xhc3MgTWVudWJhck1vZHVsZSB7fVxuIl19