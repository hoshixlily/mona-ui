import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditorService } from "../../services/editor.service";

import { EditorTableCreatorComponent } from "./editor-table-creator.component";

describe("EditorTableCreatorComponent", () => {
    let component: EditorTableCreatorComponent;
    let fixture: ComponentFixture<EditorTableCreatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorTableCreatorComponent],
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

        fixture = TestBed.createComponent(EditorTableCreatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
