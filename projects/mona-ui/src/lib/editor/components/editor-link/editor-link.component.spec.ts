import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { EditorService } from "../../services/editor.service";

import { EditorLinkComponent } from "./editor-link.component";

describe("EditorLinkComponent", () => {
    let component: EditorLinkComponent;
    let fixture: ComponentFixture<EditorLinkComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorLinkComponent],
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
                },
                provideAnimations()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditorLinkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
