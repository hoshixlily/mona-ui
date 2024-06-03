import { TestBed } from "@angular/core/testing";

import { EditorService } from "./editor.service";

describe("EditorService", () => {
    let service: EditorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditorService]
        });
        service = TestBed.inject(EditorService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
