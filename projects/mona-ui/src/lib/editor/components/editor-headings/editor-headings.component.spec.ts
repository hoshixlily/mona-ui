import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { EditorService } from "../../services/editor.service";

import { EditorHeadingsComponent } from "./editor-headings.component";

describe("EditorHeadingsComponent", () => {
    let component: EditorHeadingsComponent;
    let fixture: ComponentFixture<EditorHeadingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorHeadingsComponent],
            providers: [
                {
                    provide: EditorService,
                    useValue: jasmine.createSpyObj(
                        "EditorService",
                        {},
                        {
                            editor: jasmine.createSpyObj("Editor", {
                                isActive: jasmine.createSpy(),
                                chain: jasmine.createSpy().and.returnValue({
                                    focus: jasmine.createSpy().and.returnValue({})
                                })
                            }),
                            state: signal(
                                jasmine.createSpyObj(
                                    "State",
                                    {},
                                    {
                                        selection: jasmine.createSpyObj(
                                            "Selection",
                                            {},
                                            {
                                                $from: jasmine.createSpyObj("ResolvedPos", {
                                                    node: jasmine.createSpyObj("Node", {
                                                        type: jasmine.createSpyObj("NodeType", {
                                                            name: "heading"
                                                        })
                                                    })
                                                })
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

        fixture = TestBed.createComponent(EditorHeadingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
