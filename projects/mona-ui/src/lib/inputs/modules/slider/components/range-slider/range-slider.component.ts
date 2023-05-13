import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    NgZone,
    OnInit,
    Output,
    Renderer2
} from "@angular/core";
import { AbstractSliderComponent } from "../abstract-slider/abstract-slider.component";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../../../../utils/Action";

@Component({
    selector: "mona-range-slider",
    templateUrl: "./../abstract-slider/abstract-slider.component.html",
    styleUrls: ["./../abstract-slider/abstract-slider.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RangeSliderComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangeSliderComponent extends AbstractSliderComponent implements OnInit {
    protected override propagateChange: Action<any> | null = null;
    public override ranged: boolean = true;

    @Input()
    public override value: [number, number] | null = null;

    @Output()
    public override valueChange: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();

    public constructor(
        protected override readonly elementRef: ElementRef<HTMLElement>,
        protected override readonly renderer: Renderer2,
        protected override readonly cdr: ChangeDetectorRef,
        protected override readonly zone: NgZone
    ) {
        super(elementRef, renderer, cdr, zone);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.ensureCorrectValueType(this.value);
        if (this.value != null) {
            this.handlerValues = [
                Math.max(this.minValue, Math.min(this.maxValue, this.value[0])),
                Math.max(this.minValue, Math.min(this.maxValue, this.value[1]))
            ];
        }
    }

    protected override emitValues(): void {
        this.value = [this.handlerValues[0], this.handlerValues[1]];
        this.valueChange.emit(this.value);
        this.propagateChange?.(this.value);
    }
}
