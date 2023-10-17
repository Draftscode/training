import { AsyncPipe } from "@angular/common";
import { Component, OnDestroy, inject } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { MultiSelectModule } from 'primeng/multiselect';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Observable, Subject, map, take, takeUntil } from "rxjs";
import { PreferencesActions } from "../../data-access/preference.actions";
import { Preferences } from "../../data-access/preferences";
import { PreferencesState } from "../../data-access/preferences.state";
import { Gender, User } from "../../../../shared/data-access/user";
import { UserActions } from "../../data-access/user.actions";
import { UserState } from "../../data-access/user.state";
import { CreateComponent } from "../../../../shared/ui/create-user-dialog/create.component";

@Component({
    selector: 'user-list',
    host: { class: 'w-full h-full flex overflow-auto' },
    standalone: true,
    imports: [TableModule, AsyncPipe, TagModule, MultiSelectModule, ButtonModule, DynamicDialogModule],
    providers: [DialogService],
    template: `
    <div class="flex w-full h-full p-2 gap-2 flex-column">
        <h2>Use Case</h2>
            <p-table
                [rowsPerPageOptions]="[5, 10, 50]"
                [paginator]="true"
                [rows]="(rowsPerPage$ | async) ?? 0"
                [totalRecords]="(totalRows$ | async) ?? 0" [sortOrder]="(sortOrder$ | async) ?? 1" 
                [sortField]="sortField$ | async" [lazy]="true" (onLazyLoad)="load$.next($event)" 
                [customSort]="true" [value]="(items$ | async) ?? []">
                <ng-template pTemplate="header">
                    <tr>
                        <th class="w-3rem">ID</th>
                        <th pSortableColumn="username">Username<p-sortIcon field="username"></p-sortIcon></th>
                        <th pSortableColumn="firstname">Firstname<p-sortIcon field="firstname"></p-sortIcon></th>
                        <th pSortableColumn="lastname">Lastname<p-sortIcon field="lastname"></p-sortIcon></th>
                        <th pSortableColumn="age">Age<p-sortIcon field="age"></p-sortIcon></th>
                        <th pSortableColumn="gender">Gender<p-sortIcon field="gender"></p-sortIcon></th>
                    </tr>
                    <tr>
                        <th></th>
                        <th><p-columnFilter type="text" field="username"></p-columnFilter></th>
                        <th><p-columnFilter type="text" field="firstname"></p-columnFilter></th>
                        <th><p-columnFilter type="text" field="lastname"></p-columnFilter></th>
                        <th><p-columnFilter type="numeric" field="age"></p-columnFilter></th>
                        <th>
                            <p-columnFilter field="gender" matchMode="equals" [showMenu]="false">
                                <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                    <p-multiSelect  appendTo="body" [options]="genders" placeholder="Any" (onChange)="filter($event.value)">
                                        <ng-template let-option pTemplate="selectedItem">
                                        </ng-template>
                                        <ng-template let-option pTemplate="item">
                                            <div class="inline-block vertical-align-middle">
                                                <p-tag [severity]="option=='male'?'info':option==='female'?'warning':'danger'" [value]="option"></p-tag>
                                            </div>
                                        </ng-template>
                                    </p-multiSelect >
                                </ng-template>
                            </p-columnFilter>
                        </th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-item let-rowIndex="rowIndex">
                    <tr>
                        <td>{{ rowIndex + 1 }}</td>
                        <td>{{ item.username }}</td>
                        <td>{{ item.firstname }}</td>
                        <td>{{ item.lastname }}</td>
                        <td>{{ item.age }}</td>
                        <td><p-tag [severity]="item.gender=='male'?'info':item.gender==='female'?'warning':'danger'" [value]="item.gender"></p-tag></td>
                    </tr>
                </ng-template>
            </p-table>
        <div class="flex justify-content-end">
            <button (click)="create($event)" pButton class="p-button-sm" label="Create" icon="pi pi-plus"></button>
        </div>
    </div>
    `
})
export default class UserListComponent implements OnDestroy {
    private readonly dialog = inject(DialogService);
    protected readonly genders: Gender[] = ['none', 'male', 'female'];

    @Select(UserState.getUsers)
    protected readonly items$!: Observable<User[]>;

    @Select(UserState.numberOfItems)
    protected readonly totalRows$!: Observable<number>;

    @Select(PreferencesState.getAll)
    protected readonly preferences$!: Observable<Preferences<User>>;

    protected sortOrder$ = this.preferences$.pipe(map(p => p?.order === 'asc' ? 1 : -1));
    protected sortField$ = this.preferences$.pipe(map(p => p?.field));
    protected rowsPerPage$ = this.preferences$.pipe(map(p => p?.limit ?? 0));

    private readonly store = inject(Store);

    private readonly destroyed$ = new Subject<void>();
    protected readonly load$ = new Subject<TableLazyLoadEvent>();

    constructor() {

        this.load$.pipe(takeUntil(this.destroyed$)).subscribe((e) => {
            console.log(e)
            this.store.dispatch(new PreferencesActions.Set({
                field: e.sortField as keyof User,
                order: e.sortOrder === -1 ? 'desc' : 'asc',
                offset: e.first,
                limit: e.rows ?? 0,
                filters: JSON.parse(JSON.stringify(e.filters)),
            }));
        });
    }

    create(e: MouseEvent) {
        this.dialog.open(CreateComponent, {
            header: 'Create User',
        }).onClose.pipe(take(1)).subscribe(a => {
            if (a.kind === 'confirm') {
                this.store.dispatch(new UserActions.Create(a.data));
            }
        });
    }

    ngOnDestroy(): void {
        this.destroyed$.next(void 0);
        this.destroyed$.complete();
    }
}