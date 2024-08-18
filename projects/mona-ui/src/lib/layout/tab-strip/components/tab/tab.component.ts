import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    contentChild,
    EmbeddedViewRef,
    inject,
    input,
    model,
    TemplateRef,
    ViewContainerRef
} from "@angular/core";
import { v4 } from "uuid";
import { TabContentTemplateDirective } from "../../directives/tab-content-template.directive";
import { TabTitleTemplateDirective } from "../../directives/tab-title-template.directive";

@Component({
    selector: "mona-tab",
    template: "",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent implements AfterViewInit {
    readonly #vcr: ViewContainerRef = inject(ViewContainerRef);
    #viewRef?: EmbeddedViewRef<any>;

    protected readonly contentTemplate = contentChild(TabContentTemplateDirective, { read: TemplateRef });

    public readonly titleTemplate = contentChild(TabTitleTemplateDirective, { read: TemplateRef });
    public readonly uid = v4();
    public closable = input<boolean | undefined>(undefined);
    public disabled = input(false);
    public index = 0;
    public selected = model(false);
    public title = input("");

    public createView(): void {
        const contentTemplate = this.contentTemplate();
        if (contentTemplate) {
            this.#viewRef = this.#vcr.createEmbeddedView(contentTemplate);
        }
    }

    public ngAfterViewInit(): void {
        this.createView();
    }

    public get viewRef(): EmbeddedViewRef<any> | undefined {
        return this.#viewRef;
    }
}
