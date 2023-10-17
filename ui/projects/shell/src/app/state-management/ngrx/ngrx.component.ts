import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { ButtonModule } from "primeng/button";
import { DataViewModule } from 'primeng/dataview';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { take } from "rxjs";
import { Todo } from "./data-access/todo";
import { TodoActions } from "./data-access/todo.action";
import { TodoStateModel } from "./data-access/todo.reducer";
import { AddItemComponent } from "./features/add-item.component";

const trackItems = (index: number, item: Todo) => item.id;

@Component({
    selector: 'tim-ngrx-state',
    standalone: true,
    host: { class: 'w-full h-full' },
    imports: [AsyncPipe, ButtonModule, DataViewModule, DynamicDialogModule],
    providers: [DialogService],
    template: `
    <div class="flex w-full gap-2 flex-column p-2">
        <h2>NGRX Example</h2>
        <p-dataView #dv [value]="(items$ | async) ?? []">
            <ng-template let-item pTemplate="listItem">
                <div class="col-12 p-2">
                    <div class="flex w-full align-items-center justify-content-between">
                        <div>{{item.name}}</div>
                        <div class="justify-content-end flex">
                            <button  (click)="removeItem(item.id)" pButton class="p-button-sm p-button-text" icon="pi pi-trash"></button>
                        </div>
                    </div>
                </div>
            </ng-template>
        </p-dataView>
        <div class="flex justify-content-end">
            <button pButton (click)="addItem()" class="p-button-sm" label="add item" icon="pi pi-plus"></button>
        </div>
    </div>
    `,
})
export default class NGRXComponent {
    private readonly dialog = inject(DialogService);
    private readonly store = inject<Store<{ todo: TodoStateModel }>>(Store);

    items$ = this.store.select(state => state.todo.items);

    protected trackItems = trackItems;

    addItem(): void {
        this.dialog.open(AddItemComponent, {
            header: 'Add item',
            data: {}
        }).onClose.pipe(take(1)).subscribe(r => {
            this.store.dispatch(TodoActions.add({ payload: r.name }));
        });
    }

    removeItem(id: number): void {
        this.store.dispatch(TodoActions.remove({ payload: id }));
    }
}