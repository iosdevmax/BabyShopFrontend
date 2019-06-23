import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {Item} from './Models/item.model';
import {element} from 'protractor';

// const url = 'https://babyshop-43300.firebaseapp.com/api';
const url = 'http://localhost:5000/api';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private items: any;

  constructor(private http: HttpClient) { }

  retrieve_items_for_category(category: string): Observable<any> {
    return this.http.get(url + '/catalog/categories/' + category).pipe(map(res => this.items = res));
  }

  getItemById(id: string) {
    console.log(this.items);
    // this.items.forEach( item => {
    //   console.log(item);
    // });
  }


}
