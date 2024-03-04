import { NgStyle } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    InputSignal,
    InputSignalWithTransform,
    Signal
} from "@angular/core";

@Component({
    selector: "mona-avatar",
    templateUrl: "./avatar.component.html",
    styleUrls: ["./avatar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
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

    public backgroundColor: InputSignal<string> = input("var(--mona-primary)");
    public borderColor: InputSignal<string> = input("var(--mona-border-color)");
    public borderRadius: InputSignalWithTransform<string, string | number> = input("0", {
        transform: value => {
            if (typeof value === "number") {
                return `${value}px`;
            }
            return value;
        }
    });
    public borderWidth: InputSignalWithTransform<string, string | number> = input("1px", {
        transform: value => {
            if (typeof value === "number") {
                return `${value}px`;
            }
            return value;
        }
    });
    public customStyles: InputSignal<Partial<CSSStyleDeclaration>> = input({});
    public height: InputSignalWithTransform<string, string | number> = input("64px", {
        transform: value => {
            if (typeof value === "string") {
                return value;
            }
            return `${value}px`;
        }
    });
    public image: InputSignal<string> = input("");
    public label: InputSignal<string> = input("");
    public labelColor: InputSignal<string> = input("var(--mona-text)");
    public labelFontSize: InputSignal<string> = input("1rem");
    public labelFontWeight: InputSignal<string> = input("700");
    public width: InputSignalWithTransform<string, string | number> = input("64px", {
        transform: value => {
            if (typeof value === "string") {
                return value;
            }
            return `${value}px`;
        }
    });
}
