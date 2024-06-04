import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { EditorService } from "../../services/editor.service";

import { EditorFontHighlightComponent } from "./editor-font-highlight.component";

describe("EditorFontHighlightComponent", () => {
    let component: EditorFontHighlightComponent;
    let fixture: ComponentFixture<EditorFontHighlightComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorFontHighlightComponent],
            providers: [
                {
                    provide: EditorService,
                    useValue: jasmine.createSpyObj(
                        "EditorService",
                        {},
                        {
                            editor: jasmine.createSpyObj("Editor", ["isActive"]),
                            state: signal(
                                jasmine.createSpyObj(
                                    "State",
                                    {},
                                    {
                                        selection: jasmine.createSpyObj(
                                            "Selection",
                                            {},
                                            {
                                                empty: jasmine.createSpy(),
                                                from: jasmine.createSpy(),
                                                $from: jasmine.createSpyObj(
                                                    "ResolvedPos",
                                                    {},
                                                    {
                                                        marks: jasmine.createSpy().and.returnValue([])
                                                    }
                                                )
                                            }
                                        )
                                    }
                                )
                            )
                        }
                    )
                },
                provideAnimations()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditorFontHighlightComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
