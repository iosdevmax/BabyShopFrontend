import {Component, Input, OnInit} from '@angular/core';
import { DataService } from '../data.service';
import {ActivatedRoute, Data} from '@angular/router';
import { Item } from '../Models/item.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: Item;
  selectedSize: any;

  constructor(private data: DataService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.product = history.state.data;
    console.log(this.product.sizes);
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
