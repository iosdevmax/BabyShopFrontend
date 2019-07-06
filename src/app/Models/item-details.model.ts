import {Size} from './size.model';

export class ItemDetails {
  // item id
  id: string;
  // item description
  ds: string;
  // item name
  n: string;
  // item price
  pr: number;
  // item sale: discount percentage
  sl: number;
  // item photos
  ph: [string];
  // item types: sale, new
  tp: [string];
  // item's category
  cat: string;
  // item sizes and quantity
  s: [Size];
  // list of user Ids that wishlisted the item
  ws: [string];
}
