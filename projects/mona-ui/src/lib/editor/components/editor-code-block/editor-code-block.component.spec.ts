import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditorService } from "../../services/editor.service";

import { EditorCodeBlockComponent } from "./editor-code-block.component";

describe("EditorCodeBlockComponent", () => {
    let component: EditorCodeBlockComponent;
    let fixture: ComponentFixture<EditorCodeBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorCodeBlockComponent],
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

        fixture = TestBed.createComponent(EditorCodeBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
