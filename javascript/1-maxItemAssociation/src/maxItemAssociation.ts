export type Group<T> = T[];

function sortFn<T>(a: T, b: T) {
  return a > b ? 1 : -1;
}

function sortLengthFn<T>(a: T[], b: T[]) {
  return a.length > b.length ? -1 : 1;
}

export function maxItemAssociation<T = string>(groups: Group<T>[]): T[] {
  const itemLinkSets = new Map<T, Set<T>>();

  groups.forEach((group) => {
    group.forEach((groupItem) => {
      const groupItemSet = itemLinkSets.get(groupItem) ?? new Set<T>();
      group.forEach(groupItemSet.add, groupItemSet);
      itemLinkSets.set(groupItem, groupItemSet);
    });
  });

  function fillLinkedItems(set: Set<T>, uniq: Set<T>, res: Set<T>) {
    set.forEach((i) => {
      const itemLinkSet = itemLinkSets.get(i);
      itemLinkSet?.forEach(res.add, res);
      if (!uniq.has(i) && itemLinkSet) {
        uniq.add(i);
        fillLinkedItems(itemLinkSet, uniq, res);
      }
    });
    return res;
  }

  const res: T[][] = [];
  itemLinkSets.forEach((set, item) => {
    res.push(
      [...fillLinkedItems(set, new Set<T>(), new Set<T>()).values()].sort(
        sortFn
      )
    );
  });
  res.sort(sortLengthFn);
  return res[0];
}
