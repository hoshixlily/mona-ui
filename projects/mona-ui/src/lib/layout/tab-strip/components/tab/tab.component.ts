import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    contentChild,
    EmbeddedViewRef,
    inject,
    input,
    InputSignal,
    model,
    ModelSignal,
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
    public readonly uid: string = v4();
    public closable: InputSignal<boolean | undefined> = input<boolean | undefined>(undefined);
    public disabled: InputSignal<boolean> = input(false);
    public index: number = 0;
    public selected: ModelSignal<boolean> = model(false);
    public title: InputSignal<string> = input("");

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
