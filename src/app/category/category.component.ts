import {Component, Directive, OnInit} from '@angular/core';
import { DataService } from '../Services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import { Item } from '../Models/item.model';
import {element} from 'protractor';
import {SharedService} from '../Services/shared.service';
import {min} from 'rxjs/operators';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categoryName: string;
  items: Item[] = [];
  sortedItems: Item[] = [];
  loading = false;
  selectedFilters: string[] = []
  initialWishlistSetup = false;

  constructor(private router: ActivatedRoute,
              private data: DataService,
              private shared: SharedService, private rout: Router) {
    this.router.params.subscribe(params => {
      this.categoryName = params.catName;
    });
  }

  ngOnInit() {
    // retrieving items for selected category
    // if sale is selected, fetch sale items
    this.loading = true;
    if (this.categoryName === 'sale') {
      this.data.retrieve_sale_items().subscribe(res => {
        this.loading = false;
        console.log(res);
        this.items = res;
      });
      return;
    }

    this.data.retrieve_items_for_category(this.categoryName).subscribe(res => {
      this.items = res;
      this.sortedItems = res;
      this.loading = false;
      this.setMinMaxPrice(res);
    });

  }

  private setMinMaxPrice(items: Item[]) {
    items.sort( function (a, b) {
      return a.pr - b.pr;
    });

    const minPrice = items[0].pr;
    const maxPrice = items[items.length - 1].pr;
    const minPriceInput = document.getElementById('price-min') as HTMLInputElement;
    const minPriceLabel = document.getElementById('min-label');

    const maxPriceInput = document.getElementById('price-max') as HTMLInputElement;
    const maxPriceLabel = document.getElementById('max-label');

    minPriceInput.value = String(minPrice);
    minPriceInput.min = String(minPrice);
    minPriceInput.max = String(maxPrice / 2 - 1);
    minPriceLabel.innerText = String(minPrice);

    maxPriceInput.value = String(maxPrice);
    maxPriceInput.min = String(maxPrice / 2);
    maxPriceInput.max = String(maxPrice);
    maxPriceLabel.innerText = String(maxPrice);
  }

  navigateToProductDetails(item: Item) {
    this.rout.navigate(['/product/' + item.id]);
  }

  setSaleAndNewLabels(item: Item, index: number) {

    const typeLabel = document.getElementById('itemTypeLabel' + index) as HTMLElement;
    // if item has no type, need to hide the type label
    if (!item.tp) {
      typeLabel.style.display = 'none';
      return;
    }
    const saleType = item.sl;
    const newType = item.tp.includes('new');
    // if both sale and new is false, hide the label
    if ((saleType && saleType === 0) && (newType && newType === true)) {
      typeLabel.style.display = 'none';
      return;
    }
    // if item's type is sale, displaying SALE label
    if (saleType && saleType !== 0) {
      typeLabel.style.display = 'block';
      typeLabel.className = 'tag-sale';
      typeLabel.innerHTML = 'SALE';
      return;
    }
    // if item's type is new, displaying New label
    if (newType && newType === true) {
      typeLabel.style.display = 'block';
      typeLabel.className = 'tag-new';
      typeLabel.innerHTML = 'NEW';
      return;
    }

  }

  setWishlistIcons(item: Item, index: number) {

    if (this.initialWishlistSetup) {
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // if current user object is null, it means the user hasn't logged into the website yet
    // return, as we have no data for the wishlist yet
    if (!currentUser) {
      return;
    }

    const currentUserId = currentUser.userId;
    const userIds = item.ws;
    const wishIcon = document.getElementById('wishlist-icon-' + index);

    if (userIds && userIds[currentUserId]) {
      wishIcon.style.backgroundColor = 'red';
    } else {
      wishIcon.style.backgroundColor = 'white';
    }

    if (index + 1 === this.items.length) {
      this.initialWishlistSetup = true;
    }

  }

  addToWishlist(item: Item, index: number) {
    this.loading = true;
    this.data.add_remove_to_wishlist(item).subscribe(result => {
      this.loading = false;
      const wishIcon = document.getElementById('wishlist-icon-' + index);
      const isAdded = result['wishlist'];
      if (isAdded) {
        wishIcon.style.backgroundColor = 'red';
      } else {
        wishIcon.style.backgroundColor = 'white';
      }
      this.updateWishlistCount(isAdded);
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

  sortElements() {
    this.loading = true;
    const x = document.getElementById('select-sort') as HTMLSelectElement;
    this.sortWithType(x.value);
  }

  private sortWithType(type: string) {

    switch (type) {
      case 'New': {

        const newItems = this.sortedItems.filter(function (value, index) {
          return value.tp.includes('new');
        });
        const otherItems = this.sortedItems.filter(function (value, index) {
          return !value.tp.includes('new');
        });

        this.sortedItems = newItems.concat(otherItems);

        break;
      }
      case 'Recommended': {
        this.sortedItems.sort(function (a, b) {
          return b.sl - a.sl;
        });
        break;
      }
      case 'High to low': {
        this.sortedItems.sort(function (a, b) {
          return b.pr - a.pr;
        });
        break;
      }
      case 'Low to high': {
        this.sortedItems.sort(function (a, b) {
          return a.pr - b.pr;
        });
        break;
      }
      default: {
        break;
      }
    }
    this.loading = false;

  }

  filterElements(filter: string) {
    console.log(filter);
    if (this.selectedFilters.includes(filter)) {
      this.selectedFilters =  this.selectedFilters.filter( item => item !== filter);
    } else {
      this.selectedFilters.push(filter);
    }
    console.log(this.selectedFilters);
    // exit execution if no size filters selected
    if (this.selectedFilters.length === 0) {
      this.sortedItems = this.items;
      return;
    }

    this.sortedItems = this.items.filter(i => i.s.some(o => this.selectedFilters.includes(o.s) && o.q !== 0));
  }

  addToCart(item: Item, index: number) {

  }

  priceValueChanged() {
    const minPriceInput = document.getElementById('price-min') as HTMLInputElement;
    const minPriceLabel = document.getElementById('min-label');

    const maxPriceInput = document.getElementById('price-max') as HTMLInputElement;
    const maxPriceLabel = document.getElementById('max-label');

    minPriceLabel.innerText = minPriceInput.value;
    maxPriceLabel.innerText = maxPriceInput.value;
  }

  sortByPrice() {
    const minPriceInput = document.getElementById('price-min') as HTMLInputElement;
    const maxPriceInput = document.getElementById('price-max') as HTMLInputElement;
    let minPrice = Number(minPriceInput.value);
    let maxPrice = Number(maxPriceInput.value);

    this.sortedItems = this.items.filter( item => item.pr >= minPrice);
    this.sortedItems = this.items.filter( item => item.pr <= maxPrice);


  }


}
