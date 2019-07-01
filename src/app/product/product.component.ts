import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { DataService } from '../Services/data.service';
import {ActivatedRoute, Data} from '@angular/router';
import { Item } from '../Models/item.model';
import {log} from 'util';
import {Convertedsize} from '../Models/convertedsize.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: Item;
  selectedSize: Convertedsize;
  productId: string;
  loading = false;
  convertedSizes: Array<Convertedsize>;

  constructor(private data: DataService, private router: ActivatedRoute) {
    this.router.params.subscribe(params => {
      this.productId = params.productid;
      console.log('PARAMS ID - ' + params.productid);
    });

  }

  ngOnInit() {
    this.loading = true;
    this.data.retrieve_item_by_id(this.productId).subscribe(res => {
      this.product = res;
      this.loading = false;

      // need to convert sizes into readable format
      const sizes = res.sizes;
      this.convertSizeIntoReadableFormat(sizes);

      console.log('product - ' + res.sizes);
    });

  }

  addItemToCart() {
    this.data.add_item_to_cart(this.product.id, this.selectedSize).subscribe(success => {
      console.log('Item in the cart!');
    }, error1 => {
      console.log('Failed to add item');
    });

  }

  private convertSizeIntoReadableFormat(sizes: any) {
    const arrayOfSizes = [];
    Object.keys(sizes).forEach(key => {
      const value = sizes[key];
      switch (key) {
        case 'm0_3': {
          const convertedSize = new Convertedsize(key, '0-3', value);
          arrayOfSizes.push(convertedSize);
          break;
        }
        case 'm3_6' : {
          const convertedSize = new Convertedsize(key, '3-6', value);
          arrayOfSizes.push(convertedSize);
          break;
        }
        case 'm6_9' : {
          const convertedSize = new Convertedsize(key, '6-9', value);
          arrayOfSizes.push(convertedSize);
          break;
        }
        case 'm9_12' : {
          const convertedSize = new Convertedsize(key, '9-12', value);
          arrayOfSizes.push(convertedSize);
          break;
        }
        case 'm12_18' : {
          const convertedSize = new Convertedsize(key, '12-18', value);
          arrayOfSizes.push(convertedSize);
          break;
        }
        case 'na' : {
          const convertedSize = new Convertedsize(key, 'One size', value);
          arrayOfSizes.push(convertedSize);
          break;
        }
        default: {
          break;
        }
      }

    });
    arrayOfSizes.sort((a, b) => parseInt(a.displayLabel, 10) - parseInt(b.displayLabel, 10));
    this.convertedSizes = arrayOfSizes;
  }

  checkIfDisabled(value: number, key: string) {
    if (value === 0) {
      const input = document.getElementById('size-' + key) as HTMLInputElement;
      const parentDiv = document.getElementById('divs-' + key) as HTMLElement;
      input.disabled = true;
      parentDiv.className = 'sc-item disable';
    }
  }

  quantityChanged(size: Convertedsize) {
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
      if (num < this.selectedSize.quantity) {
        input.value = String(num + 1);
      }
    } else {
      if (num > 1) {
        input.value = String(num - 1);
      }
    }

  }
}
