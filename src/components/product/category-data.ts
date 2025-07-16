export interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 1,
    name: "Cakes",
    image: "https://images.unsplash.com/photo-1590251786954-cf189e67d0bd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "Delicious cakes for every occasion, from chocolate to fruit flavors.",
  },
  {
    id: 2,
    name: "Cheesecakes",
    image: "https://images.unsplash.com/photo-1559656914-a30970c1affd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "Creamy cheesecakes with a variety of toppings and bases.",
  },
  {
    id: 3,
    name: "Oriental Sweets",
    image: "https://images.unsplash.com/photo-1533910534207-90f31029a78e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "Traditional Middle Eastern desserts like baklava, basbousa, and kunafa.",
  },
  {
    id: 4,
    name: "Pastries",
    image: "https://images.unsplash.com/photo-1657679358567-c01939c7ad42?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "French and international pastries, including macarons and more.",
  },
  {
    id: 5,
    name: "Cookies",
    image: "https://images.unsplash.com/photo-1590251786954-cf189e67d0bd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "Freshly baked cookies with a variety of flavors and fillings.",
  },
  {
    id: 6,
    name: "Ice Cream",
    image: "https://images.unsplash.com/photo-1559656914-a30970c1affd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "Refreshing ice cream in various flavors and toppings.",
  },
  {
    id: 7,
    name: "Pies",
    image: "https://images.unsplash.com/photo-1533910534207-90f31029a78e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "Sweet and savory pies with delicious fillings.",
  },
  {
    id: 8,
    name: "Brownies",
    image: "https://images.unsplash.com/photo-1657679358567-c01939c7ad42?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "Rich and fudgy brownies for chocolate lovers.",
  },
  {
    id: 9,
    name: "Muffins",
    image: "https://images.unsplash.com/photo-1619286311276-d8343d00ce1f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "Soft and fluffy muffins in different flavors.",
  },
  {
    id: 10,
    name: "Tarts",
    image: "https://images.unsplash.com/photo-1559656914-a30970c1affd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
    description: "Crispy tarts with fruit, chocolate, or custard fillings.",
  },
]; 