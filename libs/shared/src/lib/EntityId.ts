import { Guard } from './guard';
import { ValueObject } from './ValueObject';

type EntityIdProps = {
  value: string;
};

export class EntityId extends ValueObject<EntityIdProps> {
  protected constructor(props: EntityIdProps) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static make(props: EntityIdProps): EntityId {
    return new this({
      value: Guard.Against.nullOrWhiteSpace('value', props.value),
    });
  }
}
