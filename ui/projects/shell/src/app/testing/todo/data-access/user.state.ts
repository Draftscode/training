import { Injectable, inject } from "@angular/core";
import { Action, NgxsOnInit, Selector, State, StateContext } from "@ngxs/store";
import { insertItem, patch } from "@ngxs/store/operators";
import { map } from "rxjs";
import { User } from "../../../shared/data-access/user";
import { UserService } from "../../../shared/data-access/user.service";
import { UserActions } from "./user.actions";

interface UserStateModel {
    total: number;
    items: User[];
}

@State<UserStateModel>({
    name: 'users',
})
@Injectable()
export class UserState implements NgxsOnInit {
    private readonly userService = inject(UserService);

    ngxsOnInit(ctx: StateContext<UserStateModel>): void {
        ctx.dispatch(new UserActions.Fetch({
            field: 'id',
            filters: {},
            limit: 100,
            offset: 0,
            order: 'asc',
        }));
    }

    @Selector()
    static getUsers(state: UserStateModel): User[] {
        return state.items ?? [];
    }

    @Selector()
    static numberOfItems(state: UserStateModel): number {
        return state.total ?? 0;
    }

    @Action(UserActions.Fetch)
    fetchUsers(stateContext: StateContext<UserStateModel>, action: UserActions.Fetch) {
        return this.userService.getUsers(action.prefs).pipe(map((wrapper) => {
            console.log(wrapper)
            stateContext.setState(wrapper);
            return wrapper.items;
        }));

    }

    @Action(UserActions.Create)
    createUser(stateContext: StateContext<UserStateModel>, action: UserActions.Create) {
        return this.userService.createUser(action.dto).pipe(map((user) => {
            stateContext.setState(patch({
                total: stateContext.getState().total + 1,
                items: insertItem(user),
            }));
            return user;
        }));

    }
}