import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private wishlistValueSource = new BehaviorSubject<number>( null);
  wishlistValue = this.wishlistValueSource.asObservable();

  constructor() { }

  changeWishlistValue(value: number) {
    this.wishlistValueSource.next(value);
  }

}
