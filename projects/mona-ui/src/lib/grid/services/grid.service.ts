import { ElementRef, Injectable } from "@angular/core";
import { Column } from "../models/Column";

@Injectable()
export class GridService {
    public columns: Column[] = [
        new Column({ field: "id", title: "ID", width: 40 }),
        new Column({ field: "name", title: "Name", width: 88 }),
        new Column({ field: "age", title: "Age", width: 60, maxWidth: 120 }),
        new Column({ field: "city", title: "City" }),
        new Column({ field: "country", title: "Country", width: 200, minWidth: 100, maxWidth: 300 }),
        new Column({ field: "address", title: "Address", width: 200 }),
        new Column({ field: "phone", title: "Phone" }),
        new Column({ field: "email", title: "Email" }),
        new Column({ field: "company", title: "Company", width: 200 }),
        new Column({ field: "job", title: "Job", width: 600 }),
        new Column({ field: "salary", title: "Salary" }),
        new Column({ field: "date", title: "Date" }),
        new Column({ field: "time", title: "Time" })
    ];

    public gridHeaderElement?: HTMLDivElement;

    public rows: any[] = [
        {
            id: 1,
            name: "John Doe",
            age: 25,
            city: "New York",
            country: "USA",
            address: "1234 Main St.",
            phone: "555-555-5555",
            email: "",
            company: "Google",
            job: "Developer",
            salary: 100000,
            date: "2019-01-01",
            time: "12:00:00"
        },
        {
            id: 2,
            name: "Jane Doe",
            age: 30,
            city: "San Francisco",
            country: "USA",
            address: "1234 Main St.",
            phone: "555-555-5555",
            email: "",
            company: "Google",
            job: "Developer",
            salary: 100000,
            date: "2019-01-01",
            time: "12:00:00"
        },
        {
            id: 3,
            name: "John Smith",
            age: 35,
            city: "San Diego",
            country: "USA",
            address: "1234 Main St.",
            phone: "555-555-5555",
            email: "",
            company: "Google",
            job: "Developer",
            salary: 100000,
            date: "2019-01-01",
            time: "12:00:00"
        },
        {
            id: 4,
            name: "Suzuha Amane",
            age: 16,
            city: "Tokyo",
            country: "Japan",
            address: "1234 Main St.",
            phone: "555-555-5555",
            email: "",
            company: "Google",
            job: "Developer",
            salary: 100000,
            date: "2019-01-01",
            time: "12:00:00"
        },
        {
            id: 5,
            name: "Shirley Fennes",
            age: 22,
            city: "London",
            country: "UK",
            address: "1234 Main St.",
            phone: "555-555-5555",
            email: "",
            company: "Google",
            job: "Developer",
            salary: 100000,
            date: "2019-01-01",
            time: "12:00:00"
        },
        ...Array.from(
            { length: 25 },
            (_, i) =>
                ({
                    id: i + 6,
                    name: "John Doe",
                    age: 25,
                    city: "New York",
                    country: "USA",
                    address: "1234 Main St.",
                    phone: "555-555-5555",
                    email: "",
                    company: "Google",
                    job: "Developer",
                    salary: 100000,
                    date: "2019-01-01",
                    time: "12:00:00"
                } as any)
        )
    ];
    public constructor() {}
}
