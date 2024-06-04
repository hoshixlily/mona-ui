import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { EditorService } from "../../services/editor.service";

import { EditorTableComponent } from "./editor-table.component";

describe("EditorTableComponent", () => {
    let component: EditorTableComponent;
    let fixture: ComponentFixture<EditorTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorTableComponent],
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
                                    can: jasmine.createSpy().and.returnValue({
                                        addColumnAfter: jasmine.createSpy(),
                                        addColumnBefore: jasmine.createSpy(),
                                        addRowAfter: jasmine.createSpy(),
                                        addRowBefore: jasmine.createSpy(),
                                        deleteColumn: jasmine.createSpy(),
                                        deleteRow: jasmine.createSpy(),
                                        deleteTable: jasmine.createSpy(),
                                        mergeCells: jasmine.createSpy(),
                                        splitCell: jasmine.createSpy(),
                                        toggleHeaderRow: jasmine.createSpy()
                                    })
                                }
                            ),
                            state: jasmine.createSpy()
                        }
                    )
                },
                provideAnimations()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EditorTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
