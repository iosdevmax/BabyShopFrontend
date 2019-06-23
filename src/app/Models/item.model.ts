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
}
