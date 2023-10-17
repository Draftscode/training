import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DataViewModule } from 'primeng/dataview';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { take } from "rxjs";
import { Todo } from "./data-access/todo";
import { TodoState } from "./data-access/todo.state";
import { AddItemComponent } from "./features/add-item.component";

const trackItems = (index: number, item: Todo) => item.id;

@Component({
    selector: 'tim-custom-state',
    standalone: true,
    host: { class: 'w-full h-full' },
    imports: [AsyncPipe, ButtonModule, DataViewModule, DynamicDialogModule],
    providers: [DialogService],
    template: `
    <div class="flex w-full gap-2 flex-column p-2">
        <h2>Custom State</h2>
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
export default class CustomComponent {
    private readonly dialog = inject(DialogService);
    private readonly store = inject(TodoState);

    protected items$ = this.store.getItems();

    protected trackItems = trackItems;

    addItem(): void {
        this.dialog.open(AddItemComponent, {
            header: 'Add item',
            data: {}
        }).onClose.pipe(take(1)).subscribe(r => {
            this.store.add(r.name);
        });
    }

    removeItem(id: number): void {
        this.store.remove(id);
    }
}