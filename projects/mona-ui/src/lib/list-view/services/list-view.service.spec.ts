import { TestBed } from "@angular/core/testing";

import { ListViewService } from "./list-view.service";

describe("ListViewService", () => {
    let service: ListViewService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ListViewService]
        });
        service = TestBed.inject(ListViewService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
