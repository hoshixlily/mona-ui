import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from "@angular/core";
import { Column } from "../../models/Column";
import { Row } from "../../models/Row";
import { FormControl, FormGroup } from "@angular/forms";
import { FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import { GridService } from "../../services/grid.service";
import { asyncScheduler, filter, fromEvent, mergeWith, Subject, take, takeUntil, tap, timer } from "rxjs";
import { TextBoxComponent } from "../../../inputs/modules/text-box/components/text-box/text-box.component";

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

    @ViewChild("stringEditElement")
    public stringEditElement?: TextBoxComponent;

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
                    if (this.column.filterType !== "date") {
                        this.editing = false;
                        this.updateCellValue();
                    } else {
                        this.updateCellValue();
                        const datePopup = document.querySelector(".mona-date-input-popup");
                        if (!datePopup) {
                            this.editing = false;
                        }
                    }
                    this.cdr.markForCheck();
                });
            this.focused = false;
        } else {
            this.focused = true;
            if (this.gridService.isInEditMode) {
                this.editing = true;
                asyncScheduler.schedule(() => {
                    this.focusCellInput();
                });
            }
        }
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
                this.editing = true;
                this.gridService.isInEditMode = true;
                this.cdr.markForCheck();
                asyncScheduler.schedule(() => {
                    this.focusCellInput();
                });
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
                    this.editing = false;
                    this.gridService.isInEditMode = false;
                    this.updateCellValue();
                    this.focus();
                } else if (event.key === "Escape") {
                    this.editing = false;
                    this.gridService.isInEditMode = false;
                    this.focus();
                } else if (event.key === "ArrowUp") {
                    if (!this.editing) {
                        const previousRow = document.querySelector(
                            `tr[data-ruid='${this.row.uid}']`
                        )?.previousElementSibling;
                        if (previousRow) {
                            const cell = previousRow.querySelector(
                                `td .mona-grid-cell[data-field='${this.column.field}']`
                            ) as HTMLElement;
                            if (cell) {
                                cell.focus();
                            }
                        }
                    }
                } else if (event.key === "ArrowDown") {
                    if (!this.editing) {
                        const nextRow = document.querySelector(`tr[data-ruid='${this.row.uid}']`)?.nextElementSibling;
                        if (nextRow) {
                            const cell = nextRow.querySelector(
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
                        if (row) {
                            if (this.column.index > 0) {
                                const cell = row.querySelector(
                                    `td .mona-grid-cell[data-col-index='${this.column.index - 1}']`
                                ) as HTMLElement;
                                if (cell) {
                                    cell.focus();
                                }
                            } else {
                                const previousRow = row.previousElementSibling;
                                if (previousRow) {
                                    const cell = previousRow.querySelector(
                                        "td:last-child .mona-grid-cell"
                                    ) as HTMLElement;
                                    if (cell) {
                                        cell.focus();
                                    }
                                }
                            }
                        }
                    }
                } else if (event.key === "ArrowRight") {
                    if (!this.editing) {
                        const row = document.querySelector(`tr[data-ruid='${this.row.uid}']`);
                        if (row) {
                            if (this.column.index < this.gridService.columns.length - 1) {
                                const cell = row.querySelector(
                                    `td .mona-grid-cell[data-col-index='${this.column.index + 1}']`
                                ) as HTMLElement;
                                if (cell) {
                                    cell.focus();
                                }
                            } else {
                                const nextRow = row.nextElementSibling;
                                if (nextRow) {
                                    const cell = nextRow.querySelector("td:first-child .mona-grid-cell") as HTMLElement;
                                    if (cell) {
                                        cell.focus();
                                    }
                                }
                            }
                        }
                    }
                } else if (event.key === "F2") {
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
        this.row.data[this.column.field] = this.editForm.value[this.column.field];
    }
}
