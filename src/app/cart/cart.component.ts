import { Component, OnInit } from '@angular/core';
import {DataService} from '../Services/data.service';
import {SharedService} from '../Services/shared.service';
import {Item} from '../Models/item.model';
import {element} from 'protractor';
import {CartObject} from '../Models/cart-object.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: Array<CartObject>;

  constructor(private data: DataService,
              private shared: SharedService) {
    this.data.retrieve_cart_items().subscribe(items => {
      this.cartItems = items;
      // updating local storage with up-to-date info
      const cartCount = this.calcCartCountOnFirstLoad(items);
      localStorage.setItem('cart', JSON.stringify(cartCount));
      this.shared.changeCartValue(cartCount);
      console.log(items);
    });
  }

  ngOnInit() {
  }

  calcCartCountOnFirstLoad(items: Array<CartObject>): number {

    let count = 0;
    items.forEach(function (item, index) {
      count = count + Number(item.q);
    });
    return count;
  }

  incrementQuantity(value: boolean, index: number, item: CartObject) {
    const input = document.getElementById('quantity-input-' + index) as HTMLInputElement;
    const num = parseFloat(input.value);
    const itemId = item.id;

    const selectedSize = item.i;
    const availableQty = item.i.q;

    if (!selectedSize || !availableQty) {
      return;
    }

    let currentCount = JSON.parse(localStorage.getItem('cart')) as number;

    if (value) {
      // incrementing as per available quantity
      if (num < availableQty) {
        // updating qty in user cart first
        this.data.update_item_quantity(itemId,  {qty: num + 1}).subscribe(result => {
          if (result) {
            input.value = String(num + 1);
            item.q = item.q + 1;

            currentCount = currentCount + 1;
            // updating local storage with the result and cart count icon
            localStorage.setItem('cart', JSON.stringify(currentCount));
            this.shared.changeCartValue(currentCount);
          }
        });
      }

    } else {
      if (num > 1) {
        this.data.update_item_quantity(itemId, {qty: num - 1}).subscribe(result => {
          if (result) {
            input.value = String(num - 1);
            item.q = item.q - 1;

            currentCount = currentCount - 1;
            // updating local storage with the result and cart count icon
            localStorage.setItem('cart', JSON.stringify(currentCount));
            this.shared.changeCartValue(currentCount);
          }
        });
      }
    }

  }

  trackByItems(index: number, item: CartObject): CartObject {
    return item;
  }

  calculateTotalCost(): number {
    let total = 0;
    this.cartItems.forEach(function (item, index) {
      total += item.q * item.i.pr;
    });
    return total;
  }


  removeItemFromCart(item: CartObject) {

    this.data.remove_item_from_cart(item.id).subscribe(success => {
      if (success) {
        this.updateCartCount(item.q);
        this.cartItems = this.cartItems.filter(el => {
          return el.id !== item.id;
        });
      }

    }, error1 => {
      console.log('Failed removing item');
    });

  }

  private updateCartCount(quantity: number) {
    // getting current cart count and updating it
    let currentCount = JSON.parse(localStorage.getItem('cart')) as number;
    if (currentCount >= quantity) {
      currentCount = currentCount - quantity;
    }

    // updating local storage with the result and cart count icon
    localStorage.setItem('cart', JSON.stringify(currentCount));
    this.shared.changeCartValue(currentCount);
  }

}
