import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SplitterPaneComponent } from "../splitter-pane/splitter-pane.component";

import { SplitterResizerComponent } from "./splitter-resizer.component";

describe("SplitterResizerComponent", () => {
    let spectator: Spectator<SplitterResizerComponent>;
    const createComponent = createComponentFactory({
        component: SplitterResizerComponent,
        imports: [FontAwesomeTestingModule]
    });
    let previousPaneSpectator: Spectator<SplitterPaneComponent>;
    const createPreviousPaneComponent = createComponentFactory({
        component: SplitterPaneComponent
    });

    let nextPaneSpectator: Spectator<SplitterPaneComponent>;
    const createNextPaneComponent = createComponentFactory({
        component: SplitterPaneComponent
    });

    beforeEach(() => {
        previousPaneSpectator = createPreviousPaneComponent();
        nextPaneSpectator = createNextPaneComponent();
        spectator = createComponent({
            props: {
                previousPane: previousPaneSpectator.component,
                nextPane: nextPaneSpectator.component
            }
        });
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
