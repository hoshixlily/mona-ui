import { TestBed } from "@angular/core/testing";
import { FilterChangeEvent } from "../../../common/filter-input/models/FilterChangeEvent";
import { TreeService } from "../../../common/tree/services/tree.service";
import { DropDownTreeFilterableDirective } from "./drop-down-tree-filterable.directive";

describe("DropDownTreeFilterableDirective", () => {
    let directive: DropDownTreeFilterableDirective<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeService]
        });
        directive = TestBed.runInInjectionContext(() => new DropDownTreeFilterableDirective());
    });

    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });

    it("should emit filter change event", () => {
        const filterChangeEvent: FilterChangeEvent = new FilterChangeEvent("test");
        spyOn(directive.filterChange, "emit");
        directive.filterChange.emit(filterChangeEvent);
        expect(directive.filterChange.emit).toHaveBeenCalledWith(filterChangeEvent);
    });
});
