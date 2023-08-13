import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { PopupListService } from "../../../services/popup-list.service";
import { MultiSelectComponent } from "../components/multi-select/multi-select.component";
import { MultiSelectSummaryTagDirective } from "./multi-select-summary-tag.directive";

describe("MultiSelectSummaryTagDirective", () => {
    let spectator: SpectatorDirective<MultiSelectSummaryTagDirective>;
    const createDirective = createDirectiveFactory({
        directive: MultiSelectSummaryTagDirective,
        providers: [PopupListService, MultiSelectComponent]
    });
    const data = [
        { id: 1, name: "test1" },
        { id: 2, name: "test2" },
        { id: 3, name: "test3" }
    ];

    beforeEach(() => {
        spectator = createDirective(`<mona-multi-select monaMultiSelectSummaryTag></mona-multi-select>`, {
            hostProps: {
                data: data
            },
            props: {
                tagCount: 0
            }
        });
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
