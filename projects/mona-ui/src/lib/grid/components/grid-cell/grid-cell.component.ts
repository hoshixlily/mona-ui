import { A11yModule, FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    InputSignal,
    OnInit
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { asyncScheduler, filter, fromEvent, map, Subject, take, takeUntil, tap, timer } from "rxjs";
import { DatePickerComponent } from "../../../date-inputs/date-picker/date-picker.component";
import { CheckBoxDirective } from "../../../inputs/check-box/directives/check-box.directive";
import { NumericTextBoxComponent } from "../../../inputs/numeric-text-box/components/numeric-text-box/numeric-text-box.component";
import { TextBoxComponent } from "../../../inputs/text-box/components/text-box/text-box.component";
import { CellEditEvent } from "../../models/CellEditEvent";
import { Column } from "../../models/Column";
import { Row } from "../../models/Row";
import { GridService } from "../../services/grid.service";

@Component({
    selector: "mona-grid-cell",
    templateUrl: "./grid-cell.component.html",
    styleUrls: ["./grid-cell.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        A11yModule,
        NgClass,
        NgTemplateOutlet,
        FormsModule,
        ReactiveFormsModule,
        TextBoxComponent,
        NumericTextBoxComponent,
        DatePickerComponent,
        CheckBoxDirective
    ]
})
export class GridCellComponent implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #focusMonitor: FocusMonitor = inject(FocusMonitor);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    private focused: boolean = false;
    protected editForm!: FormGroup;
    protected editing: boolean = false;

    public column: InputSignal<Column> = input.required<Column>();
    public row: InputSignal<Row> = input.required<Row>();

    public constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly gridService: GridService
    ) {}

    public ngOnInit(): void {
        this.initializeForm();
        this.setSubscriptions();
    }

    public initializeForm(): void {
        const form = this.row().getEditForm(this.column().field);
        if (form) {
            this.editForm = form;
        } else {
            this.editForm = new FormGroup({});
            this.editForm.addControl(this.column().field, new FormControl(this.row().data[this.column().field]));
            this.row().setEditForm(this.column().field, this.editForm);
        }
    }

    public onFocusChange(origin: FocusOrigin): void {
        if (!origin) {
            this.handleFocusLoss();
        } else {
            this.handleFocusGain();
        }
    }

    private notifyCellEdit(): CellEditEvent {
        const event = new CellEditEvent({
            field: this.column().field,
            oldValue: this.row().data[this.column().field],
            newValue: this.editForm.value[this.column().field],
            rowData: this.row().data,
            setNewValue: (value: any) => {
                this.editForm.get(this.column().field)?.setValue(value);
                this.row().data[this.column().field] = value;
            }
        });
        if (event.oldValue !== event.newValue) {
            this.gridService.cellEdit$.next(event);
        }
        return event;
    }

    private focus(): void {
        this.#focusMonitor.focusVia(this.#hostElementRef.nativeElement.firstElementChild as HTMLElement, "program");
    }

    private focusCellInput(): void {
        if (
            this.column().dataType === "string" ||
            this.column().dataType === "number" ||
            this.column().dataType === "date" ||
            this.column().dataType === "boolean"
        ) {
            this.#hostElementRef.nativeElement.querySelector("input")?.focus();
        }
    }

    private handleArrowDownKey(): void {
        if (this.editing) {
            return;
        }
        const nextRowElement = document.querySelector(`tr[data-ruid='${this.row().uid}']`)?.nextElementSibling;
        if (nextRowElement) {
            const cell = nextRowElement.querySelector(
                `td .mona-grid-cell[data-field='${this.column().field}']`
            ) as HTMLElement;
            if (cell) {
                cell.focus();
            }
        }
    }

    private handleArrowLeftKey(): void {
        if (this.editing) {
            return;
        }
        const row = document.querySelector(`tr[data-ruid='${this.row().uid}']`);
        if (!row) {
            return;
        }
        if (this.column().index() > 0) {
            const cell = row.querySelector(
                `td .mona-grid-cell[data-col-index='${this.column().index() - 1}']`
            ) as HTMLElement;
            if (cell) {
                cell.focus();
            }
        } else {
            const previousRowElement = row.previousElementSibling;
            if (previousRowElement) {
                const cell = previousRowElement.querySelector("td:last-child .mona-grid-cell") as HTMLElement;
                if (cell) {
                    cell.focus();
                }
            }
        }
    }

    private handleArrowRightKey(): void {
        if (this.editing) {
            return;
        }
        const row = document.querySelector(`tr[data-ruid='${this.row().uid}']`);
        if (!row) {
            return;
        }
        if (this.column().index() < this.gridService.columns().length - 1) {
            const cell = row.querySelector(
                `td .mona-grid-cell[data-col-index='${this.column().index() + 1}']`
            ) as HTMLElement;
            if (cell) {
                cell.focus();
            }
        } else {
            const nextRowElement = row.nextElementSibling;
            if (nextRowElement) {
                const cell = nextRowElement.querySelector("td:first-child .mona-grid-cell") as HTMLElement;
                if (cell) {
                    cell.focus();
                }
            }
        }
    }

    private handleArrowUpKey(): void {
        if (this.editing) {
            return;
        }
        const previousRowElement = document.querySelector(`tr[data-ruid='${this.row().uid}']`)?.previousElementSibling;
        if (previousRowElement) {
            const cell = previousRowElement.querySelector(
                `td .mona-grid-cell[data-field='${this.column().field}']`
            ) as HTMLElement;
            if (cell) {
                cell.focus();
            }
        }
    }

    private handleDateInputFocusLoss(): void {
        const popupElement = document.querySelector(".mona-date-input-popup");
        if (!popupElement) {
            this.editing = false;
            return;
        }
        const popupClick$ = new Subject<void>();
        fromEvent(popupElement, "click")
            .pipe(
                takeUntil(popupClick$),
                filter((event: Event) => {
                    const target = event.target as HTMLElement;
                    return !target.closest(".mona-date-input-popup");
                })
            )
            .subscribe(() => {
                this.editing = false;
                this.updateCellValue();
                popupClick$.next();
                popupClick$.complete();
            });
    }

    private handleEnterKey(): void {
        if (this.editing) {
            this.updateCellValue();
        }
        this.gridService.isInEditMode.set(false);
        this.editing = false;
        this.focus();
    }

    private handleEscapeKey(): void {
        this.editing = false;
        this.gridService.isInEditMode.set(false);
        this.focus();
    }

    private handleF2Key(): void {
        if (!this.gridEditable) {
            return;
        }
        if (this.focused) {
            this.editing = true;
            this.gridService.isInEditMode.set(true);
            asyncScheduler.schedule(() => {
                this.focusCellInput();
            });
        }
    }

    private handleFocusGain(): void {
        this.focused = true;
        if (this.gridService.isInEditMode()) {
            if (origin !== "mouse") {
                this.editing = true;
                asyncScheduler.schedule(() => {
                    this.focusCellInput();
                });
            }
        }
    }

    private handleFocusLoss(): void {
        const duration = this.column().dataType === "date" ? 50 : 25;
        timer(duration)
            .pipe(take(1))
            .subscribe(() => {
                if (!this.gridEditable) {
                    return;
                }
                if (this.column().dataType !== "date") {
                    if (this.editing) {
                        this.editing = false;
                        this.updateCellValue();
                    }
                } else {
                    this.handleDateInputFocusLoss();
                }
                this.cdr.markForCheck();
            });
        this.focused = false;
    }

    private setClickSubscription(): void {
        fromEvent<MouseEvent>(this.#hostElementRef.nativeElement, "click")
            .pipe(
                takeUntilDestroyed(this.#destroyRef)
                // tap(event => event.stopPropagation())
            )
            .subscribe(() => {
                if (!this.editing && this.gridService.isInEditMode()) {
                    this.gridService.isInEditMode.set(false);
                }
            });
    }

    private setDateValueChangeSubscription(): void {
        this.editForm.controls[this.column().field].valueChanges
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                map(value => {
                    return value as Date;
                })
            )
            .subscribe(() => {
                this.editing = false;
                this.gridService.isInEditMode.set(false);
            });
    }

    private setDoubleClickSubscription(): void {
        fromEvent<MouseEvent>(this.#hostElementRef.nativeElement, "dblclick")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                tap(event => event.stopPropagation())
            )
            .subscribe(() => {
                if (!this.gridEditable) {
                    return;
                }
                this.editing = true;
                this.gridService.isInEditMode.set(true);
                this.cdr.markForCheck();
                asyncScheduler.schedule(() => {
                    this.focusCellInput();
                });
            });
    }

    private setKeydownSubscription(): void {
        fromEvent<KeyboardEvent>(this.#hostElementRef.nativeElement, "keydown")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                tap(event => event.stopPropagation()),
                filter(
                    event =>
                        event.key === "Enter" ||
                        event.key === "Escape" ||
                        event.key === "ArrowUp" ||
                        event.key === "ArrowDown" ||
                        event.key === "ArrowLeft" ||
                        event.key === "ArrowRight" ||
                        event.key === "F2"
                )
            )
            .subscribe(event => {
                switch (event.key) {
                    case "Enter":
                        this.handleEnterKey();
                        break;
                    case "Escape":
                        this.handleEscapeKey();
                        break;
                    case "ArrowUp":
                        this.handleArrowUpKey();
                        break;
                    case "ArrowDown":
                        this.handleArrowDownKey();
                        break;
                    case "ArrowLeft":
                        this.handleArrowLeftKey();
                        break;
                    case "ArrowRight":
                        this.handleArrowRightKey();
                        break;
                    case "F2":
                        this.handleF2Key();
                        break;
                }
                this.cdr.markForCheck();
            });
    }

    private setSubscriptions(): void {
        this.setDoubleClickSubscription();
        this.setClickSubscription();
        this.setKeydownSubscription();
        if (this.column().dataType === "date") {
            this.setDateValueChangeSubscription();
        }
    }

    private updateCellValue(): void {
        const event = this.notifyCellEdit();
        if (!event.isDefaultPrevented()) {
            this.row().data[this.column().field] = this.editForm.value[this.column().field];
            return;
        }
        this.editForm.patchValue({
            [this.column().field]: this.row().data[this.column().field]
        });
    }

    private get gridEditable(): boolean {
        return (
            !!this.gridService.editableOptions && !!this.gridService.editableOptions.enabled && this.column().editable
        );
    }
}
