import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { Todo } from './todo';
import { Todo as TodoActions } from './todo.actions';

interface TodoStateModel {
    currentId: number;
    items: Todo[];
}

@State<TodoStateModel>({
    name: 'todos',
    defaults: {
        currentId: 5,
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
    }
})
@Injectable()
export class TodoState {

    @Selector()
    static getTodos(state: TodoStateModel): Todo[] {
        return state.items ?? [];
    }

    @Action(TodoActions.Add)
    addItem(stateContext: StateContext<TodoStateModel>, action: TodoActions.Add) {
        const id = stateContext.getState().currentId;
        const newItem: Todo = {
            id,
            name: action.name,
        };

        stateContext.setState(
            patch({
                currentId: id + 1,
                items: insertItem(newItem)
            })
        );
    }

    @Action(TodoActions.Remove)
    removeItem(stateContext: StateContext<TodoStateModel>, action: TodoActions.Remove) {
        stateContext.setState(
            patch({
                items: removeItem(i => i.id === action.id),
            })
        );
    }
}