import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { HourSelectorPipe } from "../../pipes/hour-selector.pipe";
import { TimeLimiterPipe } from "../../pipes/time-limiter.pipe";

import { TimeSelectorComponent } from "./time-selector.component";

describe("TimeSelectorComponent", () => {
    let spectator: Spectator<TimeSelectorComponent>;
    const createComponent = createComponentFactory({
        component: TimeSelectorComponent,
        declarations: [TimeLimiterPipe, HourSelectorPipe]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
