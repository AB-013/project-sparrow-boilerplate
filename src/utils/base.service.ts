import { BaseEntity, DeleteResult, In, Repository } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';

import { LoggerService } from '@src/logger/logger.service';

import { IBaseService } from './Ibase.service';

export class BaseService<T extends BaseEntity, R extends Repository<T>>
  implements IBaseService<T>
{
  protected readonly repository: R;
  protected readonly logger: LoggerService;

  constructor(repository: R, logger: LoggerService) {
    this.repository = repository;
    this.logger = logger;
  }

  index(): Promise<T[]> {
    return this.repository.find();
  }

  findById(id: EntityId): Promise<T> {
    return this.repository.findOne({ where: { id } } as any);
  }

  findByIds(ids: [EntityId]): Promise<T[]> {
    return this.repository.findBy({ id: In(ids) } as any);
  }

  store(data: any): Promise<T> {
    return this.repository.save(data);
  }

  async update(id: EntityId, data: any): Promise<T> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  delete(id: EntityId): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
