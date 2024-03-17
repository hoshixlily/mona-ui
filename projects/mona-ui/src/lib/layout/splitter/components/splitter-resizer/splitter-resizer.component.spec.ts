import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SplitterPaneComponent } from "../splitter-pane/splitter-pane.component";
import { SplitterComponent } from "../splitter/splitter.component";

import { SplitterResizerComponent } from "./splitter-resizer.component";

@Component({
    template: `
        <mona-splitter>
            <mona-splitter-pane> Pane 1</mona-splitter-pane>
            <mona-splitter-pane> Pane 2</mona-splitter-pane>
        </mona-splitter>
    `,
    styles: "",
    standalone: true,
    imports: [SplitterComponent, SplitterPaneComponent]
})
class TestHostComponent {}

describe("SplitterResizerComponent", () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SplitterComponent, SplitterPaneComponent, TestHostComponent]
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostComponent);
        hostComponent = hostFixture.componentInstance;
        hostFixture.detectChanges();
    });

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
    });
});
