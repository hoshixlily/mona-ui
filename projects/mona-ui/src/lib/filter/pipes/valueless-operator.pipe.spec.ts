import { ValuelessOperatorPipe } from "./valueless-operator.pipe";

describe("ValuelessOperatorPipe", () => {
    it("create an instance", () => {
        const pipe = new ValuelessOperatorPipe();
        expect(pipe).toBeTruthy();
    });
});
