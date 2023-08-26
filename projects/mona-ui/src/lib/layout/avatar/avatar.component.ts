import {
    ChangeDetectionStrategy,
    Component,
    computed,
    Input,
    OnInit,
    Signal,
    signal,
    WritableSignal
} from "@angular/core";
import { NgStyle, NgIf } from "@angular/common";

@Component({
    selector: "mona-avatar",
    templateUrl: "./avatar.component.html",
    styleUrls: ["./avatar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgStyle, NgIf]
})
export class AvatarComponent implements OnInit {
    public avatarHeight: WritableSignal<string> = signal("64px");
    public avatarWidth: WritableSignal<string> = signal("64px");
    public avatarBorderColor: WritableSignal<string> = signal("var(--mona-border-color)");
    public avatarBorderRadius: WritableSignal<string> = signal("0");
    public avatarBorderWidth: WritableSignal<string> = signal("1px");
    public avatarBackgroundColor: WritableSignal<string> = signal("var(--mona-primary)");
    public avatarCustomStyles: WritableSignal<Partial<CSSStyleDeclaration>> = signal({});
    public avatarImage: WritableSignal<string> = signal("");
    public avatarLabel: WritableSignal<string> = signal("");
    public avatarLabelColor: WritableSignal<string> = signal("var(--mona-text)");
    public avatarLabelFontSize: WritableSignal<string> = signal("1rem");
    public avatarLabelFontWeight: WritableSignal<string> = signal("700");
    public avatarLabelStyles: Signal<Partial<CSSStyleDeclaration>> = signal({});
    public avatarStyles: Signal<Partial<CSSStyleDeclaration>> = signal({});

    @Input()
    public set backgroundColor(value: string) {
        this.avatarBackgroundColor.set(value);
    }

    @Input()
    public set borderColor(value: string) {
        this.avatarBorderColor.set(value);
    }

    @Input()
    public set borderRadius(value: string | number) {
        if (typeof value === "number") {
            this.avatarBorderRadius.set(`${value}px`);
        } else {
            this.avatarBorderRadius.set(value);
        }
    }

    @Input()
    public set borderWidth(value: string | number) {
        if (typeof value === "number") {
            this.avatarBorderWidth.set(`${value}px`);
        } else {
            this.avatarBorderWidth.set(value);
        }
    }

    @Input()
    public set customStyles(value: Partial<CSSStyleDeclaration>) {
        this.avatarCustomStyles.set(value);
    }

    @Input()
    public set height(value: string | number) {
        if (typeof value === "number") {
            this.avatarHeight.set(`${value}px`);
        } else {
            this.avatarHeight.set(value);
        }
    }

    @Input()
    public set image(value: string) {
        this.avatarImage.set(value);
    }

    @Input()
    public set label(value: string) {
        this.avatarLabel.set(value);
    }

    @Input()
    public set labelColor(value: string) {
        this.avatarLabelColor.set(value);
    }

    @Input()
    public set labelFontSize(value: string) {
        this.avatarLabelFontSize.set(value);
    }

    @Input()
    public set labelFontWeight(value: string) {
        this.avatarLabelFontWeight.set(value);
    }

    @Input()
    public set width(value: string | number) {
        if (typeof value === "number") {
            this.avatarWidth.set(`${value}px`);
        } else {
            this.avatarWidth.set(value);
        }
    }

    public ngOnInit(): void {
        this.avatarStyles = computed(() => {
            return {
                borderColor: this.avatarBorderColor(),
                borderWidth: this.avatarBorderWidth(),
                borderStyle: "solid",
                borderRadius: this.avatarBorderRadius(),
                backgroundColor: this.avatarBackgroundColor(),
                height: this.avatarHeight(),
                width: this.avatarWidth(),
                ...this.avatarCustomStyles()
            };
        });
        this.avatarLabelStyles = computed(() => {
            return {
                color: this.avatarLabelColor(),
                fontSize: this.avatarLabelFontSize(),
                fontWeight: this.avatarLabelFontWeight()
            };
        });
    }
}
