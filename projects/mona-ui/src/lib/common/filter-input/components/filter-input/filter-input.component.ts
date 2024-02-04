import {
    afterNextRender,
    Component,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    Injector,
    Input,
    OnInit,
    Output,
    signal,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { debounceTime, fromEvent, Subject } from "rxjs";
import { TextBoxComponent } from "../../../../inputs/text-box/components/text-box/text-box.component";
import { TextBoxPrefixTemplateDirective } from "../../../../inputs/text-box/directives/text-box-prefix-template.directive";
import { FilterChangeEvent } from "../../models/FilterChangeEvent";

@Component({
    selector: "mona-filter-input",
    standalone: true,
    imports: [TextBoxComponent, FormsModule, TextBoxPrefixTemplateDirective, FaIconComponent],
    templateUrl: "./filter-input.component.html",
    styleUrl: "./filter-input.component.scss"
})
export class FilterInputComponent implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #injector: Injector = inject(Injector);
    protected readonly filter$: Subject<string> = new Subject<string>();
    protected readonly filterIcon = faSearch;
    protected readonly filterPlaceholder: WritableSignal<string> = signal("");
    protected readonly filterText: WritableSignal<string> = signal("");

    @Input()
    public debounce: number = 0;

    @Input()
    public set filter(value: string) {
        this.filterText.set(value);
    }

    @Output()
    public filterChange: EventEmitter<FilterChangeEvent> = new EventEmitter<FilterChangeEvent>();

    @Input()
    public set placeholder(value: string) {
        this.filterPlaceholder.set(value);
    }

    public constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    private setSubscriptions(): void {
        this.filter$.pipe(debounceTime(this.debounce), takeUntilDestroyed(this.#destroyRef)).subscribe(value => {
            const event = new FilterChangeEvent(value);
            this.filterChange.emit(event);
            if (!event.isDefaultPrevented()) {
                this.filterText.set(value);
            }
        });
        afterNextRender(
            () => {
                fromEvent<KeyboardEvent>(this.elementRef.nativeElement.querySelector("input") as HTMLElement, "keydown")
                    .pipe(takeUntilDestroyed(this.#destroyRef))
                    .subscribe((event: KeyboardEvent) => {
                        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                            event.preventDefault();
                            const input = event.target as HTMLInputElement;
                            input.selectionStart = input.selectionEnd = input.value.length;
                        }
                    });
            },
            { injector: this.#injector }
        );
    }
}