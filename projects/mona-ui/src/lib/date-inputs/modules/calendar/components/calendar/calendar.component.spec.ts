import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { DateComparerPipe } from "../../../../../pipes/date-comparer.pipe";
import { DateIncludePipe } from "../../../../../pipes/date-include.pipe";
import { SlicePipe } from "../../../../../pipes/slice.pipe";

import { CalendarComponent } from "./calendar.component";

describe("CalendarComponent", () => {
    let spectator: Spectator<CalendarComponent>;
    const createComponent = createComponentFactory({
        component: CalendarComponent,
        imports: [FontAwesomeTestingModule, SlicePipe, DateComparerPipe, DateIncludePipe]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
