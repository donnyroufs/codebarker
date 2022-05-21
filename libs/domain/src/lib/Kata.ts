import { IEntity, NullOr } from '@codebarker/shared';

export interface IKataProps {
  id: string;
  content: string;
  completedAt: NullOr<Date>;
}

export class Kata implements IEntity, IKataProps {
  public readonly id: string;
  public readonly content: string;
  public readonly completedAt: NullOr<Date>;

  private constructor(props: IKataProps) {
    this.id = props.id;
    this.completedAt = props.completedAt;
    this.content = props.content;
  }

  public static make(props: IKataProps) {
    return new Kata(props);
  }
}
