import { AfterContentInit, ContentChild, Directive, Input, TemplateRef } from "@angular/core";
import { MultiSelectComponent } from "../components/multi-select/multi-select.component";
import { MultiSelectSummaryTagTemplateDirective } from "./multi-select-summary-tag-template.directive";

@Directive({
    selector: "mona-multi-select[monaMultiSelectSummaryTag]",
    standalone: true
})
export class MultiSelectSummaryTagDirective<TData> implements AfterContentInit {
    @ContentChild(MultiSelectSummaryTagTemplateDirective, { read: TemplateRef })
    public summaryTagTemplate: TemplateRef<any> | null = null;

    @Input("monaMultiSelectSummaryTag")
    public set tagCount(value: number) {
        this.host.tagCount.set(value);
    }

    public constructor(private readonly host: MultiSelectComponent<TData>) {}

    public ngAfterContentInit(): void {
        this.host.summaryTagTemplate = this.summaryTagTemplate;
    }
}
