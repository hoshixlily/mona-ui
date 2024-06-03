import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditorService } from "../../services/editor.service";

import { EditorBasicTextStylesComponent } from "./editor-basic-text-styles.component";

describe("EditorBasicTextStylesComponent", () => {
    let component: EditorBasicTextStylesComponent;
    let fixture: ComponentFixture<EditorBasicTextStylesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorBasicTextStylesComponent],
            providers: [
                {
                    provide: EditorService,
                    useValue: jasmine.createSpyObj(
                        "EditorService",
                        {},
                        {
                            editor: jasmine.createSpyObj("Editor", ["isActive"]),
                            state: jasmine.createSpy(),
                            settings: signal({})
                        }
                    )
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditorBasicTextStylesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
