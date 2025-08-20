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
    image: '/coca can.webp',
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
    image: '/frize.jpg',
  },
  {
    id: 'freeDelivery',
    name: 'توصيل مجاني',
    pointsCost: 350,
    description: 'توصيل مجاني للطلبات فوق 150 جنيه',
    type: 'freeShipping',
    image: '/freedeliv.png',
  },
  {
    id: 'discount10',
    name: 'خصم 10%',
    pointsCost: 500,
    description: 'خصم 10% على طلبك القادم (حد أدنى 150 جنيه) بحد أقصى 20% من قيمة السلة',
    type: 'discount',
    value: 10,
    isPercent: true,
    image: '/dis10.webp',
  },
  {
    id: 'discount25',
    name: 'خصم 25%',
    pointsCost: 1200,
    description: 'خصم 25% على طلبك القادم (حد أدنى 200 جنيه)',
    type: 'discount',
    value: 25,
    isPercent: true,
    image: '/dis25.png',
  },
];


