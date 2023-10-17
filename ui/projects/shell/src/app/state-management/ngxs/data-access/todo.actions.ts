export namespace Todo {
    export class Add {
        static readonly type = '[Todo] Add';
        constructor(public name: string) { }
    }

    export class Remove {
        static readonly type = '[Todo] Remove';
        constructor(public id: number) { }
    }
}
