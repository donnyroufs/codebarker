import 'reflect-metadata';

import { Container } from 'inversify';

import { InfrastructureModule } from '@codebarker/infrastructure';
import { ApplicationModule } from '@codebarker/application';

export const container = new Container({
  skipBaseClassChecks: true,
});

// Remove when auth is implemented
export const __UserId = 'userId';

container.load(new ApplicationModule(), new InfrastructureModule());
