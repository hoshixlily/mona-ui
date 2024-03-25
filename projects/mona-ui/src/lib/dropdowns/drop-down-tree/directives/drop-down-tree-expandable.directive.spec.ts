import { TestBed } from "@angular/core/testing";
import { TreeService } from "../../../common/tree/services/tree.service";
import { DropDownTreeExpandableDirective } from "./drop-down-tree-expandable.directive";

describe("DropDownTreeExpandableDirective", () => {
    let directive: DropDownTreeExpandableDirective<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeService]
        });
        directive = TestBed.runInInjectionContext(() => new DropDownTreeExpandableDirective());
    });

    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });

    it("should emit expanded keys change event", () => {
        const expandedKeys = ["key1", "key2"];
        spyOn(directive.expandedKeysChange, "emit");
        directive.expandedKeysChange.emit(expandedKeys);
        expect(directive.expandedKeysChange.emit).toHaveBeenCalledWith(expandedKeys);
    });
});
