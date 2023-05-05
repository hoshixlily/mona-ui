import { AfterContentInit, OnInit, TemplateRef } from "@angular/core";
import { MultiSelectComponent } from "../components/multi-select/multi-select.component";
import * as i0 from "@angular/core";
export declare class MultiSelectSummaryTagDirective implements OnInit, AfterContentInit {
    private readonly host;
    summaryTagTemplate: TemplateRef<any> | null;
    tagCount: number;
    constructor(host: MultiSelectComponent);
    ngAfterContentInit(): void;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MultiSelectSummaryTagDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MultiSelectSummaryTagDirective, "[monaMultiSelectSummaryTag]", never, { "tagCount": { "alias": "monaMultiSelectSummaryTag"; "required": false; }; }, {}, ["summaryTagTemplate"], never, false, never>;
}
