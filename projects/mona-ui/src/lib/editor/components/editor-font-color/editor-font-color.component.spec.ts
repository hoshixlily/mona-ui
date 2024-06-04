import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { EditorService } from "../../services/editor.service";

import { EditorFontColorComponent } from "./editor-font-color.component";

describe("EditorFontColorComponent", () => {
    let component: EditorFontColorComponent;
    let fixture: ComponentFixture<EditorFontColorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorFontColorComponent],
            providers: [
                {
                    provide: EditorService,
                    useValue: jasmine.createSpyObj(
                        "EditorService",
                        {},
                        {
                            editor: jasmine.createSpyObj("Editor", {
                                isActive: jasmine.createSpy(),
                                getAttributes: jasmine.createSpy().and.returnValue({})
                            }),
                            state: jasmine.createSpy()
                        }
                    )
                },
                provideAnimations()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditorFontColorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
