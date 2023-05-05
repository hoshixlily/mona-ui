import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CircularProgressBarComponent } from "./components/circular-progress-bar/circular-progress-bar.component";
import { CircularProgressBarLabelTemplateDirective } from "./directives/circular-progress-bar-label-template.directive";
import * as i0 from "@angular/core";
export class CircularProgressBarModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CircularProgressBarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: CircularProgressBarModule, declarations: [CircularProgressBarComponent, CircularProgressBarLabelTemplateDirective], imports: [CommonModule], exports: [CircularProgressBarComponent, CircularProgressBarLabelTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CircularProgressBarModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CircularProgressBarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [CircularProgressBarComponent, CircularProgressBarLabelTemplateDirective],
                    imports: [CommonModule],
                    exports: [CircularProgressBarComponent, CircularProgressBarLabelTemplateDirective]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY3VsYXItcHJvZ3Jlc3MtYmFyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9wcm9ncmVzcy1iYXJzL21vZHVsZXMvY2lyY3VsYXItcHJvZ3Jlc3MtYmFyL2NpcmN1bGFyLXByb2dyZXNzLWJhci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sb0VBQW9FLENBQUM7QUFDbEgsT0FBTyxFQUFFLHlDQUF5QyxFQUFFLE1BQU0sNkRBQTZELENBQUM7O0FBT3hILE1BQU0sT0FBTyx5QkFBeUI7OEdBQXpCLHlCQUF5QjsrR0FBekIseUJBQXlCLGlCQUpuQiw0QkFBNEIsRUFBRSx5Q0FBeUMsYUFDNUUsWUFBWSxhQUNaLDRCQUE0QixFQUFFLHlDQUF5QzsrR0FFeEUseUJBQXlCLFlBSHhCLFlBQVk7OzJGQUdiLHlCQUF5QjtrQkFMckMsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSx5Q0FBeUMsQ0FBQztvQkFDdkYsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSx5Q0FBeUMsQ0FBQztpQkFDckYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBDaXJjdWxhclByb2dyZXNzQmFyQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9jaXJjdWxhci1wcm9ncmVzcy1iYXIvY2lyY3VsYXItcHJvZ3Jlc3MtYmFyLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ2lyY3VsYXJQcm9ncmVzc0JhckxhYmVsVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL2NpcmN1bGFyLXByb2dyZXNzLWJhci1sYWJlbC10ZW1wbGF0ZS5kaXJlY3RpdmVcIjtcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtDaXJjdWxhclByb2dyZXNzQmFyQ29tcG9uZW50LCBDaXJjdWxhclByb2dyZXNzQmFyTGFiZWxUZW1wbGF0ZURpcmVjdGl2ZV0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW0NpcmN1bGFyUHJvZ3Jlc3NCYXJDb21wb25lbnQsIENpcmN1bGFyUHJvZ3Jlc3NCYXJMYWJlbFRlbXBsYXRlRGlyZWN0aXZlXVxufSlcbmV4cG9ydCBjbGFzcyBDaXJjdWxhclByb2dyZXNzQmFyTW9kdWxlIHt9XG4iXX0=