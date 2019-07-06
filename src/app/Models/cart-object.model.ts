export class CartObject {
  // cart item's id
  id: string;
  // item data
  i: CartItem;
  // q-ty added to cart
  q: number;
  // size added to cart
  s: string;
}

export class CartItem {
  // item's id
  id: string;
  // item's name
  n: string;
  // item's price
  pr: number;
  // item's available q-ty
  q: number;
  // item's photo url
  img: string;
}
