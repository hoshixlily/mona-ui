import {
    AfterContentInit,
    Component,
    ContentChildren,
    DestroyRef,
    inject,
    Input,
    OnInit,
    QueryList
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { SelectionMode } from "../../../../../models/SelectionMode";
import { ButtonService } from "../../../../services/button.service";
import { ButtonDirective } from "../../../button/directives/button.directive";

@Component({
    selector: "mona-button-group",
    templateUrl: "./button-group.component.html",
    styleUrls: ["./button-group.component.scss"],
    providers: [ButtonService]
})
export class ButtonGroupComponent implements OnInit, AfterContentInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #disabled: boolean = false;
    private selectionMode: SelectionMode = "multiple";

    @ContentChildren(ButtonDirective)
    private buttons: QueryList<ButtonDirective> = new QueryList<ButtonDirective>();

    @Input()
    public set disabled(disabled: boolean) {
        this.#disabled = disabled;
        this.notifyDisableStateChanged();
    }

    public get disabled(): boolean {
        return this.#disabled;
    }

    @Input()
    public set selection(selection: SelectionMode) {
        this.selectionMode = selection;
    }

    public constructor(private readonly buttonService: ButtonService) {}

    public ngAfterContentInit(): void {
        this.notifyDisableStateChanged();
        this.buttons.forEach(b => (b.toggleable = true));
        this.buttons.changes.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
            this.buttons.forEach(b => (b.toggleable = true));
        });
    }

    public ngOnInit(): void {
        this.notifySelectionStateChange();
    }

    private notifyDisableStateChanged(): void {
        this.buttons.forEach(b => (b.disabled = this.#disabled));
    }

    private notifySelectionStateChange(): void {
        this.buttonService.buttonClick$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(button => {
            if (this.selectionMode === "single") {
                this.buttons.forEach(b => {
                    this.buttonService.buttonSelect$.next([b, b === button ? !b.selected : false]);
                });
            } else {
                this.buttonService.buttonSelect$.next([button, !button.selected]);
            }
        });
        this.buttonService.buttonSelected$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(button => {
            if (this.selectionMode === "single") {
                if (button.selected) {
                    this.buttons.forEach(b => {
                        if (b !== button) {
                            this.buttonService.buttonSelect$.next([b, false]);
                        }
                    });
                }
            }
        });
    }
}
