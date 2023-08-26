import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ButtonDirective } from "../../../buttons/modules/button/directives/button.directive";
import { PagerComponent } from "./pager.component";

describe("PagerComponent", () => {
    let component: PagerComponent;
    let fixture: ComponentFixture<PagerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [PagerComponent, ButtonDirective]
        });
        fixture = TestBed.createComponent(PagerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
