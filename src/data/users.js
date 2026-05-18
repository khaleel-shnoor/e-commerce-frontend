import { placeholderImage } from '../lib/utils';

export const users = [
  {
    id: 'user-1',
    name: 'Alex Morgan',
    email: 'alex@example.com',
    role: 'customer',
    avatar: placeholderImage(200, 200, 'AM'),
    phone: '+1 555 0101',
    joinedAt: '2024-03-15',
    status: 'active',
  },
  {
    id: 'user-2',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    role: 'customer',
    avatar: placeholderImage(200, 200, 'JL'),
    phone: '+1 555 0102',
    joinedAt: '2024-06-22',
    status: 'active',
  },
  {
    id: 'user-3',
    name: 'Sam Rivera',
    email: 'sam@example.com',
    role: 'seller',
    avatar: placeholderImage(200, 200, 'SR'),
    phone: '+1 555 0103',
    joinedAt: '2023-11-08',
    status: 'active',
  },
];

export const currentUser = users[0];
