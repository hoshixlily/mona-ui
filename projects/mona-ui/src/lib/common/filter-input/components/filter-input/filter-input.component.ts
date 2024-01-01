import { Component, EventEmitter, Input, Output, signal, WritableSignal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { TextBoxComponent } from "../../../../inputs/text-box/components/text-box/text-box.component";
import { TextBoxPrefixTemplateDirective } from "../../../../inputs/text-box/directives/text-box-prefix-template.directive";
import { FilterChangeEvent } from "../../models/FilterChangeEvent";

@Component({
    selector: "mona-filter-input",
    standalone: true,
    imports: [TextBoxComponent, FormsModule, TextBoxPrefixTemplateDirective, FaIconComponent],
    templateUrl: "./filter-input.component.html",
    styleUrl: "./filter-input.component.scss"
})
export class FilterInputComponent {
    protected readonly filterIcon = faSearch;
    protected readonly filterPlaceholder: WritableSignal<string> = signal("");
    protected readonly filterText: WritableSignal<string> = signal("");

    @Input()
    public set filter(value: string) {
        this.filterText.set(value);
    }

    @Output()
    public filterChange: EventEmitter<FilterChangeEvent> = new EventEmitter<FilterChangeEvent>();

    @Input()
    public set placeholder(value: string) {
        this.filterPlaceholder.set(value);
    }

    public onFilterChange(value: string): void {
        const event = new FilterChangeEvent(value);
        this.filterChange.emit(event);
        if (!event.isDefaultPrevented()) {
            this.filterText.set(value);
        }
    }
}
