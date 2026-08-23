import { TransactionType, PropertyType } from '../enums/property';
import { Property } from '../interface/property';
import { sortListByName, sortListByNumber, sortListByDate } from '../utility';

export function searchProperties(
  text: string,
  properties: Property[]
): Property[] {
  const searchText = text.trim().toLowerCase();

  return properties.filter((item: Property) => {
    const name = item.name?.toLowerCase();
    const address = item.address?.toLowerCase();
    return name?.includes(searchText) || address?.includes(searchText);
  });
}

export function filterProperties(
  filter: string,
  properties: Property[] = []
): Property[] | undefined {
  if (!filter) return;

  const selectedFilters = filter.split(',').map((value) => value.trim());
  const transactionTypes = [
    TransactionType.forSale,
    TransactionType.forRent
  ].filter((type) => selectedFilters.includes(type));
  const propertyTypes = [
    PropertyType.commercial,
    PropertyType.industrial,
    PropertyType.land,
    PropertyType.residential
  ].filter((type) => selectedFilters.includes(type));

  return properties.filter((prprty) => {
    if (
      transactionTypes.length &&
      !transactionTypes.includes(prprty.transactionType)
    )
      return false;
    if (propertyTypes.length && !propertyTypes.includes(prprty.type))
      return false;
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
