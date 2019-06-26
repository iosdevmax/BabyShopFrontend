import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { DataService } from '../Services/data.service';
import {ActivatedRoute, Data} from '@angular/router';
import { Item } from '../Models/item.model';
import {log} from 'util';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: Item;
  selectedSize: any;
  productId: string;

  constructor(private data: DataService, private router: ActivatedRoute) {
    this.router.params.subscribe(params => {
      this.productId = params.productid;
      console.log('PARAMS ID - ' + params.productid);
    });
  }

  ngOnInit() {

    this.data.retrieve_item_by_id(this.productId).subscribe(res => {
      this.product = res;
      console.log('product - ' + res);
    });

  }

  checkIfDisabled(value: number, key: string) {
    if (value === 0) {
      const input = document.getElementById('size-' + key) as HTMLInputElement;
      const parentDiv = document.getElementById('divs-' + key) as HTMLElement;
      input.disabled = true;
      parentDiv.className = 'sc-item disable';
    }
  }

  quantityChanged(size: any) {
    this.selectedSize = size;
    // resetting quantity value
    const input = document.getElementById('quantity-input') as HTMLInputElement;
    input.value = String(1);
  }

  incrementQuantity(value: boolean) {
    const input = document.getElementById('quantity-input') as HTMLInputElement;
    const num = parseFloat(input.value);

    if (!this.selectedSize) {
      return;
    }

    if (value) {
      // incrementing as per available quantity
      if (num < this.selectedSize.value) {
        input.value = String(num + 1);
      }
    } else {
      if (num > 1) {
        input.value = String(num - 1);
      }
    }

  }
}
