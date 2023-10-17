import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Todo } from "./todo";

const ITEMS: Todo[] = [{
    id: 1,
    name: 'buy milk'
}, {
    id: 2,
    name: 'buy chocolate'
}, {
    id: 3,
    name: 'buy sausage'
}, {
    id: 4,
    name: 'buy water'
}];

@Injectable()
export class TodoState {
    private items$ = new BehaviorSubject<Todo[]>(ITEMS);
    private currentId: number = 5;

    add(name: string): void {
        this.items$.next(this.items$.getValue().concat({ id: this.currentId, name }));
        this.currentId++;
    }

    remove(id: number): void {
        this.items$.next(this.items$.getValue().filter(i => i.id !== id));
    }

    getItems() {
        return this.items$.asObservable();
    }
}