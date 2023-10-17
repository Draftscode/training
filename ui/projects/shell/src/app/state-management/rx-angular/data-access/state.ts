import { Injectable } from "@angular/core";
import { RxState } from "@rx-angular/state";
import { RxActionFactory } from '@rx-angular/state/actions';
import { map } from "rxjs";
import { Todo } from "./todo";

interface Actions {
    add: string;
    remove: number;
}


interface TodoStateModel {
    items: Todo[];
    currentId: number;
}

const INIT: TodoStateModel = {
    items: [{
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
    }],

    currentId: 5,
};

@Injectable()
export class TodoState extends RxState<TodoStateModel> {
    public actions = new RxActionFactory<Actions>().create();

    constructor() {
        super();
        this.set(INIT);

        this.connect(this.actions.add$.pipe(map(name => {
            const state = this.get();
            state.items = state.items.concat({
                id: state.currentId,
                name,
            });
            state.currentId++;
            return state;
        })));

        this.connect(this.actions.remove$.pipe(map(id => {
            const state = this.get();
            state.items = state.items.filter(i => i.id !== id);
            return state;
        })));
    }
}