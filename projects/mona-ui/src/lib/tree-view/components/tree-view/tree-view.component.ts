import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, ContentChild, inject, Input, TemplateRef } from "@angular/core";
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
    protected readonly treeService: TreeService<T> = inject(TreeService);

    @Input()
    public set animate(value: boolean) {
        this.treeService.setAnimationEnabled(value);
    }

    @Input()
    public set data(value: Iterable<T>) {
        this.treeService.setData(value);
    }

    @Input()
    public set children(value: string | Selector<T, Iterable<T> | Observable<Iterable<T>>>) {
        this.treeService.setChildrenSelector(value);
    }

    @ContentChild(TreeViewNodeTemplateDirective, { read: TemplateRef })
    public nodeTemplate: TemplateRef<any> | null = null;

    @Input()
    public set textField(value: string | Selector<T, string>) {
        this.treeService.setTextField(value);
    }

    public onFilterChange(event: FilterChangeEvent): void {
        this.treeService.filterChange.emit(event);
        if (!event.isDefaultPrevented()) {
            this.treeService.filter$.next(event.filter);
        }
    }
}
