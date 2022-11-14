import { Component, ContentChild, Input, OnInit, TemplateRef } from "@angular/core";
import { TabContentTemplateDirective } from "../../directives/tab-content-template.directive";
import { TabTitleTemplateDirective } from "../../directives/tab-title-template.directive";

@Component({
    selector: "mona-tab",
    templateUrl: "./tab.component.html",
    styleUrls: ["./tab.component.scss"]
})
export class TabComponent implements OnInit {
    public readonly uid: string = crypto.randomUUID();
    public index: number = 0;

    @Input()
    public closable?: boolean;

    @ContentChild(TabContentTemplateDirective, { read: TemplateRef })
    public contentTemplate: TemplateRef<any> | null = null;

    @Input()
    public disabled: boolean = false;

    @Input()
    public selected: boolean = false;

    @Input()
    public title: string = "";

    @ContentChild(TabTitleTemplateDirective, { read: TemplateRef })
    public titleTemplate: TemplateRef<any> | null = null;

    public constructor() {}

    public ngOnInit(): void {}
}
