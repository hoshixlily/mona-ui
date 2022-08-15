import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
    selector: "mona-text-box",
    templateUrl: "./text-box.component.html",
    styleUrls: ["./text-box.component.scss"]
})
export class TextBoxComponent implements OnInit {
    @Input()
    public disabled: boolean = false;

    @Output()
    public inputBlur: EventEmitter<Event> = new EventEmitter<Event>();

    @Output()
    public inputFocus: EventEmitter<Event> = new EventEmitter<Event>();

    public constructor() {}
    public ngOnInit(): void {}
}
