import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { DataService } from '../Services/data.service';
import {ActivatedRoute, Data} from '@angular/router';
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

  constructor(private data: DataService, private router: ActivatedRoute, private shared: SharedService) {
    this.router.params.subscribe(params => {
      this.productId = params.productid;
      console.log('PARAMS ID - ' + params.productid);
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
    let inputQty = Number(input.value);
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
}
