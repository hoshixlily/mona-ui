import { Enumerable } from "@mirei/ts-collections";

export const TestColumnData = [
    {
        field: "index",
        title: "Index"
    },
    {
        field: "title",
        title: "Title"
    },
    {
        field: "combined",
        title: "Combined"
    }
];

export const TestRowData = Enumerable.range(0, 100)
    .select(i => ({
        index: i,
        title: `Title ${i}`,
        combined: `Title ${i} - ${i}`
    }))
    .toArray();
