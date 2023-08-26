import { TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AnimationService } from "./animation.service";

describe("AnimationService", () => {
    let service: AnimationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule]
        });
        service = TestBed.inject(AnimationService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
