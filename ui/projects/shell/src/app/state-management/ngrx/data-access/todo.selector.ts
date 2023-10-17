import { createSelector } from '@ngrx/store';
import { Todo } from './todo';
import { TodoStateModel } from './todo.reducer';

export const _selectItems = (state: TodoStateModel) => state.items;

export const selectItems = createSelector(
    _selectItems,
    (state: Todo[]) => state,
);