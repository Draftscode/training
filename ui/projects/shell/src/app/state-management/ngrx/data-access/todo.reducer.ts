import { createReducer, on } from '@ngrx/store';
import { Todo } from '../../custom/data-access/todo';
import { TodoActions } from './todo.action';

export interface TodoStateModel {
    currentId: number;
    items: Todo[];
}

export const items: Todo[] = [{
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

const initialState: TodoStateModel = {
    currentId: 5,
    items,
}

export const todoReducer = createReducer(
    initialState,
    on(TodoActions.add, (state, { payload }) => ({
        ...state,
        currentId: state.currentId + 1,
        items: state.items.concat({ id: state.currentId, name: payload }),
    })),
    on(TodoActions.remove, (state, { payload }) => ({
        ...state,
        items: state.items.filter(i => i.id !== payload),
    })),
);