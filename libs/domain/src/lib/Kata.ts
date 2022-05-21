import { ExcludeMethods, IEntity, NullOr } from '@codebarker/shared';

export class Kata implements IEntity {
  public readonly id: string;
  public readonly content: string;
  public readonly completedAt: NullOr<Date>;

  private constructor(props: KataProps) {
    this.id = props.id;
    this.completedAt = props.completedAt;
    this.content = props.content;
  }

  public static make(props: KataProps) {
    return new Kata(props);
  }
}

export type KataProps = ExcludeMethods<Kata>;
