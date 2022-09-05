import { User, UserRole } from '@codebarker/domain';

export type UserDtoProps = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
};

export class UserDto {
  public readonly name: string;
  public readonly email: string;
  public readonly role: UserRole;

  private constructor(props: UserDtoProps) {
    this.name = props.name;
    this.email = props.email;
    this.role = props.role;
  }

  public static from(user: User): UserDto {
    return new UserDto({
      email: user.email.value,
      id: user.id.value,
      name: user.name.value,
      role: user.role,
    });
  }
}
