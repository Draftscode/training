import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { ButtonModule } from "primeng/button";
import { DataViewModule } from 'primeng/dataview';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { Observable, take } from "rxjs";
import { Todo } from "./data-access/todo";
import { Todo as TodoActions } from './data-access/todo.actions';
import { TodoState } from "./data-access/todo.state";
import { AddItemComponent } from "./features/add-item.component";

const trackItems = (index: number, item: Todo) => item.id;

@Component({
    selector: 'tim-ngxs-state',
    standalone: true,
    host: { class: 'w-full h-full' },
    imports: [AsyncPipe, ButtonModule, DataViewModule, DynamicDialogModule],
    providers: [DialogService],
    template: `
    <div class="flex w-full gap-2 flex-column p-2">
        <h2>NGXS Example</h2>
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
export default class NGXSComponent {
    private readonly dialog = inject(DialogService);
    private readonly store = inject(Store);

    @Select(TodoState.getTodos) items$!: Observable<Todo[]>;

    protected trackItems = trackItems;

    addItem(): void {
        this.dialog.open(AddItemComponent, {
            header: 'Add item',
            data: {}
        }).onClose.pipe(take(1)).subscribe(r => {
            this.store.dispatch(new TodoActions.Add(r.name));
        });
    }

    removeItem(id: number): void {
        this.store.dispatch(new TodoActions.Remove(id));
    }
}