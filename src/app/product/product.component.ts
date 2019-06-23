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

  @Input() product: Item;

  constructor(private data: DataService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.data.getItemById('q');
  }

}
