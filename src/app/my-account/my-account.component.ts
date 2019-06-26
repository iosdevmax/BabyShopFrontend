import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {User} from '../Models/user.model';
import {AuthService} from '../Services/auth.service';
import {AlertService} from '../Services/alert.service';
import {DataService} from '../Services/data.service';
import {SharedService} from '../Services/shared.service';

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
    }, error => {
      console.log(error);
    });
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }


}
