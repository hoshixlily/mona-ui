import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SplitterPaneComponent } from "../splitter-pane/splitter-pane.component";
import { SplitterComponent } from "../splitter/splitter.component";

import { SplitterResizerComponent } from "./splitter-resizer.component";

@Component({
    template: `
        <mona-splitter orientation="horizontal">
            <mona-splitter-pane [size]="300">
                <div>Pane 1</div>
            </mona-splitter-pane>
            <mona-splitter-pane>
                <div>Pane 2</div>
            </mona-splitter-pane>
        </mona-splitter>
    `,
    standalone: true,
    imports: [SplitterResizerComponent, SplitterPaneComponent, SplitterComponent]
})
class SplitterResizerComponentTestComponent {}

describe("SplitterResizerComponent", () => {
    let hostComponent: SplitterResizerComponentTestComponent;
    let hostFixture: ComponentFixture<SplitterResizerComponentTestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SplitterResizerComponent, SplitterResizerComponentTestComponent, SplitterPaneComponent]
        });
        hostFixture = TestBed.createComponent(SplitterResizerComponentTestComponent);
        hostComponent = hostFixture.componentInstance;
        hostFixture.detectChanges();
    });

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
    });
});
