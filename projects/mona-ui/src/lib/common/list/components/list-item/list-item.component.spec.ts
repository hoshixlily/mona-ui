import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ListItem } from "../../models/ListItem";
import { ListService } from "../../services/list.service";

import { ListItemComponent } from "./list-item.component";

describe("ListItemComponent", () => {
    let component: ListItemComponent<any>;
    let fixture: ComponentFixture<ListItemComponent<any>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ListItemComponent],
            providers: [ListService]
        }).compileComponents();

        fixture = TestBed.createComponent(ListItemComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput(
            "item",
            new ListItem<any>({
                data: "test",
                header: "test"
            })
        );
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
