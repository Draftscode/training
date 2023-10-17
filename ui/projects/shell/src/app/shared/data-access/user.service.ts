import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Preferences } from "../../state-management/use-case/data-access/preferences";
import { User } from "./user";


@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly baseUrl = '/api/user';
    private readonly http = inject(HttpClient);

    public getUsers(options?: Partial<Preferences<User>>) {
        const params = new HttpParams()
            .append('limit', options?.limit ?? 10)
            .append('offset', options?.offset ?? 0)
            .append('field', options?.field ?? 'id')
            .append('order', options?.order ?? 'asc')
            .append('filter', JSON.stringify(options?.filters));

        console.log(params)
        return this.http.get<{ total: number; items: User[] }>(`${this.baseUrl}`, { params });
    }

    public createUser(dto: Partial<User>) {
        return this.http.post<User>(`${this.baseUrl}`, dto);
    }
}