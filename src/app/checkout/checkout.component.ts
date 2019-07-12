import { Component, OnInit, AfterViewChecked } from '@angular/core';
import {DataService} from '../Services/data.service';
import {CartObject} from '../Models/cart-object.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, AfterViewChecked {

  cartItems: Array<CartObject>;

  constructor(private data: DataService) {
    this.data.retrieve_cart_items().subscribe(res => {
      this.cartItems = res;
    });
  }

  ngOnInit() {
    const cardForm = document.getElementById('card-details');
    cardForm.hidden = true;
  }

  handleDeliveryChange(evt) {
    const buttonId = evt.target.id;
    const shipping = document.getElementById('shipping-amount');
    if (buttonId === 'standard') {
      shipping.innerText = '€5';
    } else {
      shipping.innerText = '€10';
    }

  }

  handlePaymentChange(event) {
    const buttonId = event.target.id;
    const cardForm = document.getElementById('card-details');
    if (buttonId === 'paypal') {
      cardForm.hidden = true;
    } else {
      cardForm.hidden = false;
    }
  }


  ngAfterViewChecked() {
    this.calculateTotalAmount(this.cartItems);
  }

  calculateTotalAmount(items: Array<CartObject>) {
    if (this.cartItems === undefined) {
      return;
    }
    const preSumEl = document.getElementById('pre-sum');
    const shippingEl = document.getElementById('shipping-amount');
    const totalEl = document.getElementById('total-sum');

    let preSum = 0;
    this.cartItems.forEach( item => preSum = preSum + item.i.pr * item.q);
    preSumEl.innerText = '€' + String(preSum);
    const totalSum = preSum + Number(shippingEl.innerText.substring(1));

    totalEl.innerText = '€' + String(totalSum);
  }

}
