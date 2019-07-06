import { Component, OnInit } from '@angular/core';
import {AuthService} from '../Services/auth.service';
import {User} from '../Models/user.model';
import {Router} from '@angular/router';
import {SharedService} from '../Services/shared.service';

@Component({
  selector: 'app-main-top-bar',
  templateUrl: './main-top-bar.component.html',
  styleUrls: ['./main-top-bar.component.css']
})
export class MainTopBarComponent implements OnInit {
  clothing = 'Clothing';
  bath = 'Bath';
  nursery = 'Nursery';

  currentUser: User;
  username: string;


  constructor(private router: Router, private auth: AuthService, private shared: SharedService) {
    this.auth.currentUser.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.username = this.currentUser.first;
      } else {
        // if user hasn't logged in, setting default user data
        this.username = '';
      }
    });

  }

  ngOnInit() {

    // checking local staorage if there is any wishlist items
    const wishItemsCount = JSON.parse(localStorage.getItem('wishlist')) as number;
    if (wishItemsCount) {
      this.setWishSpanWithData(wishItemsCount);
    }

    // checking local staorage if there is any cart items
    const cartItemsCount = JSON.parse(localStorage.getItem('cart')) as number;
    if (cartItemsCount) {
      this.setCartSpanWithData(cartItemsCount);
    }


    const loggedDiv = document.getElementById('logged-in') as HTMLElement;
    const notLogged = document.getElementById('not-logged') as HTMLElement;


    if (this.currentUser) {
      notLogged.style.display = 'none';
      loggedDiv.style.display = 'block';
    } else {
      this.username = '';
      // notLogged.style.display = 'block';
      loggedDiv.style.display = 'none';
    }


    this.shared.wishlistValue.subscribe(value => {
      // skipping null value that set on first load
      if (value === null || value === undefined) {
        return;
      }
      this.setWishSpanWithData(value);
    });

    this.shared.cartValue.subscribe(value => {
      // skipping null value that set on first load
      if (value === null || value === undefined) {
        return;
      }
      this.setCartSpanWithData(value);
    });

  }

  setWishSpanWithData(value: number) {
    const wishCount = document.getElementById('wishcount');
    wishCount.textContent = String(value);
    console.log('Top panel wish -' + value);
  }

  setCartSpanWithData(value: number) {
    const cartCount = document.getElementById('cartcount');
    cartCount.textContent = String(value);
    console.log('Top panel cart -' + value);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
    // when logging out, clearing local storage
    this.shared.changeWishlistValue(0);
    this.shared.changeCartValue(0);
    localStorage.clear();
  }

}
