import { TestBed } from "@angular/core/testing";

import { DropDownTreeService } from "./drop-down-tree.service";

describe("DropDownTreeService", () => {
    let service: DropDownTreeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DropDownTreeService]
        });
        service = TestBed.inject(DropDownTreeService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
