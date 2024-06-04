import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ImmutableSet } from "@mirei/ts-collections";
import { EditorService } from "../../services/editor.service";

import { EditorFontSizeComponent } from "./editor-font-size.component";

describe("EditorFontSizeComponent", () => {
    let component: EditorFontSizeComponent;
    let fixture: ComponentFixture<EditorFontSizeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorFontSizeComponent],
            providers: [
                {
                    provide: EditorService,
                    useValue: jasmine.createSpyObj(
                        "EditorService",
                        {},
                        {
                            editor: jasmine.createSpyObj("Editor", ["isActive"]),
                            state: jasmine.createSpy(),
                            fontSizes: signal(ImmutableSet.create(["16px", "24px"]))
                        }
                    )
                },
                provideAnimations()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditorFontSizeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
