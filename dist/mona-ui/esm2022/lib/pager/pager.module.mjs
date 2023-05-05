import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PagerComponent } from "./components/pager/pager.component";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { SlicePipe } from "../pipes/slice.pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NumericTextBoxModule } from "../inputs/modules/numeric-text-box/numeric-text-box.module";
import { DropDownListModule } from "../dropdowns/modules/drop-down-list/drop-down-list.module";
import * as i0 from "@angular/core";
export class PagerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PagerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: PagerModule, declarations: [PagerComponent], imports: [CommonModule, ButtonModule, SlicePipe, FontAwesomeModule, NumericTextBoxModule, DropDownListModule], exports: [PagerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PagerModule, imports: [CommonModule, ButtonModule, FontAwesomeModule, NumericTextBoxModule, DropDownListModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PagerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PagerComponent],
                    imports: [CommonModule, ButtonModule, SlicePipe, FontAwesomeModule, NumericTextBoxModule, DropDownListModule],
                    exports: [PagerComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbW9uYS11aS9zcmMvbGliL3BhZ2VyL3BhZ2VyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDcEUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUNsRyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwyREFBMkQsQ0FBQzs7QUFPL0YsTUFBTSxPQUFPLFdBQVc7OEdBQVgsV0FBVzsrR0FBWCxXQUFXLGlCQUpMLGNBQWMsYUFDbkIsWUFBWSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsb0JBQW9CLEVBQUUsa0JBQWtCLGFBQ2xHLGNBQWM7K0dBRWYsV0FBVyxZQUhWLFlBQVksRUFBRSxZQUFZLEVBQWEsaUJBQWlCLEVBQUUsb0JBQW9CLEVBQUUsa0JBQWtCOzsyRkFHbkcsV0FBVztrQkFMdkIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUUsQ0FBQyxjQUFjLENBQUM7b0JBQzlCLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLG9CQUFvQixFQUFFLGtCQUFrQixDQUFDO29CQUM3RyxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7aUJBQzVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuaW1wb3J0IHsgUGFnZXJDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL3BhZ2VyL3BhZ2VyLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQnV0dG9uTW9kdWxlIH0gZnJvbSBcIi4uL2J1dHRvbnMvbW9kdWxlcy9idXR0b24vYnV0dG9uLm1vZHVsZVwiO1xuaW1wb3J0IHsgU2xpY2VQaXBlIH0gZnJvbSBcIi4uL3BpcGVzL3NsaWNlLnBpcGVcIjtcbmltcG9ydCB7IEZvbnRBd2Vzb21lTW9kdWxlIH0gZnJvbSBcIkBmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lXCI7XG5pbXBvcnQgeyBOdW1lcmljVGV4dEJveE1vZHVsZSB9IGZyb20gXCIuLi9pbnB1dHMvbW9kdWxlcy9udW1lcmljLXRleHQtYm94L251bWVyaWMtdGV4dC1ib3gubW9kdWxlXCI7XG5pbXBvcnQgeyBEcm9wRG93bkxpc3RNb2R1bGUgfSBmcm9tIFwiLi4vZHJvcGRvd25zL21vZHVsZXMvZHJvcC1kb3duLWxpc3QvZHJvcC1kb3duLWxpc3QubW9kdWxlXCI7XG5cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbUGFnZXJDb21wb25lbnRdLFxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEJ1dHRvbk1vZHVsZSwgU2xpY2VQaXBlLCBGb250QXdlc29tZU1vZHVsZSwgTnVtZXJpY1RleHRCb3hNb2R1bGUsIERyb3BEb3duTGlzdE1vZHVsZV0sXG4gICAgZXhwb3J0czogW1BhZ2VyQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBQYWdlck1vZHVsZSB7fVxuIl19