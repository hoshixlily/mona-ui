import { NgClass, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ButtonDirective } from "../button/button.directive";

@Component({
    selector: "mona-chip",
    templateUrl: "./chip.component.html",
    styleUrls: ["./chip.component.scss"],
    standalone: true,
    imports: [NgClass, NgIf, ButtonDirective, FontAwesomeModule]
})
export class ChipComponent implements OnInit {
    public readonly closeIcon: IconDefinition = faTimes;

    @Input()
    public disabled: boolean = false;

    @Input()
    public label: string = "";

    @Input()
    public removable: boolean = false;

    @Output()
    public remove: EventEmitter<Event> = new EventEmitter<Event>();

    @Input()
    public tabindex: number = 0;

    public constructor() {}

    public ngOnInit(): void {}
}
