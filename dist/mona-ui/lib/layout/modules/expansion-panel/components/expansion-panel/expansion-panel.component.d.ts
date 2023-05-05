import { OnInit, TemplateRef } from "@angular/core";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import * as i0 from "@angular/core";
export declare class ExpansionPanelComponent implements OnInit {
    readonly collapseIcon: IconDefinition;
    readonly expandIcon: IconDefinition;
    actionsTemplate: TemplateRef<any> | null;
    expanded: boolean;
    title: string;
    titleTemplate: TemplateRef<any> | null;
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExpansionPanelComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ExpansionPanelComponent, "mona-expansion-panel", never, { "expanded": { "alias": "expanded"; "required": false; }; "title": { "alias": "title"; "required": false; }; }, {}, ["actionsTemplate", "titleTemplate"], ["*"], false, never>;
}
