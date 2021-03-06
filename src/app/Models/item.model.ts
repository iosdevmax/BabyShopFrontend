import {Size} from './size.model';

export interface Item {
  // item id
  id: string;
  // item name
  n: string;
  // item price
  pr: number;
  // item photo
  img: string;
  // item sale: discount percentage
  sl: number;
  // item types: sale, new
  tp: [string];
  // item's category
  cat: string;
  // item sizes and quantity
  s: [Size];
  // list of user Ids that wishlisted the item
  ws: [string];
}
