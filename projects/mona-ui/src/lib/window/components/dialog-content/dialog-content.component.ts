import { NgClass } from "@angular/common";
import { AfterContentInit, ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faCheck, faExclamation, faInfo, faQuestion, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Subject, take } from "rxjs";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { NumericTextBoxComponent } from "../../../inputs/numeric-text-box/components/numeric-text-box/numeric-text-box.component";
import { TextBoxComponent } from "../../../inputs/text-box/components/text-box/text-box.component";
import { DialogAction } from "../../models/DialogAction";
import { DialogHandler } from "../../models/DialogHandler";
import { DialogRef } from "../../models/DialogRef";
import { DialogResult } from "../../models/DialogResult";
import { DialogType } from "../../models/DialogType";

@Component({
    templateUrl: "./dialog-content.component.html",
    styleUrls: ["./dialog-content.component.scss"],
    standalone: true,
    imports: [FontAwesomeModule, TextBoxComponent, FormsModule, NumericTextBoxComponent, ButtonDirective, NgClass],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogContentComponent implements AfterContentInit {
    readonly #dialogResult$ = new Subject<DialogResult>();
    #dialogRef: DialogRef = {
        result: this.#dialogResult$.asObservable(),
        close: () => {}
    };
    protected readonly confirmIcon = faQuestion;
    protected readonly errorIcon = faTimes;
    protected readonly infoIcon = faInfo;
    protected readonly inputIcon = faQuestion;
    protected readonly successIcon = faCheck;
    protected readonly warningIcon = faExclamation;

    public readonly actions = signal<DialogAction[]>([]);
    public readonly inputType = signal<"string" | "number">("string");
    public readonly text = signal("");
    public readonly type = signal<DialogType>("info");
    public readonly valueNumber = signal<number | null>(null);
    public readonly valueString = signal("");
    public dialogHandler?: DialogHandler; // This is set by DialogService

    public ngAfterContentInit(): void {
        this.#dialogRef.close = () => this.dialogHandler?.close();
        if (!this.dialogHandler) {
            return;
        }
        this.dialogHandler.closed$.pipe(take(1)).subscribe(event => {
            if (event?.viaClose) {
                this.#dialogResult$.next({
                    viaClose: event?.viaClose
                });
            }
        });
    }

    public onActionClick(event: MouseEvent, action: DialogAction, value?: string | number | null): void {
        if (action.closeOnClick) {
            this.#dialogRef.close();
        }
        this.#dialogResult$.next({
            action,
            value,
            viaClose: false
        });
    }

    public get dialogRef(): DialogRef {
        return this.#dialogRef;
    }
}
