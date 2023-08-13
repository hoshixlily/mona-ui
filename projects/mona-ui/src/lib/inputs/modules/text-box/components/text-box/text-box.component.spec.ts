import { FormsModule } from "@angular/forms";
import { createComponentFactory, Spectator } from "@ngneat/spectator";

import { TextBoxComponent } from "./text-box.component";

describe("TextBoxComponent", () => {
    let spectator: Spectator<TextBoxComponent>;
    const createComponent = createComponentFactory({
        component: TextBoxComponent,
        imports: [FormsModule]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
