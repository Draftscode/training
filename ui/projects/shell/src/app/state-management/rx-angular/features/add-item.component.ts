import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
    template: `
    <form [formGroup]="formGroup" class="flex flex-column gap-2 p-2 pt-5" (ngSubmit)="submit($event)">
        <span class="p-float-label w-full flex">
            <input id="name" formControlName="name" pInputText>
            <label htmlFor="name">Name</label>
        </span>
        <div class="flex w-full justify-content-end">
            <button [disabled]="formGroup.invalid" pButton class="p-button-sm" label="confirm"></button>
        </div>
    </form>
    `,
})
export class AddItemComponent {
    private readonly dialogRef = inject(DynamicDialogRef);

    protected readonly formGroup = new FormGroup({
        name: new FormControl<string | null>('', [Validators.required]),
    });

    protected submit(e: SubmitEvent): void {
        this.dialogRef.close(this.formGroup.getRawValue());
    }
}