import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NeoSplitterResizerComponent } from "./neo-splitter-resizer.component";

describe("NeoSplitterResizerComponent", () => {
    let component: NeoSplitterResizerComponent;
    let fixture: ComponentFixture<NeoSplitterResizerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NeoSplitterResizerComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(NeoSplitterResizerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
