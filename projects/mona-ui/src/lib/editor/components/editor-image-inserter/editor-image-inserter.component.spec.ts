import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditorService } from "../../services/editor.service";

import { EditorImageInserterComponent } from "./editor-image-inserter.component";

describe("EditorImageInserterComponent", () => {
    let component: EditorImageInserterComponent;
    let fixture: ComponentFixture<EditorImageInserterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorImageInserterComponent],
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

        fixture = TestBed.createComponent(EditorImageInserterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
