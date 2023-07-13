import { Pipe, PipeTransform } from "@angular/core";

type DateComparisonOperator = "==" | "!=" | "<" | "<=" | ">" | ">=";

@Pipe({
    name: "monaDateComparer",
    standalone: true
})
export class DateComparerPipe implements PipeTransform {
    public transform(value: Date | null, other: Date | null, operator: DateComparisonOperator): boolean {
        if (!value || !other) {
            return false;
        }

        const valueDateParts = [value.getFullYear(), value.getMonth(), value.getDate()];
        const otherDateParts = [other.getFullYear(), other.getMonth(), other.getDate()];

        for (let i = 0; i < 3; i++) {
            switch (operator) {
                case "==":
                    if (valueDateParts[i] !== otherDateParts[i]) return false;
                    break;
                case "!=":
                    if (valueDateParts[i] !== otherDateParts[i]) return true;
                    break;
                case "<":
                case "<=":
                    if (valueDateParts[i] < otherDateParts[i]) return true;
                    if (valueDateParts[i] > otherDateParts[i]) return false;
                    if (operator === "<=" && i === 2 && valueDateParts[i] === otherDateParts[i]) return true;
                    break;
                case ">":
                case ">=":
                    if (valueDateParts[i] > otherDateParts[i]) return true;
                    if (valueDateParts[i] < otherDateParts[i]) return false;
                    if (operator === ">=" && i === 2 && valueDateParts[i] === otherDateParts[i]) return true;
                    break;
                default:
                    return false;
            }
        }
        return operator === "==";
    }
}
