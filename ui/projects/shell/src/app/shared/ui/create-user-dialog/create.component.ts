import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { Gender } from "../../data-access/user";

@Component({
    standalone: true,
    selector: 'user-create',
    imports: [ReactiveFormsModule, InputTextModule, InputNumberModule, DropdownModule, ButtonModule],
    template: `
        <form data-cy="create-dialog" [formGroup]="formGroup" class="flex flex-column gap-4 pt-5" (ngSubmit)="submit($event)">
        <span class="p-float-label">
                <input id="username" pInputText formControlName="username">
                <label htmlFor="username">Username</label>
            </span>

            <span class="p-float-label">
                <input id="firstname" pInputText formControlName="firstname">
                <label htmlFor="firstname">Firstname</label>
            </span>

            <span class="p-float-label">
                <input id="lastname" pInputText formControlName="lastname">
                <label htmlFor="lastname">Lastname</label>
            </span>

            <span class="p-float-label">
                <p-inputNumber id="age" pInputNumber formControlName="age"></p-inputNumber>
                <label htmlFor="age">Age</label>
            </span>

            <span class="p-float-label">
                <p-dropdown styleClass="w-full" appendTo="body" id="gender" [options]="genders" formControlName="gender"></p-dropdown>
                <label htmlFor="gender">Gender</label>
            </span>

            <div class="flex justify-content-end">
                <button [disabled]="formGroup.invalid" pButton class="p-button-sm" label="Confirm"></button>
            </div>
        </form>
    `,
})
export class CreateComponent {
    private readonly dialogRef = inject(DynamicDialogRef);

    protected genders: Gender[] = ['none', 'male', 'female'];
    protected formGroup = new FormGroup({
        username: new FormControl<string | null>(null, [Validators.required]),
        firstname: new FormControl<string | null>(null, [Validators.required]),
        lastname: new FormControl<string | null>(null, [Validators.required]),
        age: new FormControl<number>(20, [Validators.required]),
        gender: new FormControl<Gender>('none', [Validators.required]),
    });

    protected submit(e: SubmitEvent) {
        if (this.formGroup.invalid) { return; }

        this.dialogRef.close({ data: this.formGroup.getRawValue(), kind: 'confirm' });
    }
}