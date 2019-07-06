import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {User} from '../Models/user.model';
import {AuthService} from '../Services/auth.service';
import {AlertService} from '../Services/alert.service';
import {DataService} from '../Services/data.service';
import {SharedService} from '../Services/shared.service';
import {error} from 'selenium-webdriver';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit, OnDestroy {

  currentUser: User;
  currentUserSubscription: Subscription;


  constructor(private auth: AuthService,
              private data: DataService,
              private shared: SharedService) {
    this.currentUserSubscription = this.auth.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    // retrieving wishlist data once user logs in
    this.data.retrieve_wishlisted_items().subscribe( items => {
      const array = items as Array<any>;
      this.shared.changeWishlistValue(array.length);
      console.log('MyAccountComponent - Wishlist - ' + array.length)
      localStorage.setItem('wishlist', JSON.stringify(array.length));
    }, error1 => {
      console.log(error1);
    });

    // retrieving cart data once user logs in
    this.data.retrieve_cart_items().subscribe(items => {
      const array = items as Array<any>;
      this.shared.changeCartValue(array.length);
      console.log('MyAccountComponent - CART - ' + array.length)
      localStorage.setItem('cart', JSON.stringify(array.length));
    }, error1 => {
      console.log(error1);
    });

  }

  ngOnInit() {
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }


}
