import { shallowEqual } from 'shallow-equal-object';

export abstract class ValueObject<TProps extends Record<string, unknown>> {
  protected props: TProps;

  protected constructor(props: TProps) {
    this.props = props;
  }

  public equals(valueObject: ValueObject<TProps>): boolean {
    return shallowEqual(
      Object.values(this.props),
      Object.values(valueObject.props)
    );
  }
}
