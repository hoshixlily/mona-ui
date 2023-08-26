import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    DestroyRef,
    inject,
    Input,
    OnInit,
    QueryList
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Enumerable } from "@mirei/ts-collections";
import { SelectionMode } from "../../../../../models/SelectionMode";
import { ButtonService } from "../../../../services/button.service";
import { ButtonDirective } from "../../../button/directives/button.directive";

@Component({
    selector: "mona-button-group",
    templateUrl: "./button-group.component.html",
    styleUrls: ["./button-group.component.scss"],
    providers: [ButtonService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ButtonGroupComponent implements OnInit, AfterContentInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #disabled: boolean = false;
    #selection: SelectionMode = "multiple";

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
        this.#selection = selection;
    }

    public get selection(): SelectionMode {
        return this.#selection;
    }

    public constructor(private readonly buttonService: ButtonService) {}

    public ngAfterContentInit(): void {
        this.notifyDisableStateChanged();
    }

    public ngOnInit(): void {
        this.notifySelectionStateChange();
    }

    private notifyDisableStateChanged(): void {
        this.buttons.forEach(b => (b.disabled = this.disabled));
    }

    private notifySelectionStateChange(): void {
        this.buttonService.buttonClick$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(button => {
            if (this.#selection === "single") {
                const selectedButton = Enumerable.from(this.buttons).firstOrDefault(b => b.selected);
                if (selectedButton === button) {
                    return;
                }
                this.buttons.forEach(b => {
                    this.buttonService.buttonSelect$.next([b, b === button ? !b.selected : false]);
                });
            } else {
                this.buttonService.buttonSelect$.next([button, !button.selected]);
            }
        });
        this.buttonService.buttonSelected$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(button => {
            if (this.#selection === "single") {
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
