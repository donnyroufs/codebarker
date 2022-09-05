/**
 * Entities make use of a property called _props so that we can
 * encapsulate properties as fine as possible. The problem however
 * is that when we want to compare values, JavaScript does not know
 * how to get the exposed **computed** properties. So instead we can do:
 *
 * @example
 * expect(repo.save).toHaveBeenCalledWith({
 *   _props: instanceToObject(MyEntity, expectedEntity),
 * });
 */
export function toPlainObject(constr: any, instance: any): any {
  return (
    Object.entries(Object.getOwnPropertyDescriptors(constr.prototype))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, descriptor]) => typeof descriptor.get === 'function')
      .map(([key]) => key)
      .reduce<any>((acc, curr) => {
        acc[curr] = instance[curr];
        return acc;
      }, {})
  );
}
