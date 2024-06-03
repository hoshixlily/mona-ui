import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditorService } from "../../services/editor.service";

import { EditorHorizontalRuleComponent } from "./editor-horizontal-rule.component";

describe("EditorHorizontalRuleComponent", () => {
    let component: EditorHorizontalRuleComponent;
    let fixture: ComponentFixture<EditorHorizontalRuleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorHorizontalRuleComponent],
            providers: [
                {
                    provide: EditorService,
                    useValue: jasmine.createSpyObj(
                        "EditorService",
                        {},
                        {
                            editor: jasmine.createSpyObj("Editor", ["isActive"]),
                            state: jasmine.createSpy()
                        }
                    )
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditorHorizontalRuleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
