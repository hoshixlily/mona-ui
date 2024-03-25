import { contentChild, Directive, effect, inject, input, TemplateRef, untracked } from "@angular/core";
import { MultiSelectComponent } from "../components/multi-select/multi-select.component";
import { MultiSelectSummaryTagTemplateDirective } from "./multi-select-summary-tag-template.directive";

@Directive({
    selector: "mona-multi-select[monaMultiSelectSummaryTag]",
    standalone: true
})
export class MultiSelectSummaryTagDirective<TData> {
    readonly #host: MultiSelectComponent<TData> = inject(MultiSelectComponent);
    protected readonly summaryTagTemplate = contentChild(MultiSelectSummaryTagTemplateDirective, { read: TemplateRef });
    public tagCount = input(-1, { alias: "monaMultiSelectSummaryTag" });

    public constructor() {
        effect(() => {
            const tagCount = this.tagCount();
            untracked(() => this.#host.tagCount.set(tagCount));
        });
        effect(() => {
            const tagTemplate = this.summaryTagTemplate();
            untracked(() => this.#host.summaryTagTemplate.set(tagTemplate ?? null));
        });
    }
}
