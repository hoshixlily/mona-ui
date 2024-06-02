import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { NumericTextBoxComponent } from "../../../inputs/numeric-text-box/components/numeric-text-box/numeric-text-box.component";
import { TextBoxComponent } from "../../../inputs/text-box/components/text-box/text-box.component";
import { EditorImageFormOptions } from "../../models/EditorImageFormOptions";
import { EditorImageInsertEvent } from "../../models/EditorImageInsertEvent";

@Component({
    selector: "mona-editor-image-inserter",
    standalone: true,
    imports: [TextBoxComponent, ReactiveFormsModule, ButtonDirective, NumericTextBoxComponent],
    templateUrl: "./editor-image-inserter.component.html",
    styleUrl: "./editor-image-inserter.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorImageInserterComponent {
    protected readonly imageForm = new FormGroup<EditorImageFormOptions>({
        altText: new FormControl(""),
        height: new FormControl(null),
        link: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
        width: new FormControl(null)
    });

    public readonly cancel = output();
    public readonly insert = output<EditorImageInsertEvent>();

    public onCancel(): void {
        this.cancel.emit();
    }

    public onImageInsert(): void {
        this.insert.emit({
            altText: this.imageForm.controls.altText.value ?? "",
            height: this.imageForm.controls.height.value,
            link: this.imageForm.controls.link.value,
            width: this.imageForm.controls.width.value
        });
    }
}
