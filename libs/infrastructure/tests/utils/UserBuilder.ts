import { User, UserProps, UserRole } from '@codebarker/domain';

import { PrismaService } from '../../src';

export class UserBuilder {
  public static USER_ID = 'userId';
  private readonly _prisma: PrismaService;
  private _props: Partial<UserProps> = {};

  public constructor(repo: PrismaService) {
    this._prisma = repo;
  }

  public setId(id: string): this {
    this._props.id = id;

    return this;
  }

  public setEmail(email: string): this {
    this._props.email = email;
    return this;
  }

  public setName(name: string): this {
    this._props.name = name;
    return this;
  }

  public build(): User {
    return User.make({
      id: 'userId',
      email: 'foo@gmail.com',
      name: 'foo',
      role: UserRole.USER,
      ...this._props,
    });
  }

  public async buildAndPersist(): Promise<User> {
    const user = this.build();
    await this._prisma.user.upsert({
      where: {
        id: UserBuilder.USER_ID,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      update: {},
    });

    return user;
  }
}
