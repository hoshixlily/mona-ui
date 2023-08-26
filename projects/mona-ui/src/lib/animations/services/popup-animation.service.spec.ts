import { TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { PopupAnimationService } from "./popup-animation.service";

describe("PopupAnimationService", () => {
    let service: PopupAnimationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule]
        });
        service = TestBed.inject(PopupAnimationService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
