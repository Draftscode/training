import { User } from "../../../shared/data-access/user";
import { Preferences } from "./preferences";

export namespace PreferencesActions {
    export class Set {
        static readonly type = `[Preferences] Set`;
        constructor(public prefs: Partial<Preferences<User>>) { }
    }
}