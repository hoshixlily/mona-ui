import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SplitterComponent } from "./components/splitter/splitter.component";
import { SplitterPaneComponent } from "./components/splitter-pane/splitter-pane.component";
import { SplitterResizerComponent } from "./components/splitter-resizer/splitter-resizer.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import * as i0 from "@angular/core";
export class SplitterModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: SplitterModule, declarations: [SplitterComponent, SplitterPaneComponent, SplitterResizerComponent], imports: [CommonModule, FontAwesomeModule], exports: [SplitterComponent, SplitterPaneComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitterModule, imports: [CommonModule, FontAwesomeModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitterModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [SplitterComponent, SplitterPaneComponent, SplitterResizerComponent],
                    imports: [CommonModule, FontAwesomeModule],
                    exports: [SplitterComponent, SplitterPaneComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXR0ZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL2xheW91dC9tb2R1bGVzL3NwbGl0dGVyL3NwbGl0dGVyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUM3RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUMzRixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUNwRyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7QUFPckUsTUFBTSxPQUFPLGNBQWM7OEdBQWQsY0FBYzsrR0FBZCxjQUFjLGlCQUpSLGlCQUFpQixFQUFFLHFCQUFxQixFQUFFLHdCQUF3QixhQUN2RSxZQUFZLEVBQUUsaUJBQWlCLGFBQy9CLGlCQUFpQixFQUFFLHFCQUFxQjsrR0FFekMsY0FBYyxZQUhiLFlBQVksRUFBRSxpQkFBaUI7OzJGQUdoQyxjQUFjO2tCQUwxQixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRSxDQUFDLGlCQUFpQixFQUFFLHFCQUFxQixFQUFFLHdCQUF3QixDQUFDO29CQUNsRixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsaUJBQWlCLENBQUM7b0JBQzFDLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixFQUFFLHFCQUFxQixDQUFDO2lCQUN0RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IFNwbGl0dGVyQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9zcGxpdHRlci9zcGxpdHRlci5jb21wb25lbnRcIjtcbmltcG9ydCB7IFNwbGl0dGVyUGFuZUNvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvc3BsaXR0ZXItcGFuZS9zcGxpdHRlci1wYW5lLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgU3BsaXR0ZXJSZXNpemVyQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9zcGxpdHRlci1yZXNpemVyL3NwbGl0dGVyLXJlc2l6ZXIuY29tcG9uZW50XCI7XG5pbXBvcnQgeyBGb250QXdlc29tZU1vZHVsZSB9IGZyb20gXCJAZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZVwiO1xuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW1NwbGl0dGVyQ29tcG9uZW50LCBTcGxpdHRlclBhbmVDb21wb25lbnQsIFNwbGl0dGVyUmVzaXplckNvbXBvbmVudF0sXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9udEF3ZXNvbWVNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtTcGxpdHRlckNvbXBvbmVudCwgU3BsaXR0ZXJQYW5lQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBTcGxpdHRlck1vZHVsZSB7fVxuIl19