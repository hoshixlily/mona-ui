import { Pipe, PipeTransform } from "@angular/core";

type DateComparisonOperator = "==" | "!=" | "<" | "<=" | ">" | ">=";

@Pipe({
    name: "monaDateComparer",
    standalone: true
})
export class DateComparerPipe implements PipeTransform {
    public transform(value: Date | null, other: Date | null, operator: DateComparisonOperator): boolean {
        if (value === null || other === null) {
            return false;
        }
        switch (operator) {
            case "==":
                return (
                    value.getDate() === other.getDate() &&
                    value.getMonth() === other.getMonth() &&
                    value.getFullYear() === other.getFullYear()
                );
            case "!=":
                return (
                    value.getDate() !== other.getDate() ||
                    value.getMonth() !== other.getMonth() ||
                    value.getFullYear() !== other.getFullYear()
                );
            case "<":
                return (
                    value.getFullYear() < other.getFullYear() ||
                    (value.getFullYear() === other.getFullYear() && value.getMonth() < other.getMonth()) ||
                    (value.getFullYear() === other.getFullYear() &&
                        value.getMonth() === other.getMonth() &&
                        value.getDate() < other.getDate())
                );
            case "<=":
                return (
                    value.getFullYear() < other.getFullYear() ||
                    (value.getFullYear() === other.getFullYear() && value.getMonth() < other.getMonth()) ||
                    (value.getFullYear() === other.getFullYear() &&
                        value.getMonth() === other.getMonth() &&
                        value.getDate() <= other.getDate())
                );
            case ">":
                return (
                    value.getFullYear() > other.getFullYear() ||
                    (value.getFullYear() === other.getFullYear() && value.getMonth() > other.getMonth()) ||
                    (value.getFullYear() === other.getFullYear() &&
                        value.getMonth() === other.getMonth() &&
                        value.getDate() > other.getDate())
                );
            case ">=":
                return (
                    value.getFullYear() > other.getFullYear() ||
                    (value.getFullYear() === other.getFullYear() && value.getMonth() > other.getMonth()) ||
                    (value.getFullYear() === other.getFullYear() &&
                        value.getMonth() === other.getMonth() &&
                        value.getDate() >= other.getDate())
                );
            default:
                return false;
        }
    }
}
