import { TestBed } from "@angular/core/testing";
import { FilterChangeEvent } from "../../common/filter-input/models/FilterChangeEvent";
import { TreeViewService } from "../services/tree-view.service";
import { TreeViewFilterableDirective } from "./tree-view-filterable.directive";

describe("TreeViewFilterableDirective", () => {
    let directive: TreeViewFilterableDirective;
    let treeViewService: TreeViewService;

    beforeEach(() => {
        treeViewService = TestBed.runInInjectionContext(() => new TreeViewService());
        directive = TestBed.runInInjectionContext(() => new TreeViewFilterableDirective(treeViewService));
    });

    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });

    it("should set filter value", () => {
        const spy = spyOn(treeViewService.filter$, "next");
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

    it("should set filter placeholder", () => {
        const placeholder = "Enter filter";
        directive.filterPlaceholder = placeholder;
        expect(treeViewService.filterPlaceholder()).toEqual(placeholder);
    });

    it("should set filterable options when options are provided", () => {
        directive.options = { enabled: true };
        directive.ngOnInit();
        expect(treeViewService.filterableOptions.enabled).toBe(true);
    });

    it("should set default filterable options when options are empty string", () => {
        directive.options = "";
        directive.ngOnInit();
        expect(treeViewService.filterableOptions.enabled).toEqual(true);
    });
});
