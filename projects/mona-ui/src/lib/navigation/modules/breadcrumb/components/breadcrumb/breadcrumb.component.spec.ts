import { Component } from "@angular/core";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { BreadcrumbModule } from "../../breadcrumb.module";
import { BreadcrumbItem } from "../../models/BreadcrumbItem";

import { BreadcrumbComponent } from "./breadcrumb.component";

@Component({
    template: ` <mona-breadcrumb [items]="items" (itemClick)="onItemClick($event)"></mona-breadcrumb> `
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
    let spectator: Spectator<BreadcrumbComponent>;
    const createComponent = createComponentFactory({
        component: BreadcrumbComponent,
        imports: []
    });
    let hostSpectator: Spectator<TestHostComponent>;
    const createHostComponent = createComponentFactory({
        component: TestHostComponent,
        imports: [BreadcrumbModule, FontAwesomeTestingModule]
    });

    beforeEach(() => {
        spectator = createComponent();
        hostSpectator = createHostComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });

    it("should render the correct number of items", () => {
        expect(hostSpectator.queryAll(".mona-breadcrumb-item").length).toBe(3);
    });

    it("should render the correct number of separators", () => {
        expect(hostSpectator.queryAll(".mona-breadcrumb-separator").length).toBe(2);
    });

    it("should render the correct number of items when the items are changed", () => {
        hostSpectator.component.items = [
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
        hostSpectator.detectChanges();
        expect(hostSpectator.queryAll(".mona-breadcrumb-item").length).toBe(4);
    });

    it("should show the title of the item when the mouse is over the item", () => {
        const breadcrumbItems = hostSpectator.queryAll(".mona-breadcrumb-item");
        breadcrumbItems[0].dispatchEvent(new MouseEvent("mouseover"));
        hostSpectator.detectChanges();
        expect(breadcrumbItems[0].getAttribute("title")).toBe("Home");
    });

    it("should emit the correct item when an item is clicked", () => {
        const spy = spyOn(hostSpectator.component, "onItemClick");
        const breadcrumbItems = hostSpectator.queryAll(".mona-breadcrumb-item");
        breadcrumbItems[0].dispatchEvent(new MouseEvent("click"));
        hostSpectator.detectChanges();
        expect(spy).toHaveBeenCalledWith(hostSpectator.component.items[0]);
    });
});
