import { TestBed } from "@angular/core/testing";
import { FilterChangeEvent } from "../../../common/filter-input/models/FilterChangeEvent";
import { DropDownTreeService } from "../services/drop-down-tree.service";
import { DropDownTreeFilterableDirective } from "./drop-down-tree-filterable.directive";

describe("DropDownTreeFilterableDirective", () => {
    let directive: DropDownTreeFilterableDirective;
    let dropdownTreeService: DropDownTreeService;

    beforeEach(() => {
        dropdownTreeService = TestBed.runInInjectionContext(() => new DropDownTreeService());
        directive = TestBed.runInInjectionContext(() => new DropDownTreeFilterableDirective(dropdownTreeService));
    });

    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });

    it("should set filter value", () => {
        const spy = spyOn(dropdownTreeService.filter$, "next");
        const filterValue = "test";
        directive.filter = filterValue;
        expect(spy).toHaveBeenCalledWith(filterValue);
    });

    it("should emit filter change event", () => {
        const filterChangeEvent: FilterChangeEvent = new FilterChangeEvent("test");
        spyOn(directive.filterChange, "emit");
        directive.filterChange.emit(filterChangeEvent);
        expect(directive.filterChange.emit).toHaveBeenCalledWith(filterChangeEvent);
    });

    it("should set filterable options when options are provided", () => {
        directive.options = { enabled: true };
        directive.ngOnInit();
        expect(dropdownTreeService.filterableOptions.enabled).toEqual(true);
    });

    it("should set default filterable options when options are empty string", () => {
        directive.options = "";
        directive.ngOnInit();
        expect(dropdownTreeService.filterableOptions.enabled).toEqual(true);
    });
});
