import { TestBed } from "@angular/core/testing";

import { TreeViewService } from "./tree-view.service";

describe("TreeViewService", () => {
    let service: TreeViewService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeViewService]
        });
        service = TestBed.inject(TreeViewService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
