import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { VirtualScrollOptions } from "../models/VirtualScrollOptions";
import { ListViewService } from "../services/list-view.service";
import { ListViewVirtualScrollDirective } from "./list-view-virtual-scroll.directive";

describe("ListViewVirtualScrollDirective", () => {
    let spectator: SpectatorDirective<ListViewVirtualScrollDirective>;
    const createDirective = createDirectiveFactory({
        directive: ListViewVirtualScrollDirective,
        providers: [ListViewService]
    });
    let options: VirtualScrollOptions = { enabled: true, itemHeight: 30 };

    beforeEach(() => {
        spectator = createDirective(`<mona-list-view monaListViewVirtualScroll></mona-list-view>`, {
            props: {
                options: options
            }
        });
    });

    it("should create an instance", () => {
        expect(spectator.directive).toBeTruthy();
    });
});
