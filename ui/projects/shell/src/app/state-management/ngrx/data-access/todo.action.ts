import { createAction, props } from '@ngrx/store';

export namespace TodoActions {
    export const add = createAction('[Todo] Add', props<{ payload: string }>());
    export const remove = createAction('[Todo] Remove',props<{ payload: number }>());
}