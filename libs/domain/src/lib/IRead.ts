import { EntityId, IEntity } from '@codebarker/shared';

export interface IRead<TEntity extends IEntity> {
  findById(id: EntityId): Promise<TEntity>;
}
