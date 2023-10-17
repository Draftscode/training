import { Inject, Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, ILike, In, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from 'typeorm';
import { UserEntity } from './entities/user.entity';
type Value = number | string | boolean;

interface RequestOption<T> {
  limit: number;
  offset: number;
  field: keyof T;
  order: 'asc' | 'desc';
  filter: Record<string, {
    value: Value | Value[];
    matchMode: 'startsWith' | 'contains' | 'notContains' | 'endsWith' | 'equals' | 'notEquals' | 'lt' | 'lte' | 'gt' | 'gte'
  }>;
}

@Injectable()
export class AppService {
  @Inject(DataSource)
  private readonly dataSource: DataSource;

  public getUsers(options?: Partial<RequestOption<UserEntity>>) {
    return this.dataSource.transaction(async manager => {
      const total = await manager.count(UserEntity);

      const where: FindOptionsWhere<UserEntity>[] = [];
      const entries = {};

      Object.keys(options?.filter).forEach(k => {
        const filter = options.filter[k]
        if (!filter.value) { return; }

        if (Array.isArray(filter.value)) {
          entries[k] = In(filter.value);
        } else {
          switch (filter.matchMode) {
            case 'startsWith':
              entries[k] = ILike(`${filter.value}%`);
              break;
            case 'contains':
              entries[k] = ILike(`%${filter.value}%`);
              break;
            case 'notContains':
              entries[k] = Not(ILike(`%${filter.value}%`));
              break;
            case 'endsWith':
              entries[k] = ILike(`%${filter.value}`);
              break;
            case 'equals':
              if (typeof filter.value === 'number') {
                entries[k] = filter.value;
              } else {
                entries[k] = ILike(filter.value);
              }
              break;
            case 'notEquals':
              if (typeof filter.value === 'number') {
                entries[k] = Not(filter.value);
              } else {
                entries[k] = Not(ILike(filter.value));
              }
              break;
            case 'lt':
              entries[k] = LessThan(filter.value);
              break;
            case 'lte':
              entries[k] = LessThanOrEqual(filter.value);
              break;
            case 'gt':
              entries[k] = MoreThan(filter.value);
              break;
            case 'gte':
              entries[k] = MoreThanOrEqual(filter.value);
              break;
          }
        }
      });

      if (Object.keys(entries)?.length > 0) {
        where.push(entries);
      }

      const items = await manager.find(UserEntity, {
        where,
        skip: options?.offset ?? 0,
        take: options?.limit ?? 10,
        order: {
          [options?.field ?? 'id']: options?.order ?? 'asc',
        }
      });

      return {
        total, items
      }
    });
  }

  public getUser(id: number) {
    return this.dataSource.manager.find(UserEntity, { where: { id } });
  }

  public patchUser(id: number, dto: Partial<UserEntity>) {
    return this.dataSource.manager.update(UserEntity, id, dto);
  }

  public createUser(dto: Partial<UserEntity>) {
    return this.dataSource.transaction(async manager => {
      const entity = manager.create(UserEntity, dto);
      return manager.save(entity);
    });
  }

  public removeUser(id: number) {
    return this.dataSource.manager.delete(UserEntity, id);
  }
}
