import { Component, OnInit } from '@angular/core';
import {DataService} from '../Services/data.service';
import {SharedService} from '../Services/shared.service';
import {Item} from '../Models/item.model';
import {element} from 'protractor';
import {CartObject} from '../Models/cart-object.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: Array<CartObject>;
  recommendedItems: Array<Item>;
  initialWishlistSetup = false;

  constructor(private data: DataService,
              private shared: SharedService, private rout: Router) {

    this.data.retrieve_cart_items().subscribe(items => {
      this.cartItems = items;
      // updating local storage with up-to-date info
      const cartCount = this.calcCartCountOnFirstLoad(items);
      localStorage.setItem('cart', JSON.stringify(cartCount));
      this.shared.changeCartValue(cartCount);
      console.log(items);
    });

    this.data.retrieve_recommended_items().subscribe(recItems => {
      this.recommendedItems = recItems;
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

  // ****************************
  // Recommended items methods
  // ****************************

  navigateToProductDetails(item: Item) {
    this.rout.navigate(['/product/' + item.id]);
  }

  setSaleAndNewLabels(item: Item, index: number) {

    const typeLabel = document.getElementById('itemTypeLabel' + index) as HTMLElement;
    // if item has no type, need to hide the type label
    if (!item.tp) {
      typeLabel.style.display = 'none';
      return;
    }
    const saleType = item.sl;
    const newType = item.tp.includes('new');
    // if both sale and new is false, hide the label
    if ((saleType && saleType === 0) && (newType && newType === true)) {
      typeLabel.style.display = 'none';
      return;
    }
    // if item's type is sale, displaying SALE label
    if (saleType && saleType !== 0) {
      typeLabel.style.display = 'block';
      typeLabel.className = 'tag-sale';
      typeLabel.innerHTML = 'SALE';
      return;
    }
    // if item's type is new, displaying New label
    if (newType && newType === true) {
      typeLabel.style.display = 'block';
      typeLabel.className = 'tag-new';
      typeLabel.innerHTML = 'NEW';
      return;
    }

  }

  addToCart(item: Item, index: number) {

  }

  addToWishlist(item: Item, index: number) {

    this.data.add_remove_to_wishlist(item).subscribe(result => {

      const wishIcon = document.getElementById('wishlist-icon-' + index);
      const isAdded = result['wishlist'];
      if (isAdded) {
        wishIcon.style.backgroundColor = 'red';
      } else {
        wishIcon.style.backgroundColor = 'white';
      }
      this.updateWishlistCount(isAdded);
    });
  }

  private updateWishlistCount(isAdded: boolean) {
    // getting current wishlist count and updating it
    let currentCount = JSON.parse(localStorage.getItem('wishlist')) as number;
    if (isAdded) {
      currentCount = currentCount + 1;
    } else {
      if (currentCount >= 1) {
        currentCount = currentCount - 1;
      }
    }

    // updating local storage with the result and wishlist count icon
    localStorage.setItem('wishlist', JSON.stringify(currentCount));
    this.shared.changeWishlistValue(currentCount);
  }

  setWishlistIcons(item: Item, index: number) {

    if (this.initialWishlistSetup) {
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // if current user object is null, it means the user hasn't logged into the website yet
    // return, as we have no data for the wishlist yet
    if (!currentUser) {
      return;
    }

    const currentUserId = currentUser.userId;
    const userIds = item.ws;
    const wishIcon = document.getElementById('wishlist-icon-' + index);

    if (userIds && userIds[currentUserId]) {
      wishIcon.style.backgroundColor = 'red';
    } else {
      wishIcon.style.backgroundColor = 'white';
    }

    if (index + 1 === this.recommendedItems.length) {
      this.initialWishlistSetup = true;
    }

  }
}
