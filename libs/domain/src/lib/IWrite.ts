import { IEntity } from '@codebarker/shared';

export interface IWrite<TEntity extends IEntity> {
  save(entity: TEntity): Promise<void>;
}
