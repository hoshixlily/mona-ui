import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { DropDownListComponent, NumericTextBoxComponent } from "mona-ui";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { PagerComponent } from "./pager.component";

describe("PagerComponent", () => {
    let component: PagerComponent;
    let fixture: ComponentFixture<PagerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [PagerComponent, ButtonDirective],
            providers: [provideAnimations()]
        });
        fixture = TestBed.createComponent(PagerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a default page size of 10", () => {
        expect(component.pagerPageSize()).toEqual(10);
    });

    it("should have a default page of 1", () => {
        expect(component.page()).toEqual(1);
    });

    it("should have a default total pages of 0", () => {
        expect(component.totalPages()).toEqual(0);
    });

    it("should render first and last page buttons if firstLast is true", () => {
        fixture.componentRef.setInput("firstLast", true);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector(".mona-pager-first-page")).toBeTruthy();
        expect(compiled.querySelector(".mona-pager-last-page")).toBeTruthy();
    });

    it("should not render first and last page buttons if firstLast is false", () => {
        fixture.componentRef.setInput("firstLast", false);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector(".mona-pager-first-page")).toBeFalsy();
        expect(compiled.querySelector(".mona-pager-last-page")).toBeFalsy();
    });

    it("should render next and previous page buttons if nextPrevious is true", () => {
        fixture.componentRef.setInput("previousNext", true);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector(".mona-pager-next-page")).toBeTruthy();
        expect(compiled.querySelector(".mona-pager-previous-page")).toBeTruthy();
    });

    it("should not render next and previous page buttons if nextPrevious is false", () => {
        fixture.componentRef.setInput("previousNext", false);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector(".mona-pager-next-page")).toBeFalsy();
        expect(compiled.querySelector(".mona-pager-previous-page")).toBeFalsy();
    });

    it("should go to the first page when the first page button is clicked", () => {
        setupPager(fixture);
        expect(component.page()).toEqual(2);
        const compiled = fixture.nativeElement;
        const button = compiled.querySelector(".mona-pager-first-page button") as HTMLButtonElement;
        button.click();
        fixture.detectChanges();
        expect(component.page()).toEqual(1);
    });

    it("should go to the last page when the last page button is clicked", () => {
        setupPager(fixture);
        expect(component.page()).toEqual(2);
        const compiled = fixture.nativeElement;
        const button = compiled.querySelector(".mona-pager-last-page button") as HTMLButtonElement;
        button.click();
        fixture.detectChanges();
        expect(component.page()).toEqual(10);
    });

    it("should go to the next page when the next page button is clicked", () => {
        setupPager(fixture);
        expect(component.page()).toEqual(2);
        const compiled = fixture.nativeElement;
        const button = compiled.querySelector(".mona-pager-next-page button") as HTMLButtonElement;
        button.click();
        fixture.detectChanges();
        expect(component.page()).toEqual(3);
    });

    it("should go to the previous page when the previous page button is clicked", () => {
        setupPager(fixture, 20);
        expect(component.page()).toEqual(3);
        const compiled = fixture.nativeElement;
        const button = compiled.querySelector(".mona-pager-previous-page button") as HTMLButtonElement;
        button.click();
        fixture.detectChanges();
        expect(component.page()).toEqual(2);
    });

    it("should render visiblePages number of pages", () => {
        setupBigPager(fixture, 50);
        fixture.componentRef.setInput("visiblePages", 7);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        const prevPage = compiled.querySelector(".mona-pager-previous-page") as HTMLLIElement;
        const nextPage = compiled.querySelector(".mona-pager-next-page") as HTMLLIElement;
        const middlePartFirstPage = prevPage.nextElementSibling?.nextElementSibling
            ?.nextElementSibling as HTMLLIElement;
        const middlePartLastPage = nextPage.previousElementSibling?.previousElementSibling
            ?.previousElementSibling as HTMLLIElement;

        // skipped 50 pages, so we are on page 11
        // visiblePageCount is 7, so we should see pages 8-14
        expect(middlePartFirstPage.textContent).toEqual("8");
        expect(middlePartLastPage.textContent).toEqual("14");
    });
    it("should go back visiblePages number of pages when the previous jump button is clicked", () => {
        setupBigPager(fixture, 100);
        fixture.componentRef.setInput("visiblePages", 7);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        const prevPage = compiled.querySelector(".mona-pager-previous-page") as HTMLLIElement;
        const nextPage = compiled.querySelector(".mona-pager-next-page") as HTMLLIElement;
        let middlePartFirstPage = prevPage.nextElementSibling?.nextElementSibling?.nextElementSibling as HTMLLIElement;
        let middlePartLastPage = nextPage.previousElementSibling?.previousElementSibling
            ?.previousElementSibling as HTMLLIElement;
        expect(middlePartFirstPage.textContent).toEqual("18");
        expect(middlePartLastPage.textContent).toEqual("24");

        const jumpBackButton = middlePartFirstPage.previousElementSibling?.firstElementChild as HTMLButtonElement;
        jumpBackButton.click();
        fixture.detectChanges();

        middlePartFirstPage = prevPage.nextElementSibling?.nextElementSibling?.nextElementSibling as HTMLLIElement;
        middlePartLastPage = nextPage.previousElementSibling?.previousElementSibling
            ?.previousElementSibling as HTMLLIElement;

        expect(middlePartFirstPage.textContent).toEqual("11");
        expect(middlePartLastPage.textContent).toEqual("17");
    });

    it("should go forward visiblePages number of pages when the next jump button is clicked", () => {
        setupBigPager(fixture, 100);
        fixture.componentRef.setInput("visiblePages", 7);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        const prevPage = compiled.querySelector(".mona-pager-previous-page") as HTMLLIElement;
        const nextPage = compiled.querySelector(".mona-pager-next-page") as HTMLLIElement;
        let middlePartFirstPage = prevPage.nextElementSibling?.nextElementSibling?.nextElementSibling as HTMLLIElement;
        let middlePartLastPage = nextPage.previousElementSibling?.previousElementSibling
            ?.previousElementSibling as HTMLLIElement;
        expect(middlePartFirstPage.textContent).toEqual("18");
        expect(middlePartLastPage.textContent).toEqual("24");

        const jumpForwardButton = middlePartLastPage.nextElementSibling?.firstElementChild as HTMLButtonElement;
        jumpForwardButton.click();
        fixture.detectChanges();

        middlePartFirstPage = prevPage.nextElementSibling?.nextElementSibling?.nextElementSibling as HTMLLIElement;
        middlePartLastPage = nextPage.previousElementSibling?.previousElementSibling
            ?.previousElementSibling as HTMLLIElement;

        expect(middlePartFirstPage.textContent).toEqual("25");
        expect(middlePartLastPage.textContent).toEqual("31");
    });

    it("should set the data of the dropdown list of page sizes", fakeAsync(() => {
        setupBigPager(fixture);
        fixture.componentRef.setInput("pageSizeValues", [1, 2, 3, 4, 5]);
        fixture.detectChanges();
        const dropdownList = fixture.debugElement.query(By.directive(DropDownListComponent));
        dropdownList.nativeElement.firstElementChild.click();
        fixture.detectChanges();
        tick();

        const list = getDropdownList();
        const items = list.querySelectorAll("li");
        expect(list.children.length).toEqual(5);
        const contents = Array.from(items)
            .map(item => item.textContent?.trim())
            .map(Number);
        expect(contents).toEqual([1, 2, 3, 4, 5]);
    }));

    it("should set the data of the dropdown list of page sizes to default values if pageSizeValues is true", fakeAsync(() => {
        setupBigPager(fixture);
        fixture.componentRef.setInput("pageSizeValues", true);
        fixture.detectChanges();
        const dropdownList = fixture.debugElement.query(By.directive(DropDownListComponent));
        dropdownList.nativeElement.firstElementChild.click();
        fixture.detectChanges();
        tick();

        const list = getDropdownList();
        const items = list.querySelectorAll("li");
        expect(list.children.length).toEqual(5);
        const contents = Array.from(items)
            .map(item => item.textContent?.trim())
            .map(Number);
        expect(contents).toEqual([5, 10, 20, 50, 100]);
    }));

    it("should hide the dropdown list of page sizes if pageSizeValues is false", fakeAsync(() => {
        setupBigPager(fixture);
        fixture.componentRef.setInput("pageSizeValues", false);
        fixture.detectChanges();
        const dropdownList = fixture.debugElement.query(By.directive(DropDownListComponent));
        expect(dropdownList).toBeFalsy();
    }));

    it("should set the page size to the selected value when a dropdown list item is clicked", fakeAsync(() => {
        setupBigPager(fixture);
        fixture.componentRef.setInput("pageSizeValues", [1, 2, 3, 4, 5]);
        fixture.detectChanges();
        const dropdownList = fixture.debugElement.query(By.directive(DropDownListComponent));
        dropdownList.nativeElement.firstElementChild.click();
        fixture.detectChanges();
        tick();

        const list = getDropdownList();
        const items = list.querySelectorAll("li");
        const item = items[2];
        item.click();
        fixture.detectChanges();
        tick();
        expect(component.pagerPageSize()).toEqual(3);
    }));

    it("should emit a page size change event when a dropdown list item is clicked", fakeAsync(() => {
        setupBigPager(fixture);
        fixture.componentRef.setInput("pageSizeValues", [1, 2, 3, 4, 5]);
        fixture.detectChanges();
        const dropdownList = fixture.debugElement.query(By.directive(DropDownListComponent));
        dropdownList.nativeElement.firstElementChild.click();
        fixture.detectChanges();
        tick();

        const list = getDropdownList();
        const items = list.querySelectorAll("li");
        const item = items[2];

        component.pageSizeChange.subscribe(event => {
            expect(event.newPageSize).toEqual(3);
            expect(event.oldPageSize).toEqual(5);
        });

        spyOn(component.pageSizeChange, "emit").and.callThrough();
        item.click();
        fixture.detectChanges();
        tick();
    }));

    it("should not change the page size if the emitted page size change event is prevented", fakeAsync(() => {
        setupBigPager(fixture);
        fixture.componentRef.setInput("pageSizeValues", [1, 2, 3, 4, 5]);
        fixture.componentRef.setInput("pageSize", 5);
        fixture.detectChanges();
        const dropdownList = fixture.debugElement.query(By.directive(DropDownListComponent));
        dropdownList.nativeElement.firstElementChild.click();
        fixture.detectChanges();
        tick();

        const list = getDropdownList();
        const items = list.querySelectorAll("li");
        const item = items[2];

        component.pageSizeChange.subscribe(event => {
            event.preventDefault();
        });

        spyOn(component.pageSizeChange, "emit").and.callThrough();
        item.click();
        fixture.detectChanges();
        tick();
        expect(component.pagerPageSize()).toEqual(5);
    }));

    it("should not emit page size change if the selected page size is the same as the current page size", fakeAsync(() => {
        setupBigPager(fixture);
        fixture.componentRef.setInput("pageSizeValues", [1, 2, 3, 4, 5]);
        fixture.componentRef.setInput("pageSize", 5);
        fixture.detectChanges();
        const dropdownList = fixture.debugElement.query(By.directive(DropDownListComponent));
        dropdownList.nativeElement.firstElementChild.click();
        fixture.detectChanges();
        tick();

        const list = getDropdownList();
        const items = list.querySelectorAll("li");
        const item = items[4];

        component.pageSizeChange.subscribe(event => {
            fail("Should not emit page size change");
        });

        const eventSpy = spyOn(component.pageSizeChange, "emit").and.callThrough();
        item.click();
        fixture.detectChanges();
        tick();
        expect(eventSpy).not.toHaveBeenCalled();
    }));

    it("should change the current page if input value is changed", fakeAsync(() => {
        setupBigPager(fixture);
        fixture.componentRef.setInput("pageInput", true);
        fixture.detectChanges();
        const numericTextBox = fixture.debugElement.query(By.directive(NumericTextBoxComponent));
        const numericTextBoxInstance = numericTextBox.componentInstance as NumericTextBoxComponent;
        numericTextBoxInstance.writeValue(5);
        fixture.detectChanges();
        tick();
        const inputElement = numericTextBox.query(By.css("input"));
        inputElement.nativeElement.dispatchEvent(new Event("input"));
        inputElement.nativeElement.dispatchEvent(new Event("blur"));
        fixture.detectChanges();
        tick();
        expect(component.page()).toEqual(5);
    }));

    it("should set the page to 1 if the input value is less than 1", fakeAsync(() => {
        setupBigPager(fixture);
        fixture.componentRef.setInput("pageInput", true);
        fixture.detectChanges();
        const numericTextBox = fixture.debugElement.query(By.directive(NumericTextBoxComponent));
        const numericTextBoxInstance = numericTextBox.componentInstance as NumericTextBoxComponent;
        numericTextBoxInstance.writeValue(0);
        fixture.detectChanges();
        tick();
        const inputElement = numericTextBox.query(By.css("input"));
        inputElement.nativeElement.dispatchEvent(new Event("input"));
        inputElement.nativeElement.dispatchEvent(new Event("blur"));
        fixture.detectChanges();
        tick();
        expect(component.page()).toEqual(1);
    }));

    it("should set the page to the last page if the input value is greater than the last page", fakeAsync(() => {
        setupBigPager(fixture);
        fixture.componentRef.setInput("pageInput", true);
        fixture.detectChanges();
        const numericTextBox = fixture.debugElement.query(By.directive(NumericTextBoxComponent));
        const numericTextBoxInstance = numericTextBox.componentInstance as NumericTextBoxComponent;
        numericTextBoxInstance.writeValue(250);
        fixture.detectChanges();
        tick();
        const inputElement = numericTextBox.query(By.css("input"));
        inputElement.nativeElement.dispatchEvent(new Event("input"));
        inputElement.nativeElement.dispatchEvent(new Event("blur"));
        fixture.detectChanges();
        tick();
        expect(component.page()).toEqual(200);
    }));
    it("should not emit page change if the clicked page is the same as the current page", fakeAsync(() => {
        const pageChangeSpy = spyOn(component.pageChange, "emit");
        setupBigPager(fixture);
        fixture.detectChanges();
        fixture.componentRef.setInput("skip", 0);
        fixture.detectChanges();
        fixture.componentInstance.onPageClick(1);
        fixture.detectChanges();
        expect(pageChangeSpy).not.toHaveBeenCalled();
    }));
});

function setupPager(fixture: ComponentFixture<PagerComponent>, skip: number = 10) {
    fixture.componentRef.setInput("total", 100);
    fixture.componentRef.setInput("pageSize", 10);
    fixture.componentRef.setInput("skip", skip);
    fixture.detectChanges();
}

function setupBigPager(fixture: ComponentFixture<PagerComponent>, skip: number = 0) {
    fixture.componentRef.setInput("total", 1000);
    fixture.componentRef.setInput("pageSize", 5);
    fixture.componentRef.setInput("skip", skip);
    fixture.detectChanges();
}

function getDropdownList(): HTMLUListElement {
    return document.querySelector(".mona-dropdown-popup-content ul") as HTMLUListElement;
}
