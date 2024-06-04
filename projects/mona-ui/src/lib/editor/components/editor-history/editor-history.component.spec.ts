import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditorService } from "../../services/editor.service";

import { EditorHistoryComponent } from "./editor-history.component";

describe("EditorHistoryComponent", () => {
    let component: EditorHistoryComponent;
    let fixture: ComponentFixture<EditorHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorHistoryComponent],
            providers: [
                {
                    provide: EditorService,
                    useValue: jasmine.createSpyObj(
                        "EditorService",
                        {},
                        {
                            editor: jasmine.createSpyObj("Editor", ["isActive"], {
                                can: jasmine.createSpy().and.returnValue({
                                    undo: jasmine.createSpy(),
                                    redo: jasmine.createSpy()
                                })
                            }),
                            state: jasmine.createSpy()
                        }
                    )
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditorHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
