import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CartObject} from '../Models/cart-object.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  orderItems: Array<CartObject>;

  // observable value to update wishlist icon count
  private wishlistValueSource = new BehaviorSubject<number>( null);
  wishlistValue = this.wishlistValueSource.asObservable();

  // observable value to update cart icon count
  private cartValueSource = new BehaviorSubject<number>( null);
  cartValue = this.cartValueSource.asObservable();

  constructor() { }

  changeWishlistValue(value: number) {
    this.wishlistValueSource.next(value);
  }

  changeCartValue(value: number) {
    this.cartValueSource.next(value);
  }


}
