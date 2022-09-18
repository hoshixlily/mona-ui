import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { fromEvent, Subject, take, takeUntil, timer } from "rxjs";
import { Action } from "../../../../../utils/Action";
import { SliderTick } from "../../models/SliderTick";
import { SliderTickValueTemplateDirective } from "../../directives/slider-tick-value-template.directive";
import { SliderHandlerPositionData } from "../../models/SliderHandlerPositionData";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Orientation } from "../../../../../models/Orientation";
import { SliderHandlerType } from "../../models/SliderHandlerType";
import { SliderTrackData } from "../../models/SliderTrackData";
import { SliderHandlerData } from "../../models/SliderHandlerData";
import { SliderLabelPosition } from "../../models/SliderLabelPosition";
import { AbstractSliderComponent } from "../abstract-slider/abstract-slider.component";

@Component({
    selector: "mona-slider",
    templateUrl: "./../abstract-slider/abstract-slider.component.html",
    styleUrls: ["./../abstract-slider/abstract-slider.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SliderComponent),
            multi: true
        }
    ]
})
export class SliderComponent
    extends AbstractSliderComponent
    implements OnInit, AfterViewInit, OnDestroy, OnChanges, ControlValueAccessor
{
    protected override propagateChange: Action<any> | null = null;
    public override ranged: boolean = false;

    @Input()
    public override value: number | null = null;

    @Output()
    public override valueChange: EventEmitter<number> = new EventEmitter<number>();

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
                Math.max(this.minValue, Math.min(this.maxValue, this.value)),
                Math.max(this.minValue, Math.min(this.maxValue, this.value))
            ];
        }
    }

    protected override emitValues(): void {
        this.value = this.handlerValues[0];
        this.valueChange.emit(this.value);
        this.propagateChange?.(this.value);
    }
}
