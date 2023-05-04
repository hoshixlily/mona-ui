import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit
} from "@angular/core";
import { Column } from "../../models/Column";
import { Row } from "../../models/Row";
import { FormControl, FormGroup } from "@angular/forms";
import { FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import { GridService } from "../../services/grid.service";
import { asyncScheduler, filter, fromEvent, Subject, take, takeUntil, tap, timer } from "rxjs";
import { CellEditEvent } from "../../models/CellEditEvent";

@Component({
    selector: "mona-grid-cell",
    templateUrl: "./grid-cell.component.html",
    styleUrls: ["./grid-cell.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridCellComponent implements OnInit, OnDestroy {
    readonly #destroy: Subject<void> = new Subject<void>();
    private focused: boolean = false;
    public editForm!: FormGroup;
    public editing: boolean = false;

    @Input()
    public column!: Column;

    @Input()
    public row!: Row;

    public constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly focusMonitor: FocusMonitor,
        private readonly gridService: GridService
    ) {}

    public ngOnDestroy(): void {
        this.#destroy.next();
        this.#destroy.complete();
    }

    public ngOnInit(): void {
        this.initializeForm();
        this.setSubscriptions();
    }

    public initializeForm(): void {
        const form = this.row.getEditForm(this.column.field);
        if (form) {
            this.editForm = form;
        } else {
            this.editForm = new FormGroup({});
            this.editForm.addControl(this.column.field, new FormControl(this.row.data[this.column.field]));
            this.row.setEditForm(this.column.field, this.editForm);
        }
    }

    public onDateChange(date: Date | null): void {
        this.editing = false;
        this.gridService.isInEditMode = false;
    }

    public onFocusChange(origin: FocusOrigin): void {
        if (!origin) {
            const duration = this.column.filterType === "date" ? 50 : 25;
            timer(duration)
                .pipe(take(1))
                .subscribe(() => {
                    if (!this.gridEditable) {
                        return;
                    }
                    if (this.column.filterType !== "date") {
                        if (this.editing) {
                            this.editing = false;
                            this.updateCellValue();
                        }
                    } else {
                        const datePopup = document.querySelector(".mona-date-input-popup");
                        if (!datePopup) {
                            this.editing = false;
                        }
                        if (this.editing) {
                            this.updateCellValue();
                        }
                    }
                    this.cdr.markForCheck();
                });
            this.focused = false;
        } else {
            this.focused = true;
            if (this.gridService.isInEditMode) {
                if (origin !== "mouse") {
                    this.editing = true;
                    asyncScheduler.schedule(() => {
                        this.focusCellInput();
                    });
                }
            }
        }
    }

    private notifyCellEdit(): CellEditEvent {
        const event = new CellEditEvent({
            field: this.column.field,
            oldValue: this.row.data[this.column.field],
            newValue: this.editForm.value[this.column.field],
            rowData: this.row.data,
            setNewValue: (value: any) => {
                this.editForm.get(this.column.field)?.setValue(value);
                this.row.data[this.column.field] = value;
            }
        });
        if (event.oldValue !== event.newValue) {
            this.gridService.cellEdit$.next(event);
        }
        return event;
    }

    private focus(): void {
        this.focusMonitor.focusVia(this.elementRef.nativeElement.firstElementChild as HTMLElement, "program");
    }

    private focusCellInput(): void {
        if (this.column.filterType === "string" || this.column.filterType === "number") {
            this.elementRef.nativeElement.querySelector("input")?.focus();
        } else if (this.column.filterType === "date") {
            this.elementRef.nativeElement.querySelector("input")?.focus();
        } else if (this.column.filterType === "boolean") {
            this.elementRef.nativeElement.querySelector("input")?.focus();
        }
    }

    private setSubscriptions(): void {
        fromEvent<MouseEvent>(this.elementRef.nativeElement, "dblclick")
            .pipe(
                takeUntil(this.#destroy),
                tap(event => event.stopPropagation())
            )
            .subscribe(() => {
                if (!this.gridEditable) {
                    return;
                }
                this.editing = true;
                this.gridService.isInEditMode = true;
                this.cdr.markForCheck();
                asyncScheduler.schedule(() => {
                    this.focusCellInput();
                });
            });
        fromEvent<MouseEvent>(this.elementRef.nativeElement, "click")
            .pipe(
                takeUntil(this.#destroy),
                tap(event => event.stopPropagation())
            )
            .subscribe(() => {
                if (!this.editing && this.gridService.isInEditMode) {
                    this.gridService.isInEditMode = false;
                }
            });
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(
                takeUntil(this.#destroy),
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
                if (event.key === "Enter") {
                    if (this.editing) {
                        this.updateCellValue();
                    }
                    this.gridService.isInEditMode = false;
                    this.editing = false;
                    this.focus();
                } else if (event.key === "Escape") {
                    this.editing = false;
                    this.gridService.isInEditMode = false;
                    this.focus();
                } else if (event.key === "ArrowUp") {
                    if (!this.editing) {
                        const previousRowElement = document.querySelector(
                            `tr[data-ruid='${this.row.uid}']`
                        )?.previousElementSibling;
                        if (previousRowElement) {
                            const cell = previousRowElement.querySelector(
                                `td .mona-grid-cell[data-field='${this.column.field}']`
                            ) as HTMLElement;
                            if (cell) {
                                cell.focus();
                            }
                        }
                    }
                } else if (event.key === "ArrowDown") {
                    if (!this.editing) {
                        const nextRowElement = document.querySelector(
                            `tr[data-ruid='${this.row.uid}']`
                        )?.nextElementSibling;
                        if (nextRowElement) {
                            const cell = nextRowElement.querySelector(
                                `td .mona-grid-cell[data-field='${this.column.field}']`
                            ) as HTMLElement;
                            if (cell) {
                                cell.focus();
                            }
                        }
                    }
                } else if (event.key === "ArrowLeft") {
                    if (!this.editing) {
                        const row = document.querySelector(`tr[data-ruid='${this.row.uid}']`);
                        if (!row) {
                            return;
                        }
                        if (this.column.index > 0) {
                            const cell = row.querySelector(
                                `td .mona-grid-cell[data-col-index='${this.column.index - 1}']`
                            ) as HTMLElement;
                            if (cell) {
                                cell.focus();
                            }
                        } else {
                            const previousRowElement = row.previousElementSibling;
                            if (previousRowElement) {
                                const cell = previousRowElement.querySelector(
                                    "td:last-child .mona-grid-cell"
                                ) as HTMLElement;
                                if (cell) {
                                    cell.focus();
                                }
                            }
                        }
                    }
                } else if (event.key === "ArrowRight") {
                    if (!this.editing) {
                        const row = document.querySelector(`tr[data-ruid='${this.row.uid}']`);
                        if (!row) {
                            return;
                        }
                        if (this.column.index < this.gridService.columns.length - 1) {
                            const cell = row.querySelector(
                                `td .mona-grid-cell[data-col-index='${this.column.index + 1}']`
                            ) as HTMLElement;
                            if (cell) {
                                cell.focus();
                            }
                        } else {
                            const nextRowElement = row.nextElementSibling;
                            if (nextRowElement) {
                                const cell = nextRowElement.querySelector(
                                    "td:first-child .mona-grid-cell"
                                ) as HTMLElement;
                                if (cell) {
                                    cell.focus();
                                }
                            }
                        }
                    }
                } else if (event.key === "F2") {
                    if (!this.gridEditable) {
                        return;
                    }
                    if (this.focused) {
                        this.editing = true;
                        this.gridService.isInEditMode = true;
                        asyncScheduler.schedule(() => {
                            this.focusCellInput();
                        });
                    }
                }
                this.cdr.markForCheck();
            });
    }

    private updateCellValue(): void {
        const event = this.notifyCellEdit();
        if (!event.isDefaultPrevented()) {
            this.row.data[this.column.field] = this.editForm.value[this.column.field];
            return;
        }
        this.editForm.patchValue({
            [this.column.field]: this.row.data[this.column.field]
        });
    }

    private get gridEditable(): boolean {
        return !!this.gridService.editableOptions && !!this.gridService.editableOptions.enabled;
    }
}
