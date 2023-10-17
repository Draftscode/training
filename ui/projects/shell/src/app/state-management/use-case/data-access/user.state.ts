import { Injectable, inject } from "@angular/core";
import { Action, NgxsOnInit, Select, Selector, State, StateContext } from "@ngxs/store";
import { insertItem, patch } from "@ngxs/store/operators";
import { Observable, distinctUntilChanged, filter, map } from "rxjs";
import { Preferences } from "./preferences";
import { PreferencesState } from "./preferences.state";
import { User } from "../../../shared/data-access/user";
import { UserActions } from "./user.actions";
import { UserService } from "../../../shared/data-access/user.service";

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

    @Select(PreferencesState.getAll)
    private readonly preferences$!: Observable<Preferences<User>>;

    ngxsOnInit(ctx: StateContext<UserStateModel>): void {
        this.preferences$.pipe(filter((prefs) => {
            return !prefs?.field || !prefs.order ? false : true;
        }),
            distinctUntilChanged((p, c) => {
                return JSON.stringify(p) === JSON.stringify(c);
            })).subscribe(prefs => {
                ctx.dispatch(new UserActions.Fetch(prefs));
            });
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