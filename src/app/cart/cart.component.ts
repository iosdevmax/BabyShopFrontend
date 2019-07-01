import { Component, OnInit } from '@angular/core';
import {DataService} from '../Services/data.service';
import {SharedService} from '../Services/shared.service';
import {Item} from '../Models/item.model';
import {OrderItem} from '../Models/order-item.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: Array<OrderItem>;

  constructor(private data: DataService,
              private shared: SharedService) {
    this.data.retrieve_cart_items().subscribe(items => {
      this.cartItems = items;
      console.log(items);
    });
  }

  ngOnInit() {
  }

  incrementQuantity(value: boolean, index: number, item: OrderItem) {
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
            item.quantity = item.quantity + 1;
          }
        });
      }

    } else {
      if (num > 1) {
        this.data.update_item_quantity(itemId, selectedSize, num - 1).subscribe(result => {
          if (result) {
            input.value = String(num - 1);
            item.quantity = item.quantity - 1;
          }
        });
      }
    }

  }

  trackByItems(index: number, item: OrderItem): number {
    return item.quantity;
  }

  calculateTotalCost(): number {
    let total = 0;
    this.cartItems.forEach(function (item, index) {
      total += item.quantity * item.item.pr;
    });
    return total;
  }


  removeItemFromCart(item: Item) {

  }

  convertedSize(size: any): string {
    let displayStr = '';
    switch (size) {
      case 'm0_3' : {
        displayStr = '0-3';
        break;
      }
      case 'm3_6' : {
        displayStr = '3-6';
        break;
      }
      case 'm6_9' : {
        displayStr = '6-9';
        break;
      }
      case 'm9_12' : {
        displayStr = '9-12';
        break;
      }
      case 'm12_18' : {
        displayStr = '12-18';
        break;
      }
      case 'na' : {
        displayStr = 'One size';
        break;
      }
      default : {
        break;
      }
    }
    console.log('display string - ');
    return displayStr;
  }

}
