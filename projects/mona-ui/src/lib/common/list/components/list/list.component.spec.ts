import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ListService } from "../../services/list.service";

import { ListComponent } from "./list.component";

describe("ListComponent", () => {
    let component: ListComponent<any>;
    let fixture: ComponentFixture<ListComponent<any>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ListComponent],
            providers: [ListService]
        }).compileComponents();

        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
