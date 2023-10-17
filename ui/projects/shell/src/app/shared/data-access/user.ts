
export type Gender = 'male' | 'female' | 'none';

export interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    age: number;
    gender: Gender;
}
