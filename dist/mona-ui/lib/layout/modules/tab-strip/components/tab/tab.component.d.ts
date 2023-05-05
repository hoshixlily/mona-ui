import { OnInit, TemplateRef } from "@angular/core";
import * as i0 from "@angular/core";
export declare class TabComponent implements OnInit {
    readonly uid: string;
    index: number;
    closable?: boolean;
    contentTemplate: TemplateRef<any> | null;
    disabled: boolean;
    selected: boolean;
    title: string;
    titleTemplate: TemplateRef<any> | null;
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TabComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TabComponent, "mona-tab", never, { "closable": { "alias": "closable"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "selected": { "alias": "selected"; "required": false; }; "title": { "alias": "title"; "required": false; }; }, {}, ["contentTemplate", "titleTemplate"], never, false, never>;
}
