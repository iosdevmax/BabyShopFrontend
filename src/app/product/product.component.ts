import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { DataService } from '../Services/data.service';
import {ActivatedRoute, Data, Router} from '@angular/router';
import { Item } from '../Models/item.model';
import {log} from 'util';
import {SharedService} from '../Services/shared.service';
import {ItemDetails} from '../Models/item-details.model';
import {Size} from '../Models/size.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product?: ItemDetails;
  selectedSize: Size;
  productId: string;
  loading = false;
  itemCategory = '';

  recommendedItems: Array<Item>;
  initialWishlistSetup = false;

  constructor(private data: DataService,
              private router: ActivatedRoute,
              private shared: SharedService,
              private rout: Router) {
    this.router.params.subscribe(params => {
      this.productId = params.productid;
      console.log('PARAMS ID - ' + params.productid);
    });

    this.data.retrieve_recommended_items().subscribe(recItems => {
      this.recommendedItems = recItems;
    });

  }

  ngOnInit() {
    this.loading = true;
    this.data.retrieve_item_by_id(this.productId).subscribe(res => {
      this.product = res;
      this.itemCategory = this.product.cat;
      this.loading = false;

      console.log('product - ' + res.s);
    });

  }

  addItemToCart() {
    const input = document.getElementById('quantity-input') as HTMLInputElement;
    const errorView = document.getElementById('error-view') as HTMLInputElement;
    errorView.style.display = 'none';
    const inputQty = Number(input.value);
    const cartObjectDict = {
      i: {
        id : this.product.id,
        n: this.product.n,
        pr: this.product.pr,
        q: this.selectedSize.q,
        img: this.product.ph[0]
      },
      s: this.selectedSize.s,
      q: inputQty
    };

    this.data.add_item_to_cart(cartObjectDict).subscribe(success => {
      if (success.cart) {
        console.log('Item in the cart!');
        this.updateCartCount(inputQty);
      } else {
        // if product cannot be added to cart, display alert div
        errorView.style.display = 'block';
      }

    }, error1 => {
      console.log('Failed to add item');
    });

  }

  private updateCartCount(quantity: number) {
    // getting current cart count and updating it
    let currentCount = JSON.parse(localStorage.getItem('cart')) as number;
    currentCount = currentCount + quantity;

    // updating local storage with the result and wishlist count icon
    localStorage.setItem('cart', JSON.stringify(currentCount));
    this.shared.changeCartValue(currentCount);
  }

  checkIfDisabled(size: Size) {
    if (size.q === 0) {
      const input = document.getElementById('size-' + size.s) as HTMLInputElement;
      const parentDiv = document.getElementById('divs-' + size.s) as HTMLElement;
      input.disabled = true;
      parentDiv.className = 'sc-item disable';
    }
  }

  quantityChanged(size: Size) {
    this.selectedSize = size;
    // resetting quantity value
    const input = document.getElementById('quantity-input') as HTMLInputElement;
    input.value = String(1);
  }

  incrementQuantity(value: boolean) {
    const input = document.getElementById('quantity-input') as HTMLInputElement;
    const num = parseFloat(input.value);

    if (!this.selectedSize) {
      return;
    }

    if (value) {
      // incrementing as per available quantity
      if (num < this.selectedSize.q) {
        input.value = String(num + 1);
      }
    } else {
      if (num > 1) {
        input.value = String(num - 1);
      }
    }

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
