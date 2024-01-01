import { NgTemplateOutlet } from "@angular/common";
import { Component, ContentChild, Input, TemplateRef } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { ContainsPipe } from "../../../../pipes/contains.pipe";
import { FilterInputComponent } from "../../../filter-input/components/filter-input/filter-input.component";
import { ListGroupHeaderTemplateDirective } from "../../directives/list-group-header-template.directive";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { ListItemDirective } from "../../directives/list-item.directive";
import { ListItemTemplateContext } from "../../models/ListItemTemplateContext";
import { ListService } from "../../services/list.service";
import { ListItemComponent } from "../list-item/list-item.component";

@Component({
    selector: "mona-list",
    standalone: true,
    imports: [FilterInputComponent, ListItemComponent, NgTemplateOutlet, ContainsPipe, ListItemDirective],
    templateUrl: "./list.component.html",
    styleUrl: "./list.component.scss"
})
export class ListComponent<TData> {
    @Input({ required: false })
    public set data(value: Iterable<TData>) {
        this.listService.setData(value);
    }

    @ContentChild(ListGroupHeaderTemplateDirective, { read: TemplateRef })
    public groupHeaderTemplate: TemplateRef<ListItemTemplateContext<string>> | null = null;

    @ContentChild(ListItemTemplateDirective, { read: TemplateRef })
    public itemTemplate: TemplateRef<ListItemTemplateContext<TData>> | null = null;

    @Input()
    public set textField(textField: string | Selector<TData, string> | null | undefined) {
        this.listService.setTextField(textField ?? "");
    }

    @Input()
    public set valueField(valueField: string | Selector<TData, any> | null | undefined) {
        this.listService.setValueField(valueField ?? "");
    }

    public constructor(protected readonly listService: ListService<TData>) {}
}
