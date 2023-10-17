import { FilterMetadata } from "primeng/api";

export interface Preferences<T> {
    field: keyof T;
    order: 'asc' | 'desc';
    limit: number;
    offset: number;
    filters?: {
        [s: string]: FilterMetadata | FilterMetadata[] | undefined;
    };
}