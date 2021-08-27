import { Property } from './interface/property';
import { PropertyType } from './enums/property';
import { Enquiry } from './interface/enquiry';
import { EnquiryTopic } from './enums/enquiry';

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
  incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation
  ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit
  in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Excepteur sint occaecat cupidatat
  non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const shortText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor`;
const address1 = `BC-12 street. 45 gssto odio dignissimos ducimus 546-43-443 puos dolores et quas`;
const address2 = `Cana P05 Fuc Street, Log Town fa 777-733-678-745 puos dolores et quas`;
const address3 = `Road 34-43-45 gssto DDT dignissimos duc. Visit dolores et quas`;

export const users = {};

export const enquiries: Enquiry[] = [
  {
    content: longText,
    email: 'test@email.com',
    id: '01',
    date: new Date('2021/3/3'),
    title: 'Sed ut perspiciatis unde omnis iste?',
    topic: EnquiryTopic.schedule,
    read: true,
    property: {
      name: 'Homemaker Grande A',
      id: '01',
    },
  },
  {
    content: longText,
    email: 'naruto_uzumaki34@email.com',
    id: '02',
    date: new Date('2021/4/3'),
    title: 'illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
    topic: EnquiryTopic.payment,
    read: false,
    property: {
      name: 'The Glass Grande Maison B',
      id: '02',
    },
  },
  {
    content: longText,
    email: 'naruto_uzumaki34@email.com',
    id: '03',
    date: new Date('2021/7/13'),
    title: 'Lorem ipsum dolor sit amet, consectetur!!!',
    topic: EnquiryTopic.info,
    read: false,
    property: {
      name: 'La Grande Maison Certy C',
      id: '03',
    },
    user: {
      from: '01',
      to: '03'
    }
  },
  {
    content: longText,
    email: 'monkey_luffy12@email.com',
    id: '04',
    date: new Date('2021/7/5'),
    title: 'Duis aute irure dolor in reprehenderit in voluptate?',
    topic: EnquiryTopic.sales,
    read: true,
    property: {
      name: 'Green Planes 45 E Lorem ipsum',
      id: '05',
    },
  }
];

export const properties: Property[] = [
  {
    id: '01',
    address: address1,
    description: longText,
    name: 'Homemaker Grande A',
    type: PropertyType.residential,
    position: {
      lat: 8.948677279926585,
      lng: 125.5470567303216
    },
    price: 210000,
    date: new Date(),
    enquiries: ['12'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    userId: '01'
  },
  {
    id: '02',
    address: address3,
    description: longText,
    name: 'The Glass Grande Maison B',
    type: PropertyType.commercial,
    position: {
      lat: 8.948603092201049,
      lng: 125.54424652989282
    },
    date: new Date(),
    enquiries: [],
    price: 50000,
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8',
      'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8'],
    userId: '0002'
  },
  {
    id: '03',
    address: address1,
    description: shortText,
    name: 'La Grande Maison Certy C',
    type: PropertyType.industrial,
    position: {
      lat: 8.947998991587234,
      lng: 125.5430559487951
    },
    price: 30000,
    date: new Date('2021/08/25'),
    enquiries: ['351'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8'],
    userId: '01'
  },
  {
    id: '04',
    address: address3,
    description: `And this is nice Right padding if direction is left-to-right, and left
      padding if direction is right- to - left of the item inner`,
    name: 'EcoStay D 45-T',
    type: PropertyType.residential,
    position: {
      lat: 8.947055744763734,
      lng: 125.5442679818045
    },
    price: 29995,
    date: new Date('2021/08/13'),
    enquiries: ['241'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '05',
    address: address1,
    description: longText,
    name: 'Green Planes 45 E Lorem ipsum',
    type: PropertyType.land,
    position: {
      lat: 8.946536428053331,
      lng: 125.54334554960266
    },
    price: 410000,
    date: new Date('2021/08/13'),
    enquiries: ['231'],
    currency: 'PHP',
    features: [],
    userId: '0201'
  },
  {
    id: '06',
    address: address2,
    description: shortText,
    name: 'Entrepreneurship Stant Depo',
    type: PropertyType.residential,
    position: {
      lat: 8.938677279926585,
      lng: 125.5470567303216
    },
    price: 210000,
    date: new Date('2021/08/13'),
    enquiries: ['231'],

    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0201'
  },
  {
    id: '07',
    address: address2,
    description: shortText,
    name: 'Wared Glass House 34 T',
    type: PropertyType.residential,
    position: {
      lat: 8.946716599240885,
      lng: 125.54427401746118
    },
    price: 20000,
    date: new Date('2021/07/23'),
    enquiries: ['89'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0201'
  },
  {
    id: '08',
    address: '345-DBL - Butuan' + address1,
    description: shortText,
    name: 'Wared Glass House 34 T',
    type: PropertyType.residential,
    position: {
      lat: 8.947882410651568,
      lng: 125.54497120276352
    },
    price: 20000,
    date: new Date('2021/07/23'),
    enquiries: ['52'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0201'
  },
  {
    id: '09',
    address: 'HHA-32- ' + address1,
    description: shortText,
    name: 'Greenwood Darf House 34 T',
    type: PropertyType.residential,
    position: {
      lat: 8.948142068139031,
      lng: 125.54372735578022
    },
    price: 210000,
    date: new Date('2021/07/23'),
    enquiries: ['13'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0201'
  },
  {
    id: '10',
    address: '7AFa-32- Butuan' + address1,
    description: longText,
    name: 'Ingko Sand Factory D45',
    type: PropertyType.industrial,
    position: {
      lat: 8.947617453840735,
      lng: 125.54767413655091
    },
    price: 301500,
    date: new Date('2021/07/23'),
    enquiries: ['13'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0201'
  },
  {
    id: '11',
    address: 'Butuan-Da ' + address3,
    description: longText,
    name: 'Ingko Sand Factory D45',
    type: PropertyType.commercial,
    position: {
      lat: 8.947405488253153,
      lng: 125.5436626395807
    },
    price: 200000,
    date: new Date('2021/07/23'),
    enquiries: ['13'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0201'
  },
  {
    id: '12',
    address: 'Ga-567-75 Village-' + address3,
    description: longText,
    name: 'VineWood Pointe',
    type: PropertyType.commercial,
    position: {
      lat: 8.945942922334078,
      lng: 125.54540560283647
    },
    price: 4200000,
    date: new Date('2021/07/21'),
    enquiries: ['442'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0201'
  },
  {
    id: '13',
    address: 'Hard-454 Street' + address3,
    description: longText,
    name: 'Shoebox 45, Den',
    type: PropertyType.residential,
    position: {
      lat: 8.94526462889846,
      lng: 125.5448371286669
    },
    price: 200000,
    date: new Date('2021/07/21'),
    enquiries: ['22'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '13.5',
    address: 'YUYU-454 Street' + address3,
    description: longText,
    name: 'Butuan 45, Den',
    type: PropertyType.land,
    position: {
      lat: 8.943409913832452,
      lng: 125.5421770985904
    },
    price: 200000,
    date: new Date('2021/07/21'),
    enquiries: ['142'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '13.6',
    address: 'Butuan-Swamp 45' + address3,
    description: longText,
    name: 'Samp Land Fields',
    type: PropertyType.land,
    position: {
      lat: 8.94877266412289,
      lng: 125.54482103977531
    },
    price: 200000,
    date: new Date('2021/07/21'),
    enquiries: ['402'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '14',
    address: 'GG34-barton, street' + address3,
    description: longText,
    name: 'Rera 45m The Retreat',
    type: PropertyType.industrial,
    position: {
      lat: 14.599661202881137,
      lng: 120.98252611694767
    },
    price: 5000000,
    date: new Date('2021/07/21'),
    enquiries: ['402'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '15',
    address: 'Manila, street' + address3,
    description: longText,
    name: 'LightHouse and LightHouse',
    type: PropertyType.industrial,
    position: {
      lat: 14.600717610463624,
      lng: 120.98359334675658
    },
    price: 5000000,
    date: new Date('2021/07/21'),
    enquiries: ['402'],

    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '01'
  },
  {
    id: '16',
    address: 'Manila Street-45 ' + address3,
    description: longText,
    name: 'Brick and Morty',
    type: PropertyType.industrial,
    position: {
      lat: 14.59965601167655,
      lng: 120.98355580600953
    },
    price: 5000000,
    date: new Date('2021/06/17'),
    enquiries: ['54'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '17',
    address: 'Manila Street-34 ' + address1,
    description: shortText,
    name: 'MiniPalais',
    type: PropertyType.commercial,
    position: {
      lat: 14.600133601984957,
      lng: 120.98324743558737
    },
    price: 3400000,
    date: new Date('2021/06/17'),
    enquiries: ['54'],

    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '18',
    address: 'Manila Road 45 ' + address1,
    description: shortText,
    name: 'Manila Waters 45',
    type: PropertyType.commercial,
    position: {
      lat: 14.590545258899505,
      lng: 120.9808817025154
    },
    price: 3400000,
    date: new Date('2021/06/17'),
    enquiries: ['54'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '19',
    address: 'Manila Sreet. 48 ' + address1,
    description: shortText,
    name: 'Manila Doc 45',
    type: PropertyType.commercial,
    position: {
      lat: 14.591352523164922,
      lng: 120.98059210246676
    },
    price: 1400000,
    date: new Date('2021/06/17'),
    enquiries: ['54'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '20',
    address: 'Road La P56 ' + address1,
    description: shortText,
    name: 'Manila Shock',
    type: PropertyType.commercial,
    position: {
      lat: 14.590459600459646,
      lng: 120.98209373234864
    },
    price: 6400000,
    date: new Date('2021/06/17'),
    enquiries: ['54'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '21',
    address: 'Gahan Street' + address2,
    description: shortText,
    name: 'Gabi Fast',
    type: PropertyType.residential,
    position: {
      lat: 14.590161093514817,
      lng: 120.98018455138599
    },
    price: 120000,
    date: new Date('2021/06/17'),
    enquiries: ['54'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '22',
    address: 'Cebu Street 65' + address2,
    description: shortText,
    name: 'Twist Cebu',
    type: PropertyType.commercial,
    position: {
      lat: 10.300059512657363,
      lng: 123.89931574387101
    },
    price: 320000,
    date: new Date('2021/06/17'),
    enquiries: ['54'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '23',
    address: 'Cebu Street 65' + address2,
    description: longText,
    name: 'Gabi Communications Cebu',
    type: PropertyType.commercial,
    position: {
      lat: 10.299412960713473,
      lng: 123.89972064764271
    },
    price: 120000,
    date: new Date('2021/06/12'),
    enquiries: ['24'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '24',
    address: 'Cebu Road 65' + address2,
    description: longText,
    name: 'Cebu ForSale',
    type: PropertyType.industrial,
    position: {
      lat: 10.300998989853575,
      lng: 123.89968846985951
    },
    price: 120000,
    date: new Date('2021/06/12'),
    enquiries: ['13'],

    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '25',
    address: 'Cebu Road 21' + address3,
    description: longText,
    name: 'Susi Farm ForSale',
    type: PropertyType.land,
    position: {
      lat: 10.299695332541837,
      lng: 123.90047414406557
    },
    price: 920000,
    date: new Date('2021/06/12'),
    enquiries: ['34'],

    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '26',
    address: 'Cebu Gate 21' + address3,
    description: longText,
    name: 'Gaffart Store ForSale',
    type: PropertyType.commercial,
    position: {
      lat: 10.304545754928244,
      lng: 123.89983620948021
    },
    price: 990000,
    date: new Date('2021/06/12'),
    enquiries: ['34'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '26.6',
    address: 'Cebu Van 21' + address3,
    description: longText,
    name: 'Begin Cebu Building 65',
    type: PropertyType.commercial,
    position: {
      lat: 10.309356519058463,
      lng: 123.89247079081703
    },
    price: 1990000,
    date: new Date('2021/06/12'),
    enquiries: ['34'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '27',
    address: 'Cebu Sreet - ' + address3,
    description: longText,
    name: 'Begin Cebu Building 35',
    type: PropertyType.commercial,
    position: {
      lat: 10.309963467075868,
      lng: 123.89238498339523
    },
    price: 1990000,
    date: new Date('2021/06/12'),
    enquiries: ['34'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '27.5',
    address: 'Cebu Access Fuente - ' + address3,
    description: longText,
    name: 'OpenSource Cebu 45',
    type: PropertyType.commercial,
    position: {
      lat: 10.30896332167512,
      lng: 123.89305526953659
    },
    price: 1990000,
    date: new Date('2021/06/12'),
    enquiries: ['134'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '28',
    address: 'Cebu Village - 32' + address3,
    description: longText,
    name: 'Garden Fret',
    type: PropertyType.land,
    position: {
      lat: 10.30896332167512,
      lng: 123.89305526953659
    },
    price: 1990000,
    date: new Date('2021/06/12'),
    enquiries: ['134'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '28.5',
    address: 'Cebu Village - 31' + address3,
    description: longText,
    name: 'Haffa Fields',
    type: PropertyType.land,
    position: {
      lat: 10.44065159897836,
      lng: 123.84183562005497
    },
    price: 130000,
    date: new Date('2021/04/23'),
    enquiries: ['128'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '29',
    address: 'Davao Street - 31' + address3,
    description: shortText,
    name: 'Gahhard Fields',
    type: PropertyType.commercial,
    position: {
      lat: 7.067493243037776,
      lng: 125.60032146648845
    },
    price: 130000,
    date: new Date('2021/04/23'),
    enquiries: ['148'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '29.5',
    address: 'Davao Build - 31' + address3,
    description: shortText,
    name: 'Hard Fields',
    type: PropertyType.residential,
    position: {
      lat: 7.06748259572032,
      lng: 125.59963500711387
    },
    price: 730000,
    date: new Date('2021/04/23'),
    enquiries: ['28'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '30',
    address: 'Davao Pedro - 21' + address3,
    description: shortText,
    name: 'Sad Fry',
    type: PropertyType.commercial,
    position: {
      lat: 7.064929894282939,
      lng: 125.60884816677601
    },
    price: 730000,
    date: new Date('2021/04/23'),
    enquiries: ['8'],
    currency: 'PHP',
    features: ['Item 1', 'Item 2', 'Item 3'],
    userId: '0001'
  },
  {
    id: '30.5',
    address: 'Davao Street. FA' + address3,
    description: shortText,
    name: 'John Doe Shos',
    type: PropertyType.commercial,
    position: {
      lat: 7.064110045575158,
      lng: 125.60793378143721
    },
    price: 730000,
    date: new Date('2021/04/23'),
    enquiries: ['8'],
    currency: 'PHP',
    userId: '0001'
  }
];
