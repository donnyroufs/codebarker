import {
  User,
  UserEmail,
  UserId,
  UserName,
  UserProps,
  UserRole,
} from '@codebarker/domain';

import { PrismaService } from '../../src';

export class UserBuilder {
  public static USER_ID = UserId.make({ value: 'userId' });
  private readonly _prisma: PrismaService;
  private _props: Partial<UserProps> = {};

  public constructor(repo: PrismaService) {
    this._prisma = repo;
  }

  public setId(id: string): this {
    this._props.id = UserId.make({ value: id });

    return this;
  }

  public setEmail(email: string): this {
    this._props.email = UserEmail.make(email);
    return this;
  }

  public setName(name: string): this {
    this._props.name = UserName.make(name);
    return this;
  }

  public build(): User {
    return User.make({
      id: UserId.make({ value: 'userId' }),
      email: UserEmail.make('foo@gmail.com'),
      name: UserName.make('foo'),
      role: UserRole.User,
      ...this._props,
    });
  }

  public async buildAndPersist(): Promise<User> {
    const user = this.build();
    await this._prisma.user.upsert({
      where: {
        id: UserBuilder.USER_ID.value,
      },
      create: {
        id: user.id.value,
        name: user.name.value,
        email: user.email.value,
        role: user.role,
      },
      update: {},
    });

    return user;
  }
}
