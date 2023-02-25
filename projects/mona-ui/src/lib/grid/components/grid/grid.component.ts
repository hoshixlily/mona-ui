import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { GridService } from "../../services/grid.service";

@Component({
    selector: "mona-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [GridService]
})
export class GridComponent implements OnInit, AfterViewInit {
    @ViewChild("gridHeaderElement")
    public set gridHeaderElement(value: ElementRef<HTMLDivElement>) {
        this.gridService.gridHeaderElement = value.nativeElement;
        window.setTimeout(() => this.setInitialMinWidthOfColumns());
    }

    @Input()
    public resizable: boolean = true;

    public constructor(public readonly gridService: GridService) {}

    public ngAfterViewInit(): void {}

    public ngOnInit(): void {}

    private setInitialMinWidthOfColumns(): void {
        if (this.gridService.gridHeaderElement) {
            const thList = this.gridService.gridHeaderElement?.querySelectorAll("th");
            for (const [cx, column] of Array.from(thList).entries()) {
                const columnWidth = column.offsetWidth;
                this.gridService.columns[cx].calculatedWidth = columnWidth;
            }
        }
    }

    public get headerMargin(): string {
        return `0 12px 0 0`;
    }
}
