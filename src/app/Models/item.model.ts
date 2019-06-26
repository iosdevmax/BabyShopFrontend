export interface Item {
  // item id
  id: string;
  // item description
  ds: string;
  // item name
  n: string;
  // item price
  pr: number;
  // item photos
  ph: [string];
  // item types: sale, new
  tp: [any];
  // item's category
  cat: string;
  // item sizes and quantity
  sizes: any;
  // list of user Ids that wishlisted the item
  ws: any;
}
