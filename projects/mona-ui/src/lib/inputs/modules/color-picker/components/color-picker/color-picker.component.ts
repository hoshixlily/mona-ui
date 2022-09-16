import { Component, Input, OnInit } from "@angular/core";
import { faChevronDown, IconDefinition } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "mona-color-picker",
    templateUrl: "./color-picker.component.html",
    styleUrls: ["./color-picker.component.scss"]
})
export class ColorPickerComponent implements OnInit {
    public readonly dropdownIcon: IconDefinition = faChevronDown;

    public selectedColor: string | null = null;

    @Input()
    public palette: string[] = [];

    public constructor() {}

    public ngOnInit(): void {}
}
