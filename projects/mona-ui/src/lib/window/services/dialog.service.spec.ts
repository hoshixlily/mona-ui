import { TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { DialogService } from "./dialog.service";
import { WindowService } from "./window.service";

describe("DialogService", () => {
    let service: DialogService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule],
            providers: [WindowService]
        });
        service = TestBed.inject(DialogService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
