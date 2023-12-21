import { TestBed } from "@angular/core/testing";
import { DropDownTreeExpandableDirective } from "./drop-down-tree-expandable.directive";
import { DropDownTreeService } from "../services/drop-down-tree.service";
import { ExpandableOptions } from "../../../tree-view/models/ExpandableOptions";

describe("DropDownTreeExpandableDirective", () => {
    let directive: DropDownTreeExpandableDirective;
    let dropdownTreeService: DropDownTreeService;

    beforeEach(() => {
        dropdownTreeService = TestBed.runInInjectionContext(() => new DropDownTreeService());
        directive = TestBed.runInInjectionContext(() => new DropDownTreeExpandableDirective(dropdownTreeService));
    });

    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });

    it("should set expanded keys", () => {
        const expandedKeys = ["key1", "key2"];
        directive.expandedKeys = expandedKeys;
        expect(dropdownTreeService.expandedKeys().length).toEqual(expandedKeys.length);
    });

    it("should emit expanded keys change event", () => {
        const expandedKeys = ["key1", "key2"];
        spyOn(directive.expandedKeysChange, "emit");
        directive.expandedKeysChange.emit(expandedKeys);
        expect(directive.expandedKeysChange.emit).toHaveBeenCalledWith(expandedKeys);
    });

    it("should set expandable options when options are provided", () => {
        const options: ExpandableOptions = { enabled: true };
        directive.options = options;
        directive.ngOnInit();
        expect(dropdownTreeService.expandableOptions.enabled).toEqual(true);
    });

    it("should set default expandable options when options are empty string", () => {
        directive.options = "";
        directive.ngOnInit();
        expect(dropdownTreeService.expandableOptions.enabled).toEqual(true);
    });
});
