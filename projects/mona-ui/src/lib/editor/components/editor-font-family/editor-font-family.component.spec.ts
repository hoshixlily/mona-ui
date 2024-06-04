import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ImmutableSet } from "@mirei/ts-collections";
import { EditorService } from "../../services/editor.service";

import { EditorFontFamilyComponent } from "./editor-font-family.component";

describe("EditorFontFamilyComponent", () => {
    let component: EditorFontFamilyComponent;
    let fixture: ComponentFixture<EditorFontFamilyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorFontFamilyComponent],
            providers: [
                {
                    provide: EditorService,
                    useValue: jasmine.createSpyObj(
                        "EditorService",
                        {},
                        {
                            editor: jasmine.createSpyObj(
                                "Editor",
                                {
                                    isActive: jasmine.createSpy()
                                },
                                {
                                    chain: jasmine.createSpy().and.returnValue({
                                        focus: jasmine.createSpy().and.returnValue({
                                            setFontFamily: jasmine.createSpy().and.returnValue({
                                                run: jasmine.createSpy()
                                            })
                                        })
                                    })
                                }
                            ),
                            state: jasmine.createSpy(),
                            fonts: signal(ImmutableSet.create(["Arial", "Verdana"]))
                        }
                    )
                },
                provideAnimations()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditorFontFamilyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
