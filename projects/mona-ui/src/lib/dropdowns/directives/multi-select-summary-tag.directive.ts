import { AfterContentInit, ContentChild, Directive, Input, OnInit, TemplateRef } from "@angular/core";
import { MultiSelectComponent } from "../multi-select/multi-select.component";
import { MultiSelectSummaryTagTemplateDirective } from "./multi-select-summary-tag-template.directive";

@Directive({
    selector: "mona-multi-select[monaMultiSelectSummaryTag]",
    standalone: true
})
export class MultiSelectSummaryTagDirective implements OnInit, AfterContentInit {
    @ContentChild(MultiSelectSummaryTagTemplateDirective, { read: TemplateRef })
    public summaryTagTemplate: TemplateRef<any> | null = null;

    @Input("monaMultiSelectSummaryTag")
    public tagCount: number = 0;

    public constructor(private readonly host: MultiSelectComponent) {}

    public ngAfterContentInit(): void {
        this.host.summaryTagTemplate = this.summaryTagTemplate;
    }

    public ngOnInit(): void {
        this.host.tagCount = this.tagCount;
    }
}