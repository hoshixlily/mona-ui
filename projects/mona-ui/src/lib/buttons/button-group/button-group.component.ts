import {
    ChangeDetectionStrategy,
    Component,
    contentChildren,
    DestroyRef,
    effect,
    inject,
    model,
    OnInit,
    untracked
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { firstOrDefault } from "@mirei/ts-collections";
import { SelectionMode } from "../../models/SelectionMode";
import { ButtonDirective } from "../button/button.directive";
import { ButtonService } from "../services/button.service";

@Component({
    selector: "mona-button-group",
    templateUrl: "./button-group.component.html",
    providers: [ButtonService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    host: {
        "[class.mona-button-group]": "true"
    }
})
export class ButtonGroupComponent implements OnInit {
    readonly #buttonService: ButtonService = inject(ButtonService);
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly buttons = contentChildren(ButtonDirective);
    public disabled = model<boolean | undefined>(undefined);
    public selection = model<SelectionMode>("multiple");

    public constructor() {
        effect(() => {
            const disabled = this.disabled();
            const buttons = this.buttons();
            untracked(() => {
                if (typeof disabled === "boolean") {
                    buttons.forEach(b => b.disabled.set(disabled));
                }
            });
        });
    }

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    private setSubscriptions(): void {
        this.#buttonService.buttonClick$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(button => {
            if (this.selection() === "single") {
                const selectedButton = firstOrDefault(this.buttons(), b => b.selected());
                if (selectedButton === button) {
                    return;
                }
                this.buttons().forEach(b => {
                    this.#buttonService.buttonSelect$.next([b, b === button ? !b.selected() : false]);
                });
            } else {
                this.#buttonService.buttonSelect$.next([button, !button.selected()]);
            }
        });
        this.#buttonService.buttonSelected$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(button => {
            if (this.selection() === "single" && button.selected()) {
                this.buttons().forEach(b => {
                    if (b !== button) {
                        this.#buttonService.buttonSelect$.next([b, false]);
                    }
                });
            }
        });
    }
}
