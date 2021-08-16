import { Property } from './interface/property';
import { PropertyType } from './enums/property';

export const properties: Property[] = [
  {
    id: '01',
    address: 'Some place free',
    description: `And this is nice Right padding if direction is left-to-right, and left
      padding if direction is right- to - left of the item inner`,
    name: 'Property A',
    type: PropertyType.residential,
    position: {
      lat: 8.948677279926585,
      lng: 125.5470567303216
    },
    price: 20000,
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3', 'Item 4']
  },
  {
    id: '02',
    address: 'Some place free',
    description: `And this is nice Right padding if direction is left-to-right, and left
      padding if direction is right- to - left of the item inner`,
    name: 'Property B',
    type: PropertyType.commercial,
    position: {
      lat: 8.948603092201049,
      lng: 125.54424652989282
    },
    price: 50000,
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8',
      'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8']
  },
  {
    id: '03',
    address: 'Some place free',
    description: 'And this is nice',
    name: 'Property C',
    type: PropertyType.industrial,
    position: {
      lat: 8.947998991587234,
      lng: 125.5430559487951
    },
    price: 30000,
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8']
  },
  {
    id: '04',
    address: 'Some place free',
    description: `And this is nice Right padding if direction is left-to-right, and left
      padding if direction is right- to - left of the item inner`,
    name: 'Property D',
    type: PropertyType.industrial,
    position: {
      lat: 8.947055744763734,
      lng: 125.5442679818045
    },
    price: 29995,
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3']
  },
  {
    id: '05',
    address: 'Some place free',
    description: 'And this is nice',
    name: 'Green Planes 45 E of Green Planes 45 E',
    type: PropertyType.land,
    position: {
      lat: 8.946536428053331,
      lng: 125.54334554960266
    },
    price: 20000,
    currency: 'PHP',
    features: []
  },
  {
    id: '06',
    address: 'Some place free',
    description: 'And this is nice',
    name: 'Property A',
    type: PropertyType.residential,
    position: {
      lat: 8.938677279926585,
      lng: 125.5470567303216
    },
    price: 20000,
    currency: 'PHP',
  },
];
