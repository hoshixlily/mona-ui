import { TestBed } from "@angular/core/testing";

import { PopupListService } from "./popup-list.service";

describe("PopupListService", () => {
    let service: PopupListService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PopupListService]
        });
        service = TestBed.inject(PopupListService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
