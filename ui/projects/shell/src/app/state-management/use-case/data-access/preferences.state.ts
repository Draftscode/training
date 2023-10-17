import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { PreferencesActions } from "./preference.actions";
import { Preferences } from "./preferences";
import { User } from "../../../shared/data-access/user";



@State<Preferences<User>>({
    name: 'preferences',
    defaults: {
        field: 'username',
        order: 'asc',
        limit: 10,
        offset: 0,
        filters: {},
    }
})
@Injectable()
export class PreferencesState {

    @Selector()
    static getAll(state: Preferences<User>): Preferences<User> {
        return state;
    }

    @Action(PreferencesActions.Set)
    setPreferences(stateContext: StateContext<Preferences<User>>, action: PreferencesActions.Set) {
        const state = stateContext.getState();
        stateContext.setState({
            ...state,
            ...action.prefs,
        });
    }
}