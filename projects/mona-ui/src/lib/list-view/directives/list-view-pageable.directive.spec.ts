import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ListService } from "../../common/list/services/list.service";
import { ListViewComponent } from "../components/list-view/list-view.component";
import { ListViewPageableDirective } from "./list-view-pageable.directive";

@Component({
    imports: [ListViewPageableDirective, ListViewComponent],
    providers: [ListService],
    template: ` <mona-list-view [items]="data" textField="name" monaListViewPageable></mona-list-view> `
})
class TestComponent {
    protected readonly data: any[] = [
        {
            id: 1,
            name: "name"
        },
        {
            id: 2,
            name: "name"
        }
    ];
}

describe("ListViewPageableDirective", () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent, BrowserAnimationsModule],
            providers: [ListService]
        }).compileComponents();
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it("should create an instance", () => {
        expect(component).toBeTruthy();
    });
});
