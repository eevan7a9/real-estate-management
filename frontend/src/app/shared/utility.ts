export const sortListByName = <T>(
  items: T[],
  {
    asc = true,
    property,
  }: {
    asc?: boolean;
    property?: keyof T;
  } = {}
): T[] =>
  items.sort((a, b) => {
    const aName = String(property ? a[property] : a).toLowerCase();
    const bName = String(property ? b[property] : b).toLowerCase();

    if (!asc) {
      return aName < bName ? 1 : aName > bName ? -1 : 0;
    }

    return aName > bName ? 1 : aName < bName ? -1 : 0;
  });

export const sortListByDate = <T>(
  items: T[],
  {
    latest = true,
    property,
  }: {
    latest?: boolean;
    property?: keyof T;
  } = {}
): T[] =>
  items.sort((a, b) => {
    const aDate = new Date(String(property ? a[property] : a)).getTime();
    const bDate = new Date(String(property ? b[property] : b)).getTime();

    if (!latest) {
      return aDate > bDate ? 1 : aDate < bDate ? -1 : 0;
    }

    return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
  });

export const sortListByNumber = <T>(
  items: T[],
  {
    asc = true,
    property,
  }: {
    asc?: boolean;
    property?: keyof T;
  } = {}
): T[] =>
  items.sort((a, b) => {
    const aNum = Number(property ? a[property] : a);
    const bNum = Number(property ? b[property] : b);

    if (!asc) {
      return aNum > bNum ? 1 : aNum < bNum ? -1 : 0;
    }

    return aNum < bNum ? 1 : aNum > bNum ? -1 : 0;
  });