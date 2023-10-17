import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Select } from "@ngxs/store";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { Observable } from "rxjs";
import { User } from "../../../../shared/data-access/user";
import { CreateComponent } from "../../../../shared/ui/create-user-dialog/create.component";
import { UserState } from "../../data-access/user.state";

@Component({
    selector: 'tim-tesing-users',
    standalone: true,
    imports: [NgFor, NgIf, AsyncPipe, ButtonModule, DynamicDialogModule],
    host: { class: 'flex p-2 w-full h-full overflow-auto flex-column' },
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DialogService],
    template: `
    <h2 data-test-id="user-list-title">User list with tests</h2>
    <ng-container *ngIf="items$ | async as items">
        <ul data-cy-test="user-list" *ngIf="items?.length; else emptyList">
            <li *ngFor="let item of items">
                {{item.username}} +1
            </li>    
        </ul>
        <ng-template #emptyList data-cy-test="user-list-empty"></ng-template>
    </ng-container>
    <!-- <button (click)="click()" pButton class="p-button-sm" icon="pi pi-plus" 
        label="create" data-cy-test="user-list-create"></button> -->
    `
})
export default class UsersListComponent {
    @Select(UserState.getUsers)
    protected items$!: Observable<User[]>;

    private readonly dialog = inject(DialogService);

    click(): void {
        this.dialog.open(CreateComponent, {

        });
    }
}