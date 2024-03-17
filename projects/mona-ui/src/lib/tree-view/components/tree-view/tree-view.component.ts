import { NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    contentChild,
    ContentChild,
    effect,
    inject,
    input,
    Input,
    InputSignal,
    Signal,
    TemplateRef,
    untracked
} from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { Observable } from "rxjs";
import { FilterInputComponent } from "../../../common/filter-input/components/filter-input/filter-input.component";
import { FilterChangeEvent } from "../../../common/filter-input/models/FilterChangeEvent";
import { TreeComponent } from "../../../common/tree/components/tree/tree.component";
import { TreeNodeTemplateDirective } from "../../../common/tree/directives/tree-node-template.directive";
import { TreeService } from "../../../common/tree/services/tree.service";
import { TreeViewNodeTemplateDirective } from "../../directives/tree-view-node-template.directive";

@Component({
    selector: "mona-tree-view",
    standalone: true,
    imports: [FilterInputComponent, TreeComponent, TreeNodeTemplateDirective, NgTemplateOutlet],
    templateUrl: "./tree-view.component.html",
    styleUrl: "./tree-view.component.scss",
    providers: [TreeService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "mona-tree-view"
    }
})
export class TreeViewComponent<T> {
    protected readonly nodeTemplate: Signal<TemplateRef<any> | undefined> = contentChild(
        TreeViewNodeTemplateDirective,
        {
            read: TemplateRef
        }
    );
    protected readonly treeService: TreeService<T> = inject(TreeService);

    public animate: InputSignal<boolean> = input(true);
    public data: InputSignal<Iterable<T>> = input<Iterable<T>>([]);
    public children: InputSignal<string | Selector<T, Iterable<T> | Observable<Iterable<T>>>> = input<
        string | Selector<T, Iterable<T> | Observable<Iterable<T>>>
    >("");
    public textField: InputSignal<string | Selector<T, string>> = input<string | Selector<T, string>>("");

    public constructor() {
        effect(() => {
            const animate = this.animate();
            untracked(() => {
                this.treeService.setAnimationEnabled(animate);
            });
        });
        effect(() => {
            const children = this.children();
            untracked(() => {
                this.treeService.setChildrenSelector(children);
            });
        });
        effect(() => {
            const data = this.data();
            untracked(() => {
                this.treeService.setData(data);
            });
        });
        effect(() => {
            const textField = this.textField();
            untracked(() => {
                this.treeService.setTextField(textField);
            });
        });
    }

    public onFilterChange(event: FilterChangeEvent): void {
        this.treeService.filterChange.emit(event);
        if (!event.isDefaultPrevented()) {
            this.treeService.filter$.next(event.filter);
        }
    }
}
