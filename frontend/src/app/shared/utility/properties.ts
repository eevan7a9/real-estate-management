import { TransactionType, PropertyType } from '../enums/property';
import { Property } from '../interface/property';
import { sortListByName, sortListByNumber, sortListByDate } from '../utility';

export function searchProperties(
  text: string,
  properties: Property[]
): Property[] {
  return properties.filter((item: Property) => {
    const name = item.name?.toLowerCase();
    const address = item.address?.toLowerCase();
    return name?.includes(text) || address?.includes(text);
  });
}

export function filterProperties(
  filter: string,
  properties: Property[] = []
): Property[] {
  if (!filter) return;
  const sale = filter.includes(TransactionType.forSale);
  const rent = filter.includes(TransactionType.forRent);
  const propertyType =
    filter.includes(PropertyType.commercial) ||
    filter.includes(PropertyType.industrial) ||
    filter.includes(PropertyType.land) ||
    filter.includes(PropertyType.residential);

  return properties.filter((prprty) => {
    if (sale && prprty.transactionType !== TransactionType.forSale)
      return false;
    if (rent && prprty.transactionType !== TransactionType.forRent)
      return false;
    if (propertyType && !filter.includes(prprty.type)) return false;
    return true;
  });
}

export function sortProperties(
  sortBy: string,
  properties: Property[] = []
): Property[] {
  switch (sortBy) {
    case 'name':
      return sortListByName(properties, { property: 'name' });
    case 'price':
      return sortListByNumber(properties, { property: 'price' });
    default:
      return sortListByDate(properties, { property: 'createdAt' });
  }
}
