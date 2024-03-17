import {
    AfterContentInit,
    contentChild,
    Directive,
    effect,
    inject,
    input,
    InputSignal,
    Signal,
    TemplateRef,
    untracked
} from "@angular/core";
import { MultiSelectComponent } from "../components/multi-select/multi-select.component";
import { MultiSelectSummaryTagTemplateDirective } from "./multi-select-summary-tag-template.directive";

@Directive({
    selector: "mona-multi-select[monaMultiSelectSummaryTag]",
    standalone: true
})
export class MultiSelectSummaryTagDirective<TData> implements AfterContentInit {
    readonly #host: MultiSelectComponent<TData> = inject(MultiSelectComponent);
    public readonly summaryTagTemplate: Signal<TemplateRef<any> | undefined> = contentChild(
        MultiSelectSummaryTagTemplateDirective,
        { read: TemplateRef }
    );
    public tagCount: InputSignal<number | undefined> = input<number | undefined>(undefined, {
        alias: "monaMultiSelectSummaryTag"
    });

    public constructor() {
        effect(() => {
            const tagCount = this.tagCount();
            untracked(() => {
                this.#host.tagCount.set(tagCount ?? -1);
            });
        });
    }

    public ngAfterContentInit(): void {
        this.#host.summaryTagTemplate.set(this.summaryTagTemplate() ?? null);
    }
}
