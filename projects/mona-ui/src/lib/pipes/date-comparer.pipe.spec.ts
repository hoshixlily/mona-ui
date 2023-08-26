import { DateComparerPipe } from "./date-comparer.pipe";

describe("DateComparerPipe", () => {
    it("create an instance", () => {
        const pipe = new DateComparerPipe();
        expect(pipe).toBeTruthy();
    });
});
