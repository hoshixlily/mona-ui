import { NgStyle } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, input, Signal } from "@angular/core";

@Component({
    selector: "mona-avatar",
    templateUrl: "./avatar.component.html",
    styleUrls: ["./avatar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgStyle],
    host: {
        class: "mona-avatar",
        "[style]": "avatarStyles()"
    }
})
export class AvatarComponent {
    protected readonly avatarLabelStyles: Signal<Partial<CSSStyleDeclaration>> = computed(() => {
        return {
            color: this.labelColor(),
            fontSize: this.labelFontSize(),
            fontWeight: this.labelFontWeight()
        };
    });
    protected readonly avatarStyles: Signal<Partial<CSSStyleDeclaration>> = computed(() => {
        const image = this.image();
        const backgroundColor = image ? "transparent" : this.backgroundColor();
        return {
            borderColor: this.borderColor(),
            borderWidth: this.borderWidth(),
            borderStyle: "solid",
            borderRadius: this.borderRadius(),
            backgroundColor,
            height: this.height(),
            width: this.width(),
            ...this.customStyles()
        };
    });

    public backgroundColor = input("var(--mona-primary)");
    public borderColor = input("var(--mona-border-color)");
    public borderRadius = input("0", {
        transform: (value: string | number) => {
            if (typeof value === "number") {
                return `${value}px`;
            }
            return value;
        }
    });
    public borderWidth = input("1px", {
        transform: (value: string | number) => {
            if (typeof value === "number") {
                return `${value}px`;
            }
            return value;
        }
    });
    public customStyles = input<Partial<CSSStyleDeclaration>>({});
    public height = input("64px", {
        transform: (value: string | number) => {
            if (typeof value === "string") {
                return value;
            }
            return `${value}px`;
        }
    });
    public image = input("");
    public label = input("");
    public labelColor = input("var(--mona-text)");
    public labelFontSize = input("1rem");
    public labelFontWeight = input("700");
    public width = input("64px", {
        transform: (value: string | number) => {
            if (typeof value === "string") {
                return value;
            }
            return `${value}px`;
        }
    });
}
