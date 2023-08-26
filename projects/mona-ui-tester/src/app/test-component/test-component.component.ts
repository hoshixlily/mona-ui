import { Component, OnInit } from "@angular/core";
import { PopupRef } from "mona-ui";

@Component({
    selector: "app-test-component",
    templateUrl: "./test-component.component.html",
    styleUrls: ["./test-component.component.scss"]
})
export class TestComponentComponent implements OnInit {
    public constructor(private readonly popupRef: PopupRef) {}

    public ngOnInit(): void {
        console.log(this.popupRef);
    }
}
