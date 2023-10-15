import { Component } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { Enumerable } from "@mirei/ts-collections";
import { DateTime } from "luxon";
import { CalendarComponent } from "./calendar.component";

@Component({
    template: ` <mona-calendar
        [disabled]="disabled"
        [ngModel]="date"
        [min]="min"
        [max]="max"
        [disabledDates]="disabledDates"
        (ngModelChange)="onDateChange($event)"></mona-calendar>`,
    standalone: true,
    imports: [CalendarComponent, FormsModule]
})
class CalendarComponentTestComponent {
    public date: Date | null = new Date();
    public disabled: boolean = false;
    public disabledDates: Date[] = [];
    public max: Date | null = null;
    public min: Date | null = null;

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
        const date = DateTime.fromJSDate(setCalendarDateOfHost(hostFixture) as Date);

        const calendarDate = DateTime.fromJSDate(hostComponent.date as Date);
        expect(date.hasSame(calendarDate, "day")).toBeTrue();
        expect(date.hasSame(calendarDate, "month")).toBeTrue();
        expect(date.hasSame(calendarDate, "year")).toBeTrue();
    });

    it("should start the calendar on 28th of the previous month", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture);
        hostFixture.detectChanges();
        tick();
        hostFixture.detectChanges();

        const table = hostFixture.nativeElement.querySelector("table");
        const firstDay = table.querySelector("tbody tr td:first-child");
        expect(firstDay.textContent).toBe("28");
    }));

    it("should have 35 days in the calendar", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture);
        tick();
        hostFixture.detectChanges();

        const table = hostFixture.nativeElement.querySelector("table");
        const days = table.querySelectorAll("tbody tr td");
        expect(days.length).toBe(35);
    }));

    it("should have 16th of the month selected", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture);

        tick();
        hostFixture.detectChanges();
        tick();
        hostFixture.detectChanges();

        const table = hostFixture.debugElement.query(By.css("table"));
        const selected = table.query(By.css(".mona-selected"));
        expect(selected.nativeElement.textContent).toBe("16");
    }));

    it("should select the day when clicked", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture);

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
        setCalendarDateOfHost(hostFixture);
        switchToYearView(hostFixture);
        const table = hostFixture.debugElement.query(By.css("table"));
        const month = table.query(By.css("tr td:first-child"));
        expect(month.nativeElement.textContent).toBe("Jan");
    }));

    it("should switch to decade view", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture);
        switchToDecadeView(hostFixture);
        const table = hostFixture.debugElement.query(By.css("table"));
        const year = table.query(By.css("tr td:first-child"));
        expect(year.nativeElement.textContent).toBe("2020");
    }));

    it("should navigate to next decade", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture);
        switchToDecadeView(hostFixture);
        navigateCalendar(hostFixture, "next");
        const table = hostFixture.debugElement.query(By.css("table"));
        const year = table.query(By.css("tr td:first-child"));
        expect(year.nativeElement.textContent).toBe("2030");
    }));

    it("should navigate to previous decade", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture);
        switchToDecadeView(hostFixture);
        navigateCalendar(hostFixture, "prev");
        const table = hostFixture.debugElement.query(By.css("table"));
        const year = table.query(By.css("tr td:first-child"));
        expect(year.nativeElement.textContent).toBe("2010");
    }));

    it("should navigate to next year", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture);
        switchToYearView(hostFixture);
        navigateCalendar(hostFixture, "next");
        const table = hostFixture.debugElement.query(By.css("table"));
        const month = table.query(By.css("tr td:first-child"));
        expect(month.nativeElement.textContent).toBe("Jan");
    }));

    it("should navigate to previous year", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture);
        switchToYearView(hostFixture);
        navigateCalendar(hostFixture, "prev");
        const table = hostFixture.debugElement.query(By.css("table"));
        const month = table.query(By.css("tr td:first-child"));
        expect(month.nativeElement.textContent).toBe("Jan");
    }));

    it("should navigate to next month", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture);
        navigateCalendar(hostFixture, "next");
        const table = hostFixture.debugElement.query(By.css("table"));
        const day = table.query(By.css("tbody tr td:first-child"));
        expect(day.nativeElement.textContent).toBe("28");
    }));

    it("should navigate to previous month", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture);
        navigateCalendar(hostFixture, "prev");
        const table = hostFixture.debugElement.query(By.css("table"));
        const day = table.query(By.css("tbody tr td:first-child"));
        expect(day.nativeElement.textContent).toBe("28");
    }));

    it("should switch to year view when year is clicked", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture);
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
        setCalendarDateOfHost(hostFixture);
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
        setCalendarDateOfHost(hostFixture, DateTime.fromISO("2021-10-31").toJSDate());
        tick();
        hostFixture.detectChanges();
        tick();
        hostFixture.detectChanges();
        const table = hostFixture.debugElement.query(By.css("table"));
        const days = table.queryAll(By.css("tbody tr td"));
        expect(days.length).toBe(42);
    }));

    it("should disable days before minDate", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture, DateTime.fromISO("2023-09-17").toJSDate());
        hostFixture.detectChanges();
        tick();
        hostFixture.componentInstance.min = DateTime.fromISO("2023-09-16").toJSDate();
        hostFixture.detectChanges();
        tick();
        hostFixture.detectChanges();

        const table = hostFixture.debugElement.query(By.css("table"));
        const days = table.queryAll(By.css("tbody tr td"));
        // first 15 days should be disabled
        expect(days.slice(0, 15).every(day => day.nativeElement.classList.contains("mona-disabled"))).toBeTrue();
    }));

    it("should disable days after maxDate", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture, DateTime.fromISO("2023-09-17").toJSDate());
        hostFixture.detectChanges();
        tick();
        hostFixture.componentInstance.max = DateTime.fromISO("2023-09-18").toJSDate();
        tick();
        hostFixture.detectChanges();
        tick();
        hostFixture.detectChanges();

        const table = hostFixture.debugElement.query(By.css("table"));
        const days = table.queryAll(By.css("tbody tr td"));
        // last 13 visible days should be disabled. (The very last day is the first day of the next month)
        expect(
            Enumerable.from(days)
                .takeLast(13)
                .all(day => day.nativeElement.classList.contains("mona-disabled"))
        ).toBeTrue();
    }));

    it("should disable days in disabledDates", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture, DateTime.fromISO("2023-09-17").toJSDate());
        hostFixture.componentInstance.disabledDates = [
            DateTime.fromISO("2023-09-22").toJSDate(),
            DateTime.fromISO("2023-09-23").toJSDate()
        ];
        hostFixture.detectChanges();
        tick();
        hostFixture.detectChanges();

        const table = hostFixture.debugElement.query(By.css("table"));
        const days = table.queryAll(By.css("tbody tr td"));
        // given two disabled dates, 22nd and 23rd, they should be disabled. (+4 because of the four days from the previous month)
        expect(days[21 + 4].nativeElement.classList.contains("mona-disabled")).toBeTrue();
        expect(days[22 + 4].nativeElement.classList.contains("mona-disabled")).toBeTrue();
    }));

    it("should disable the calendar if disabled is true", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture);
        hostFixture.componentInstance.disabled = true;
        tick();
        hostFixture.detectChanges();
        tick();
        hostFixture.detectChanges();
        const table = hostFixture.debugElement.query(By.css("table"));
        const days = table.queryAll(By.css("tbody tr td"));
        expect(days.every(day => day.nativeElement.classList.contains("mona-disabled"))).toBeTrue();
    }));

    it("should set the date to clicked date", fakeAsync(() => {
        setCalendarDateOfHost(hostFixture, null);
        tick();
        hostFixture.detectChanges();
        tick();

        const table = hostFixture.debugElement.query(By.css("table"));
        const dayList = table.queryAll(By.css("tbody tr td"));
        const day = dayList.find(d => d.nativeElement.textContent === "1");
        day?.nativeElement.click();
        tick();
        hostFixture.detectChanges();
        tick();
        hostFixture.detectChanges();
        expect(day?.nativeElement.textContent).toEqual("1");
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

function setCalendarDateOfHost(
    fixture: ComponentFixture<CalendarComponentTestComponent>,
    date: Date | null = DateTime.fromISO("2023-09-16").toJSDate()
): Date | null {
    fixture.componentInstance.date = date;
    fixture.detectChanges();

    return date;
}
