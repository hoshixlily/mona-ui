import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditorService } from "../../services/editor.service";

import { EditorIndentComponent } from "./editor-indent.component";

describe("EditorIndentComponent", () => {
    let component: EditorIndentComponent;
    let fixture: ComponentFixture<EditorIndentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorIndentComponent],
            providers: [
                {
                    provide: EditorService,
                    useValue: jasmine.createSpyObj(
                        "EditorService",
                        {},
                        {
                            editor: jasmine.createSpyObj("Editor", ["isActive"], {
                                can: jasmine.createSpy().and.returnValue({
                                    indent: jasmine.createSpy(),
                                    outdent: jasmine.createSpy()
                                })
                            }),
                            state: jasmine.createSpy()
                        }
                    )
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditorIndentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
