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
        this.editForm = new FormGroup({});
        this.editForm.addControl(this.column.field, new FormControl(this.row.data[this.column.field]));
    }

    public onDateChange(date: Date | null): void {
        this.editing = false;
        this.gridService.isInEditMode = false;
    }

    public onFocusChange(origin: FocusOrigin): void {
        if (!origin) {
            const duration = this.column.filterType === "date" ? 150 : 25;
            timer(duration)
                .pipe(take(1))
                .subscribe(() => {
                    if (this.column.filterType !== "date") {
                        this.editing = false;
                        this.gridService.isInEditMode = false;
                        this.row.data[this.column.field] = this.editForm.value[this.column.field];
                    } else {
                        this.row.data[this.column.field] = this.editForm.value[this.column.field];
                        const datePopup = document.querySelector(".mona-date-input-popup");
                        if (!datePopup) {
                            this.editing = false;
                            this.gridService.isInEditMode = false;
                        }
                    }
                    this.cdr.markForCheck();
                });
        } else {
            if (this.gridService.isInEditMode) {
                this.editing = true;
                asyncScheduler.schedule(() => {
                    this.focusCellInput();
                });
            }
        }
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
                filter(event => event.key === "Enter" || event.key === "Escape")
            )
            .subscribe(event => {
                if (event.key === "Enter") {
                    this.editing = false;
                    this.gridService.isInEditMode = false;
                    this.row.data[this.column.field] = this.editForm.value[this.column.field];
                } else {
                    this.editing = false;
                    this.gridService.isInEditMode = false;
                }
                this.cdr.markForCheck();
            });
    }
}
