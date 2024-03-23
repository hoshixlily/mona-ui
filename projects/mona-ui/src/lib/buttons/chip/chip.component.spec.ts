import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ChipComponent } from "./chip.component";

describe("ChipComponent", () => {
    let component: ChipComponent;
    let fixture: ComponentFixture<ChipComponent>;
    let de: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [],
            imports: [ChipComponent, FontAwesomeModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChipComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        fixture.detectChanges();
    });

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });

    it("should have correct default properties", () => {
        expect(component.disabled()).toBe(false);
        expect(component.label()).toBe("");
        expect(component.removable()).toBe(false);
        expect(component.tabindex()).toBe(0);
    });

    it("should emit remove event when the chip is removable and the close button is clicked", () => {
        fixture.componentRef.setInput("removable", true);
        fixture.detectChanges();

        let removeSpy = spyOn(component.remove, "emit");
        let removeButton = de.query(By.css(".mona-chip-remove"));
        removeButton.triggerEventHandler("click", null);

        expect(removeSpy).toHaveBeenCalled();
    });

    it("should not show remove button if chip is not removable", () => {
        fixture.componentRef.setInput("removable", false);
        fixture.detectChanges();
        let removeButton = de.query(By.css(".mona-chip-remove"));
        expect(removeButton).toBeNull();
    });
});
