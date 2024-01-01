import { NgTemplateOutlet } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { ContainsPipe } from "../../../../pipes/contains.pipe";
import { FilterInputComponent } from "../../../filter-input/components/filter-input/filter-input.component";
import { ListItemDirective } from "../../directives/list-item.directive";
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

    @Input()
    public set textField(textField: string | Selector<TData, string> | null | undefined) {
        this.listService.setTextField(textField ?? "");
    }

    public constructor(protected readonly listService: ListService<TData>) {}
}
