import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabStripModule } from "./modules/tab-strip/tab-strip.module";
import { ExpansionPanelModule } from "./modules/expansion-panel/expansion-panel.module";
import { SplitterModule } from "./modules/splitter/splitter.module";
import { StepperModule } from "./modules/stepper/stepper.module";
import * as i0 from "@angular/core";
export class LayoutModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: LayoutModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: LayoutModule, imports: [CommonModule], exports: [ExpansionPanelModule, SplitterModule, StepperModule, TabStripModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: LayoutModule, imports: [CommonModule, ExpansionPanelModule, SplitterModule, StepperModule, TabStripModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: LayoutModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [CommonModule],
                    exports: [ExpansionPanelModule, SplitterModule, StepperModule, TabStripModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9sYXlvdXQvbGF5b3V0Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdEUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDeEYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7QUFPakUsTUFBTSxPQUFPLFlBQVk7OEdBQVosWUFBWTsrR0FBWixZQUFZLFlBSFgsWUFBWSxhQUNaLG9CQUFvQixFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsY0FBYzsrR0FFcEUsWUFBWSxZQUhYLFlBQVksRUFDWixvQkFBb0IsRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLGNBQWM7OzJGQUVwRSxZQUFZO2tCQUx4QixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRSxFQUFFO29CQUNoQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsY0FBYyxDQUFDO2lCQUNqRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IFRhYlN0cmlwTW9kdWxlIH0gZnJvbSBcIi4vbW9kdWxlcy90YWItc3RyaXAvdGFiLXN0cmlwLm1vZHVsZVwiO1xuaW1wb3J0IHsgRXhwYW5zaW9uUGFuZWxNb2R1bGUgfSBmcm9tIFwiLi9tb2R1bGVzL2V4cGFuc2lvbi1wYW5lbC9leHBhbnNpb24tcGFuZWwubW9kdWxlXCI7XG5pbXBvcnQgeyBTcGxpdHRlck1vZHVsZSB9IGZyb20gXCIuL21vZHVsZXMvc3BsaXR0ZXIvc3BsaXR0ZXIubW9kdWxlXCI7XG5pbXBvcnQgeyBTdGVwcGVyTW9kdWxlIH0gZnJvbSBcIi4vbW9kdWxlcy9zdGVwcGVyL3N0ZXBwZXIubW9kdWxlXCI7XG5cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbRXhwYW5zaW9uUGFuZWxNb2R1bGUsIFNwbGl0dGVyTW9kdWxlLCBTdGVwcGVyTW9kdWxlLCBUYWJTdHJpcE1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgTGF5b3V0TW9kdWxlIHt9XG4iXX0=