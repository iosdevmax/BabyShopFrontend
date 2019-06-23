import {Component, Directive, OnInit} from '@angular/core';
import { DataService } from '../Services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../Models/item.model';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categoryName: string;
  items: Item[] = [];

  constructor(private router: ActivatedRoute, private data: DataService) {
    this.router.params.subscribe(params => {
      this.categoryName = params.catName;
    });
  }

  ngOnInit() {
    // retrieving items for selected category
    // if sale is selected, fetch sale items
    if (this.categoryName === 'sale') {
      this.data.retrieve_sale_items().subscribe(res => {
        console.log(res);
        this.items = res;
      });
      return;
    }



    this.data.retrieve_items_for_category(this.categoryName).subscribe(res => {
      this.items = res;
    });

  }


  testFunction(item: Item, index: number) {

    const typeLabel = document.getElementById('itemTypeLabel' + index) as HTMLElement;
    // if item has no type, need to hide the type label
    if (!item.tp) {
      typeLabel.style.display = 'none';
      return;
    }
    const saleType = item.tp['sale'];
    const newType = item.tp['new'];
    console.log('saleType' + saleType);
    console.log('newType' + newType);
    // if both sale and new is false, hide the label
    if ((saleType && saleType === false) && (newType && newType === false)) {
      typeLabel.style.display = 'none';
      return;
    }
    // if item's type is sale, displaying SALE label
    if (saleType && saleType === true) {
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




}
