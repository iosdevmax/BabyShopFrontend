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
    });
  }

  ngOnInit() {
  }

}
