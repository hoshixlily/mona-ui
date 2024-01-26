import { TestBed } from "@angular/core/testing";
import { TreeService } from "../../../common/tree/services/tree.service";
import { DropDownTreeExpandableDirective } from "./drop-down-tree-expandable.directive";

describe("DropDownTreeExpandableDirective", () => {
    let directive: DropDownTreeExpandableDirective<any>;
    let dropdownTreeService: TreeService<any>;

    beforeEach(() => {
        dropdownTreeService = TestBed.runInInjectionContext(() => new TreeService<any>());
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
        directive.options = { enabled: true };
        directive.ngOnInit();
        expect(dropdownTreeService.expandableOptions().enabled).toEqual(true);
    });

    it("should set default expandable options when options are empty string", () => {
        directive.options = "";
        directive.ngOnInit();
        expect(dropdownTreeService.expandableOptions().enabled).toEqual(true);
    });
});
