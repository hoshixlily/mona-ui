import { AfterContentInit, Component, ContentChildren, Input, OnInit, QueryList } from "@angular/core";
import { ButtonDirective } from "../../../button/directives/button.directive";
import { SelectionMode } from "../../../../../models/SelectionMode";

@Component({
    selector: "mona-button-group",
    templateUrl: "./button-group.component.html",
    styleUrls: ["./button-group.component.scss"]
})
export class ButtonGroupComponent implements OnInit, AfterContentInit {
    private isDisabled: boolean = false;
    private selectedButtons: ButtonDirective[] = [];
    private selectionMode: SelectionMode = "multiple";

    @ContentChildren(ButtonDirective)
    private buttons: QueryList<ButtonDirective> = new QueryList<ButtonDirective>();

    @Input()
    public set disabled(disabled: boolean) {
        this.isDisabled = disabled;
        this.notifyDisableStateChanged();
    }

    @Input()
    public set selection(selection: SelectionMode) {
        this.selectionMode = selection;
        this.notifySelectionStateChange();
    }

    public constructor() {}

    public ngAfterContentInit(): void {
        this.notifyDisableStateChanged();
        this.notifySelectionStateChange();
    }

    public ngOnInit(): void {}

    private notifyDisableStateChanged(): void {
        this.buttons.forEach(b => (b.disabled = this.isDisabled));
    }

    private notifySelectionStateChange(): void {
        this.buttons.forEach(b => {
            if (b.selected) {
                this.selectedButtons.push(b);
            }
            b.selectedChange.subscribe(s => {
                if (!s) {
                    this.selectedButtons = this.selectedButtons.filter(sb => sb !== b);
                } else {
                    if (this.selectionMode === "single") {
                        this.selectedButtons.forEach(sb => (sb.selected = false));
                        this.selectedButtons = [b];
                    } else {
                        this.selectedButtons = [...this.selectedButtons, b];
                    }
                }
            });
        });
    }
}
