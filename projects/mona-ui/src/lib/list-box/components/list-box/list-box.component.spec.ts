import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ListViewModule } from "../../../list-view/list-view.module";
import { ContainPipe } from "../../../pipes/contain.pipe";

import { ListBoxComponent } from "./list-box.component";

describe("ListBoxComponent", () => {
    let spectator: Spectator<ListBoxComponent>;
    const createComponent = createComponentFactory({
        component: ListBoxComponent,
        imports: [ContainPipe, FontAwesomeModule, ListViewModule]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
