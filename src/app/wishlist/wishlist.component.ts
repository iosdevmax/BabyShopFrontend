import { Component, OnInit } from '@angular/core';
import {DataService} from '../Services/data.service';
import {SharedService} from '../Services/shared.service';
import {Item} from '../Models/item.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  wishlistItems: Array<Item>;

  constructor(private data: DataService,
              private shared: SharedService) {
    this.data.retrieve_wishlisted_items().subscribe(items => {
      this.wishlistItems = items;
      // updating local storage with up-to-date info
      localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems.length));
      this.shared.changeWishlistValue(this.wishlistItems.length);
    });
  }

  ngOnInit() {

  }

  removeFromWishlist(item: Item, index: number) {
    this.data.add_remove_to_wishlist(item).subscribe(result => {
      // if successfully removed, updating top view and local storage
      const isAdded = result['wishlist'];
      if (isAdded === false) {
        this.updateWishlistCount(isAdded);
        this.wishlistItems = this.wishlistItems.filter( element => {
          return element.id !== item.id;
        });
      }

    });
  }

  private updateWishlistCount(isAdded: boolean) {
    // getting current wishlist count and updating it
    let currentCount = JSON.parse(localStorage.getItem('wishlist')) as number;
    if (isAdded) {
      currentCount = currentCount + 1;
    } else {
      if (currentCount >= 1) {
        currentCount = currentCount - 1;
      }
    }

    // updating local storage with the result and wishlist count icon
    localStorage.setItem('wishlist', JSON.stringify(currentCount));
    this.shared.changeWishlistValue(currentCount);
  }

}
