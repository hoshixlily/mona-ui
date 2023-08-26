import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { BreadcrumbItem } from "../models/BreadcrumbItem";

import { BreadcrumbComponent } from "./breadcrumb.component";

@Component({
    template: ` <mona-breadcrumb [items]="items" (itemClick)="onItemClick($event)"></mona-breadcrumb> `,
    standalone: true,
    imports: [BreadcrumbComponent]
})
class TestHostComponent {
    public items: BreadcrumbItem[] = [
        {
            text: "Home",
            title: "Home"
        },
        {
            text: "Products",
            title: "Products"
        },
        {
            text: "Product 1",
            title: "First product"
        }
    ];

    public onItemClick(item: BreadcrumbItem): void {
        console.log(item);
    }
}

describe("BreadcrumbComponent", () => {
    let component: BreadcrumbComponent;
    let hostComponent: TestHostComponent;
    let fixture: ComponentFixture<BreadcrumbComponent>;
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BreadcrumbComponent, TestHostComponent]
        });
        fixture = TestBed.createComponent(BreadcrumbComponent);
        hostFixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        hostComponent = hostFixture.componentInstance;
        fixture.detectChanges();
        hostFixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should render the correct number of items", () => {
        const items = hostFixture.debugElement
            .queryAll(By.css(".mona-breadcrumb-item"))
            .map(li => li.nativeElement) as HTMLLIElement[];
        expect(items.length).toBe(3);
    });

    it("should render the correct number of separators", () => {
        const separators = hostFixture.debugElement
            .queryAll(By.css(".mona-breadcrumb-separator"))
            .map(li => li.nativeElement) as HTMLLIElement[];
        expect(separators.length).toBe(2);
    });

    it("should render the correct number of items when the items are changed", () => {
        hostComponent.items = [
            {
                text: "Home",
                title: "Home"
            },
            {
                text: "Products",
                title: "Products"
            },
            {
                text: "Product 1",
                title: "First product"
            },
            {
                text: "Product 2",
                title: "Second product"
            }
        ];
        hostFixture.detectChanges();
        const items = hostFixture.debugElement
            .queryAll(By.css(".mona-breadcrumb-item"))
            .map(li => li.nativeElement) as HTMLLIElement[];
        expect(items.length).toBe(4);
    });

    it("should show the title of the item when the mouse is over the item", () => {
        const breadcrumbItems = hostFixture.debugElement
            .queryAll(By.css(".mona-breadcrumb-item"))
            .map(li => li.nativeElement) as HTMLLIElement[];
        breadcrumbItems[0].dispatchEvent(new MouseEvent("mouseover"));
        hostFixture.detectChanges();
        expect(breadcrumbItems[0].getAttribute("title")).toBe("Home");
    });

    it("should emit the correct item when an item is clicked", () => {
        const spy = spyOn(hostComponent, "onItemClick");
        const breadcrumbItems = hostFixture.debugElement
            .queryAll(By.css(".mona-breadcrumb-item"))
            .map(li => li.nativeElement) as HTMLLIElement[];
        breadcrumbItems[0].dispatchEvent(new MouseEvent("click"));
        hostFixture.detectChanges();
        expect(spy).toHaveBeenCalledWith(hostComponent.items[0]);
    });
});
