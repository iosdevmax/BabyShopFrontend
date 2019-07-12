import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  handleChange(evt) {
    const buttonId = evt.target.id;
    const total = document.getElementById('shipping-amount');
    if (buttonId === 'standard') {
      total.innerText = '€5.00';
    } else {
      total.innerText = '€10.00';
    }
  }

}
