import { Component } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { DateTime } from "luxon";

import { CalendarComponent } from "./calendar.component";

@Component({
    template: `<mona-calendar [ngModel]="date" (ngModelChange)="onDateChange($event)"></mona-calendar>`,
    standalone: true,
    imports: [CalendarComponent, FormsModule]
})
class CalendarComponentTestComponent {
    public date: Date = new Date();

    public onDateChange(date: Date): void {
        this.date = date;
    }
}

describe("CalendarComponent", () => {
    let component: CalendarComponent;
    let fixture: ComponentFixture<CalendarComponent>;
    let hostComponent: CalendarComponentTestComponent;
    let hostFixture: ComponentFixture<CalendarComponentTestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CalendarComponent, CalendarComponentTestComponent, FormsModule]
        });
        fixture = TestBed.createComponent(CalendarComponent);
        component = fixture.componentInstance;

        hostFixture = TestBed.createComponent(CalendarComponentTestComponent);
        hostComponent = hostFixture.componentInstance;

        fixture.detectChanges();
        hostFixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should set the current date to today", () => {
        const now = DateTime.now();
        const calendarDate = DateTime.fromJSDate(component.navigatedDate);
        expect(now.hasSame(calendarDate, "day")).toBeTrue();
        expect(now.hasSame(calendarDate, "month")).toBeTrue();
        expect(now.hasSame(calendarDate, "year")).toBeTrue();
    });

    it("should set the current date to the date passed in", () => {
        const date = DateTime.fromJSDate(setCalendarDate(hostFixture));

        const calendarDate = DateTime.fromJSDate(hostComponent.date);
        expect(date.hasSame(calendarDate, "day")).toBeTrue();
        expect(date.hasSame(calendarDate, "month")).toBeTrue();
        expect(date.hasSame(calendarDate, "year")).toBeTrue();
    });

    it("should start the calendar on 28th of the previous month", () => {
        setCalendarDate(hostFixture);

        const table = hostFixture.nativeElement.querySelector("table");
        const firstDay = table.querySelector("tbody tr td:first-child");
        expect(firstDay.textContent).toBe("28");
    });

    it("should have 35 days in the calendar", () => {
        setCalendarDate(hostFixture);

        const table = hostFixture.nativeElement.querySelector("table");
        const days = table.querySelectorAll("tbody tr td");
        expect(days.length).toBe(35);
    });

    it("should have 16th of the month selected", fakeAsync(() => {
        setCalendarDate(hostFixture);

        tick();
        hostFixture.detectChanges();
        tick();
        hostFixture.detectChanges();

        const table = hostFixture.debugElement.query(By.css("table"));
        const selected = table.query(By.css(".mona-selected"));
        expect(selected.nativeElement.textContent).toBe("16");
    }));

    it("should select the day when clicked", fakeAsync(() => {
        setCalendarDate(hostFixture);

        tick();
        hostFixture.detectChanges();
        tick();
        hostFixture.detectChanges();

        const table = hostFixture.debugElement.query(By.css("table"));
        const day = table.query(By.css("tbody tr td:first-child"));
        day.nativeElement.click();
        tick();
        hostFixture.detectChanges();
        tick();
        hostFixture.detectChanges();

        const selected = table.query(By.css(".mona-selected"));
        expect(selected.nativeElement.textContent).toBe("28");
    }));

    it("should switch to year view", fakeAsync(() => {
        setCalendarDate(hostFixture);
        switchToYearView(hostFixture);
        const table = hostFixture.debugElement.query(By.css("table"));
        const month = table.query(By.css("tr td:first-child"));
        expect(month.nativeElement.textContent).toBe("Jan");
    }));

    it("should switch to decade view", fakeAsync(() => {
        setCalendarDate(hostFixture);
        switchToDecadeView(hostFixture);
        const table = hostFixture.debugElement.query(By.css("table"));
        const year = table.query(By.css("tr td:first-child"));
        expect(year.nativeElement.textContent).toBe("2020");
    }));

    it("should navigate to next decade", fakeAsync(() => {
        setCalendarDate(hostFixture);
        switchToDecadeView(hostFixture);
        navigateCalendar(hostFixture, "next");
        const table = hostFixture.debugElement.query(By.css("table"));
        const year = table.query(By.css("tr td:first-child"));
        expect(year.nativeElement.textContent).toBe("2030");
    }));

    it("should navigate to previous decade", fakeAsync(() => {
        setCalendarDate(hostFixture);
        switchToDecadeView(hostFixture);
        navigateCalendar(hostFixture, "prev");
        const table = hostFixture.debugElement.query(By.css("table"));
        const year = table.query(By.css("tr td:first-child"));
        expect(year.nativeElement.textContent).toBe("2010");
    }));

    it("should navigate to next year", fakeAsync(() => {
        setCalendarDate(hostFixture);
        switchToYearView(hostFixture);
        navigateCalendar(hostFixture, "next");
        const table = hostFixture.debugElement.query(By.css("table"));
        const month = table.query(By.css("tr td:first-child"));
        expect(month.nativeElement.textContent).toBe("Jan");
    }));

    it("should navigate to previous year", fakeAsync(() => {
        setCalendarDate(hostFixture);
        switchToYearView(hostFixture);
        navigateCalendar(hostFixture, "prev");
        const table = hostFixture.debugElement.query(By.css("table"));
        const month = table.query(By.css("tr td:first-child"));
        expect(month.nativeElement.textContent).toBe("Jan");
    }));

    it("should navigate to next month", fakeAsync(() => {
        setCalendarDate(hostFixture);
        navigateCalendar(hostFixture, "next");
        const table = hostFixture.debugElement.query(By.css("table"));
        const day = table.query(By.css("tbody tr td:first-child"));
        expect(day.nativeElement.textContent).toBe("28");
    }));

    it("should navigate to previous month", fakeAsync(() => {
        setCalendarDate(hostFixture);
        navigateCalendar(hostFixture, "prev");
        const table = hostFixture.debugElement.query(By.css("table"));
        const day = table.query(By.css("tbody tr td:first-child"));
        expect(day.nativeElement.textContent).toBe("28");
    }));

    it("should switch to year view when year is clicked", fakeAsync(() => {
        setCalendarDate(hostFixture);
        switchToDecadeView(hostFixture);
        const table = hostFixture.debugElement.query(By.css("table"));
        const year = table.query(By.css("tr td:first-child"));
        year.nativeElement.click();
        tick();
        hostFixture.detectChanges();
        tick();
        hostFixture.detectChanges();
        const monthTable = hostFixture.debugElement.query(By.css("table"));
        const month = monthTable.query(By.css("tr td:first-child"));
        expect(month.nativeElement.textContent).toBe("Jan");
    }));

    it("should switch to month view when month is clicked", fakeAsync(() => {
        setCalendarDate(hostFixture);
        switchToYearView(hostFixture);
        const table = hostFixture.debugElement.query(By.css("table"));
        const month = table.query(By.css("tr td:first-child"));
        month.nativeElement.click();
        tick();
        hostFixture.detectChanges();
        tick();
        hostFixture.detectChanges();
        const dayTable = hostFixture.debugElement.query(By.css("table"));
        const day = dayTable.query(By.css("tbody tr td:first-child"));
        expect(day.nativeElement.textContent).toBe("26");
    }));

    it("should add a full row of next month's days if the last day of the month is Sunday", fakeAsync(() => {
        setCalendarDate(hostFixture, DateTime.fromISO("2021-10-31").toJSDate());
        tick();
        hostFixture.detectChanges();
        tick();
        hostFixture.detectChanges();
        const table = hostFixture.debugElement.query(By.css("table"));
        const days = table.queryAll(By.css("tbody tr td"));
        expect(days.length).toBe(42);
    }));
});

function switchToYearView(fixture: ComponentFixture<CalendarComponentTestComponent>): void {
    const header = fixture.debugElement.query(By.css(".mona-calendar-header"));
    const monthButton = header.query(By.css("div:nth-child(2) button"));
    monthButton.nativeElement.click();

    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
}

function switchToDecadeView(fixture: ComponentFixture<CalendarComponentTestComponent>): void {
    switchToYearView(fixture);

    const yearHeader = fixture.debugElement.query(By.css(".mona-calendar-header"));
    const yearButton = yearHeader.query(By.css("div:nth-child(2) button"));
    yearButton.nativeElement.click();

    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
}

function navigateCalendar(fixture: ComponentFixture<CalendarComponentTestComponent>, direction: "prev" | "next"): void {
    const header = fixture.debugElement.query(By.css(".mona-calendar-header"));
    const child = direction === "prev" ? 1 : 3;
    const monthButton = header.query(By.css(`div:nth-child(${child}) button`));
    monthButton.nativeElement.click();

    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
}

function setCalendarDate(
    fixture: ComponentFixture<CalendarComponentTestComponent>,
    date: Date = DateTime.fromISO("2023-09-16").toJSDate()
): Date {
    fixture.componentInstance.date = date;
    fixture.detectChanges();

    return date;
}
