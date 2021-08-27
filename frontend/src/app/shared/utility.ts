export const headerDict = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'Content-Type': 'application/json',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Accept: 'application/json',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const sortListByName = (
  items: any[],
  { asc = true, property = null } = {}
) => items.sort((a: any, b: any) => {
  const aName = property ? a[property].toLowerCase() : a.toLowerCase();
  const bName = property ? b[property].toLowerCase() : b.toLowerCase();
  if (!asc) {
    return aName < bName ? 1 : aName > bName ? -1 : 0;
  }
  return aName > bName ? 1 : aName < bName ? -1 : 0;
});

export const sortListByDate = (
  items: any[],
  { latest = true, property = null } = {}
) => items.sort((a: any, b: any) => {
  const aDate = property ? a[property].getTime() : a.getTime();
  const bDate = property ? b[property].getTime() : b.getTime();
  if (!latest) {
    return aDate > bDate ? 1 : aDate < bDate ? -1 : 0;
  }
  return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
});

export const sortListByNumber = (
  items: any[],
  { asc = true, property = null } = {}
) => items.sort((a: any, b: any) => {
  const aNum = property ? Number(a[property]) : Number(a);
  const bNum = property ? Number(b[property]) : Number(a);
  if (!asc) {
    return aNum > bNum ? 1 : aNum < bNum ? -1 : 0;
  }
  return aNum < bNum ? 1 : aNum > bNum ? -1 : 0;
});
