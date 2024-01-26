import { TestBed } from "@angular/core/testing";

import { TreeService } from "./tree.service";

describe("TreeService", () => {
    let service: TreeService<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeService]
        });
        service = TestBed.inject(TreeService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
