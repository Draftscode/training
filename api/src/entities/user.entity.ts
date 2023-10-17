import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('tim-user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    gender: 'male' | 'female' | 'none';

    @Column()
    age: number;
}