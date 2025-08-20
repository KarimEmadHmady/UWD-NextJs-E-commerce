import type { LoyaltyReward } from './LoyaltyPanel'

export const availableRewards: LoyaltyReward[] = [
  {
    id: 'freeDrink',
    name: 'مشروب مجاني',
    pointsCost: 300,
    description: 'احصل على مشروب مجاني مع طلبك',
    type: 'product',
    productId: 900001,
    productName: 'مشروب مجاني',
    productPrice: 0,
  },
  {
    id: 'freeFries',
    name: 'بطاطس مجانية',
    pointsCost: 400,
    description: 'بطاطس مقلية مجانية مع أي وجبة',
    type: 'product',
    productId: 900002,
    productName: 'بطاطس مجانية',
    productPrice: 0,
  },
  {
    id: 'freeDelivery',
    name: 'توصيل مجاني',
    pointsCost: 350,
    description: 'توصيل مجاني للطلبات فوق 150 جنيه',
    type: 'freeShipping',
  },
  {
    id: 'discount10',
    name: 'خصم 10 جنيه',
    pointsCost: 500,
    description: 'خصم 10 جنيه على طلبك القادم (حد أدنى 150 جنيه)',
    type: 'discount',
    value: 10,
  },
  {
    id: 'discount25',
    name: 'خصم 25 جنيه',
    pointsCost: 1200,
    description: 'خصم 25 جنيه على طلبك القادم (حد أدنى 200 جنيه)',
    type: 'discount',
    value: 25,
  },
];


