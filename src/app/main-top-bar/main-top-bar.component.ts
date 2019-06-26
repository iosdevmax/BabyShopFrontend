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
  email = '';


  constructor(private router: Router, private auth: AuthService, private shared: SharedService) {
    this.auth.currentUser.subscribe(user => {
      this.currentUser = user;
    });

  }

  ngOnInit() {

    // checking local staorage if there is any wishlist items
    const wishItemsCount = JSON.parse(localStorage.getItem('wishlist')) as number;
    if (wishItemsCount) {
      this.setWishSpanWithData(wishItemsCount);
    }


    const loggedDiv = document.getElementById('logged-in') as HTMLElement;
    const notLogged = document.getElementById('not-logged') as HTMLElement;


    if (this.currentUser) {
      this.email = this.currentUser.email;
      notLogged.style.display = 'none';
      loggedDiv.style.display = 'block';
    } else {
      this.email = '';
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
  }

  setWishSpanWithData(value: number) {
    const wishCount = document.getElementById('wishcount');
    wishCount.textContent = String(value);
    console.log('Top panel -' + value);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
    // when logging out, clearing local storage
    this.shared.changeWishlistValue(0);
    localStorage.clear();
  }

}
