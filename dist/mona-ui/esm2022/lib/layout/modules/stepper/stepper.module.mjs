import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StepperComponent } from "./components/stepper/stepper.component";
import { StepperLabelTemplateDirective } from "./directives/stepper-label-template.directive";
import { StepperIndicatorTemplateDirective } from "./directives/stepper-indicator-template.directive";
import { StepperStepTemplateDirective } from "./directives/stepper-step-template.directive";
import * as i0 from "@angular/core";
export class StepperModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StepperModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: StepperModule, declarations: [StepperComponent,
            StepperLabelTemplateDirective,
            StepperIndicatorTemplateDirective,
            StepperStepTemplateDirective], imports: [CommonModule], exports: [StepperComponent,
            StepperIndicatorTemplateDirective,
            StepperLabelTemplateDirective,
            StepperStepTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StepperModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StepperModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        StepperComponent,
                        StepperLabelTemplateDirective,
                        StepperIndicatorTemplateDirective,
                        StepperStepTemplateDirective
                    ],
                    imports: [CommonModule],
                    exports: [
                        StepperComponent,
                        StepperIndicatorTemplateDirective,
                        StepperLabelTemplateDirective,
                        StepperStepTemplateDirective
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvbGF5b3V0L21vZHVsZXMvc3RlcHBlci9zdGVwcGVyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUM5RixPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSxtREFBbUQsQ0FBQztBQUN0RyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQzs7QUFpQjVGLE1BQU0sT0FBTyxhQUFhOzhHQUFiLGFBQWE7K0dBQWIsYUFBYSxpQkFibEIsZ0JBQWdCO1lBQ2hCLDZCQUE2QjtZQUM3QixpQ0FBaUM7WUFDakMsNEJBQTRCLGFBRXRCLFlBQVksYUFFbEIsZ0JBQWdCO1lBQ2hCLGlDQUFpQztZQUNqQyw2QkFBNkI7WUFDN0IsNEJBQTRCOytHQUd2QixhQUFhLFlBUlosWUFBWTs7MkZBUWIsYUFBYTtrQkFmekIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1YsZ0JBQWdCO3dCQUNoQiw2QkFBNkI7d0JBQzdCLGlDQUFpQzt3QkFDakMsNEJBQTRCO3FCQUMvQjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRTt3QkFDTCxnQkFBZ0I7d0JBQ2hCLGlDQUFpQzt3QkFDakMsNkJBQTZCO3dCQUM3Qiw0QkFBNEI7cUJBQy9CO2lCQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuaW1wb3J0IHsgU3RlcHBlckNvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvc3RlcHBlci9zdGVwcGVyLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgU3RlcHBlckxhYmVsVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL3N0ZXBwZXItbGFiZWwtdGVtcGxhdGUuZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBTdGVwcGVySW5kaWNhdG9yVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL3N0ZXBwZXItaW5kaWNhdG9yLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgU3RlcHBlclN0ZXBUZW1wbGF0ZURpcmVjdGl2ZSB9IGZyb20gXCIuL2RpcmVjdGl2ZXMvc3RlcHBlci1zdGVwLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBTdGVwcGVyQ29tcG9uZW50LFxuICAgICAgICBTdGVwcGVyTGFiZWxUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgU3RlcHBlckluZGljYXRvclRlbXBsYXRlRGlyZWN0aXZlLFxuICAgICAgICBTdGVwcGVyU3RlcFRlbXBsYXRlRGlyZWN0aXZlXG4gICAgXSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIFN0ZXBwZXJDb21wb25lbnQsXG4gICAgICAgIFN0ZXBwZXJJbmRpY2F0b3JUZW1wbGF0ZURpcmVjdGl2ZSxcbiAgICAgICAgU3RlcHBlckxhYmVsVGVtcGxhdGVEaXJlY3RpdmUsXG4gICAgICAgIFN0ZXBwZXJTdGVwVGVtcGxhdGVEaXJlY3RpdmVcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIFN0ZXBwZXJNb2R1bGUge31cbiJdfQ==