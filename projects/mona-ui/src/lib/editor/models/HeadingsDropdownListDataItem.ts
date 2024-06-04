export interface HeadingsDropdownListDataItem {
    text: string;
    value: HeadingType;
}

export enum HeadingType {
    Heading1 = 1,
    Heading2 = 2,
    Heading3 = 3,
    Heading4 = 4,
    Heading5 = 5,
    Heading6 = 6,
    Paragraph = 7
}
