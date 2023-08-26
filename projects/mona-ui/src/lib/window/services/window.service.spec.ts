import { TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { WindowService } from "./window.service";

describe("WindowService", () => {
    let service: WindowService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule]
        });
        service = TestBed.inject(WindowService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
