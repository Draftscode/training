
import { User } from "../../../shared/data-access/user";
import { Preferences } from "./preferences";

export namespace UserActions {
    export class Fetch {
        static readonly type = `[User] Fetch`;
        constructor(public prefs: Partial<Preferences<User>>) { }
    }

    export class Create {
        static readonly type = `[User] Create`;
        constructor(public dto: Partial<User>) { }
    }
}