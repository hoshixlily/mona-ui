import { AfterContentInit, Component, ContentChildren, Input, OnDestroy, OnInit, QueryList, Self } from "@angular/core";
import { ButtonDirective } from "../../../button/directives/button.directive";
import { SelectionMode } from "../../../../../models/SelectionMode";
import { ButtonService } from "../../../../services/button.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "mona-button-group",
    templateUrl: "./button-group.component.html",
    styleUrls: ["./button-group.component.scss"],
    providers: [ButtonService]
})
export class ButtonGroupComponent implements OnInit, AfterContentInit, OnDestroy {
    #disabled: boolean = false;
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
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
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        this.notifySelectionStateChange();
    }

    private notifyDisableStateChanged(): void {
        this.buttons.forEach(b => (b.disabled = this.#disabled));
    }

    private notifySelectionStateChange(): void {
        this.buttonService.buttonClick$.pipe(takeUntil(this.componentDestroy$)).subscribe(button => {
            if (this.selectionMode === "single") {
                this.buttons.forEach(b => {
                    this.buttonService.buttonSelect$.next([b, b === button ? !b.selected : false]);
                });
            } else {
                this.buttonService.buttonSelect$.next([button, !button.selected]);
            }
        });
        this.buttonService.buttonSelected$.pipe(takeUntil(this.componentDestroy$)).subscribe(button => {
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
