import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: "mona-chip",
    templateUrl: "./chip.component.html",
    styleUrls: ["./chip.component.scss"]
})
export class ChipComponent implements OnInit {
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
