import {
    AfterViewInit,
    Component,
    ContentChild,
    EmbeddedViewRef,
    Input,
    OnInit,
    TemplateRef,
    ViewContainerRef
} from "@angular/core";
import { TabContentTemplateDirective } from "../../directives/tab-content-template.directive";
import { TabTitleTemplateDirective } from "../../directives/tab-title-template.directive";
import { v4 } from "uuid";

@Component({
    selector: "mona-tab",
    template: "",
    styleUrls: [],
    standalone: true
})
export class TabComponent implements OnInit, AfterViewInit {
    #viewRef?: EmbeddedViewRef<any>;
    public readonly uid: string = v4();
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

    public constructor(private readonly vcr: ViewContainerRef) {}

    public createView(): void {
        if (this.contentTemplate) {
            this.#viewRef = this.vcr.createEmbeddedView(this.contentTemplate);
        }
    }

    public ngAfterViewInit(): void {
        this.createView();
    }

    public ngOnInit(): void {}

    public get viewRef(): EmbeddedViewRef<any> | undefined {
        return this.#viewRef;
    }
}
