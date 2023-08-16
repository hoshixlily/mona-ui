import { FormsModule } from "@angular/forms";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { DropDownListModule } from "../../../dropdowns/modules/drop-down-list/drop-down-list.module";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { OperatorFilterPipe } from "../../pipes/operator-filter.pipe";
import { ValuelessOperatorPipe } from "../../pipes/valueless-operator.pipe";

import { FilterMenuComponent } from "./filter-menu.component";

describe("FilterMenuComponent", () => {
    let spectator: Spectator<FilterMenuComponent>;
    const createComponent = createComponentFactory({
        component: FilterMenuComponent,
        imports: [FormsModule, TextBoxModule, DropDownListModule],
        declarations: [OperatorFilterPipe, ValuelessOperatorPipe]
    });

    beforeEach(() => (spectator = createComponent()));

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });
});
