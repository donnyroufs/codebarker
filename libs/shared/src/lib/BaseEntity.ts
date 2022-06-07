import { IEntity } from './interfaces/IEntity';
import { Writeable } from './types';
import { cast } from './Utils';

export class BaseEntity<T extends IEntity> implements IEntity {
  public readonly id: string;

  public constructor(props: T) {
    this.id = props.id;
  }

  /**
   * Allows to keep properties readonly but writeable within the class
   */
  protected $set<Key extends keyof T, Prop extends T[Key]>(
    prop: Key,
    value: Prop
  ): void {
    this.asWriteable[prop] = value;
  }

  private get asWriteable(): Writeable<T> {
    return cast<Writeable<T>>(this);
  }
}
