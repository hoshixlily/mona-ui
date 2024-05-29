import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    viewChild
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ButtonGroupComponent } from "../../../buttons/button-group/button-group.component";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { DropDownItemTemplateDirective } from "../../../dropdowns/directives/drop-down-item-template.directive";
import { DropDownListComponent } from "../../../dropdowns/drop-down-list/components/drop-down-list/drop-down-list.component";
import { HeadingsDropdownListDataItem, HeadingType } from "../../models/HeadingsDropdownListDataItem";
import { EditorService } from "../../services/editor.service";
import { EditorBasicTextStylesComponent } from "../editor-basic-text-styles/editor-basic-text-styles.component";
import { EditorFontColorComponent } from "../editor-font-color/editor-font-color.component";
import { EditorFontSizeComponent } from "../editor-font-size/editor-font-size.component";
import { EditorHeadingsComponent } from "../editor-headings/editor-headings.component";
import { EditorTextAlignmentsComponent } from "../editor-text-alignments/editor-text-alignments.component";

@Component({
    selector: "mona-editor",
    standalone: true,
    imports: [
        ButtonDirective,
        ButtonGroupComponent,
        FaIconComponent,
        DropDownListComponent,
        DropDownItemTemplateDirective,
        FormsModule,
        EditorBasicTextStylesComponent,
        EditorHeadingsComponent,
        EditorTextAlignmentsComponent,
        EditorFontSizeComponent,
        EditorFontColorComponent
    ],
    templateUrl: "./editor.component.html",
    styleUrl: "./editor.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [EditorService],
    host: {
        class: "mona-editor"
    }
})
export class EditorComponent {
    readonly #editorService: EditorService = inject(EditorService);
    protected readonly editorContainer = viewChild.required<ElementRef<HTMLDivElement>>("editorContainer");
    public constructor() {
        afterNextRender(() => {
            this.#editorService.setupEditor({ element: this.editorContainer().nativeElement });
        });
    }
}
