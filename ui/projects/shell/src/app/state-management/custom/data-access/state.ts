import { DestroyRef, Injectable, Signal, computed, inject, signal } from "@angular/core";
import { Observable, distinctUntilChanged, shareReplay } from "rxjs";

const equal = <T>(a: T, b: T) => a === b;

type MapFunction<T, U> = (result: T) => U;
type UpdateFn<K extends keyof T, T> = (c: Partial<T>) => T[K];
type SelectedKeys<T, K extends keyof T> = { [P in K]: T[P] };

@Injectable()
export class TimState<T extends object> {
    private state = signal<Partial<T>>({});
    private destroyRef = inject(DestroyRef);

    /**
     * updates a specific key in the state
     * @param {K extends key of T} key key to be updated
     * @param {UpdateFn |T[K]} valueOrFn value to be set or a function to map the result manually
     * @returns {void}
     */
    public set<K extends keyof T>(key: K, valueOrFn: UpdateFn<K, T> | T[K]): void {
        if (typeof valueOrFn === 'function') {
            this.state.update(valueOrFn as any);

        } else {
            this.state.update(c => {
                c[key] = valueOrFn;
                return c;
            });
        }
    }

    /**
     * assigns a value to the state
     * @param {T[K]} value value to be se
     * @param {UpdateFn} [updateFn] custom update function 
     * @returns {void}
     */
    public assign = <K extends keyof T>(value: Partial<T>, updateFn?: UpdateFn<K, T>): void =>
        this.state.update(updateFn ? updateFn : ((c: any) => Object.assign({}, c, value)) as any);

    /**
     * selects keys
     * @param {(keyof T)[]} keys keys to select
     * @param {MapFunction<SelectedKeys<T, K>, U>} mapFn function to map state chunk
     * @returns {Signal<U>}
     */
    public select = <U, K extends keyof T>(
        keys: K[],
        mapFn: MapFunction<SelectedKeys<T, K>, U>,
    ): Signal<U> => computed(() => {
        type SelectedKeys<T, K extends keyof T> = {
            [P in K]: T[P];
        };
        const s = this.state();
        const r: SelectedKeys<T, K> = Object.assign({}, ...keys.map(k => ({ [k]: s[k] })));
        return mapFn(r);
    }, { equal });

    /**
     * connects an observable with a key of the state object and automatically subscribes/unsubcribes
     * @param {string} key key of the state  
     * @param {Observable<T[K]>} stream$ 
     * @returns void
     */
    public connect = <K extends keyof T>(key: K, stream$: Observable<T[K]>): void => {
        const sub$ = stream$.subscribe((value) => this.set(key, value));
        this.destroyRef.onDestroy(() => sub$.unsubscribe());
    }

    /**
     * holds a stream and runs a given callback on emission
     * @param {Observable<T>} stream$ stream to be hold
     * @param {(v:T)=>void} [cb] callback that should be executed on value emissions 
     * @returns {void}
     */
    public hold = <T>(stream$: Observable<T>, cb?: (v: T) => void): void => {
        const sub$ = stream$
            .pipe(distinctUntilChanged(), shareReplay({ bufferSize: 1, refCount: true }))
            .subscribe((value) => cb ? cb(value) : void 0);

        this.destroyRef.onDestroy(() => sub$.unsubscribe());
    }
}