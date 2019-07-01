import { Component, OnInit } from '@angular/core';
import {DataService} from '../Services/data.service';
import {SharedService} from '../Services/shared.service';
import {Item} from '../Models/item.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: Array<Item>;

  constructor(private data: DataService,
              private shared: SharedService) {
    this.data.retrieve_cart_items().subscribe(items => {
      this.cartItems = items;
      console.log(items);
    });
  }

  ngOnInit() {
  }

  incrementQuantity(value: boolean, index: number, item: any) {
    const input = document.getElementById('quantity-input-' + index) as HTMLInputElement;
    const num = parseFloat(input.value);
    const itemId = item.item.id;

    const selectedSize = item.size;
    const availableQty = item.item.sizes[selectedSize];

    if (!selectedSize || !availableQty) {
      return;
    }

    if (value) {
      // incrementing as per available quantity
      if (num < availableQty) {
        // updating qty in user cart first
        this.data.update_item_quantity(itemId, selectedSize, num + 1).subscribe(result => {
          if (result) {
            input.value = String(num + 1);
          }
        });
      }

    } else {
      if (num > 1) {
        this.data.update_item_quantity(itemId, selectedSize, num - 1).subscribe(result => {
          if (result) {
            input.value = String(num - 1);
          }
        });
      }
    }

  }

}
