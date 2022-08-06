import { Component } from "@angular/core";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent {
    public onButtonSelectedChange(selected: boolean): void {
        console.log(`Button selected: ${selected}`);
    }
}
