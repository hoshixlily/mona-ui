import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { PopupRef } from "../../../popup/models/PopupRef";

@Component({
    standalone: true,
    imports: [CommonModule],
    template: "",
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class AbstractDateInputComponent implements OnInit {
    protected readonly componentDestroy$: Subject<void> = new Subject<void>();
    protected popupRef: PopupRef | null = null;

    @Input()
    public disabled: boolean = false;

    @Input()
    public value: Date | null = null;

    @Output()
    public valueChange: EventEmitter<Date> = new EventEmitter<Date>();

    protected constructor(protected readonly cdr: ChangeDetectorRef) {}

    public ngOnInit(): void {}
}
