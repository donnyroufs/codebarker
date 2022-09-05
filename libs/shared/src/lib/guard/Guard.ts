import { AgainstClause } from './AgainstClause';
import { IsClause } from './IsClause';

export class Guard {
  public static Against = new AgainstClause();
  public static Is = new IsClause();
}
