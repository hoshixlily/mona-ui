import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { TreeService } from "../../services/tree.service";

import { TreeDropHintComponent } from "./tree-drop-hint.component";

describe("TreeDropHintComponent", () => {
    let component: TreeDropHintComponent<any>;
    let fixture: ComponentFixture<TreeDropHintComponent<any>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TreeDropHintComponent, FontAwesomeTestingModule],
            providers: [TreeService]
        }).compileComponents();

        fixture = TestBed.createComponent(TreeDropHintComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
