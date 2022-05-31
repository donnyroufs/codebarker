import { Container, ContainerModule } from 'inversify';

import { Constructor } from '../types';

export class TestingFactory {
  public static createContainer(
    ...modules: Constructor<ContainerModule>[]
  ): Container {
    const container = new Container();

    container.load(...modules.map((m) => new m()));

    return container;
  }
}
