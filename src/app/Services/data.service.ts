import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {Item} from '../Models/item.model';
import {element} from 'protractor';
import {Convertedsize} from '../Models/convertedsize.model';
import {OrderItem} from '../Models/order-item.model';

const shopURL = 'https://babyshop-43300.firebaseapp.com/api/catalog';
const userURL = 'https://babyshop-43300.firebaseapp.com/api/user';
const cartURL = 'https://babyshop-43300.firebaseapp.com/api/cart';
// const userURL = 'http://localhost:5000/api/user';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization' : 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk4MGVkMGQ3ODY2ODk1Y2E0M2MyMGRhZmM4NTlmMThjNjcwMWU3OTYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYmFieXNob3AtNDMzMDAiLCJhdWQiOiJiYWJ5c2hvcC00MzMwMCIsImF1dGhfdGltZSI6MTU2MTQ0NTcwNSwidXNlcl9pZCI6IktjVGRvSjdteEtTYVIyYmJDcmt0dk91Uk9RdTEiLCJzdWIiOiJLY1Rkb0o3bXhLU2FSMmJiQ3JrdHZPdVJPUXUxIiwiaWF0IjoxNTYxNDQ1NzA1LCJleHAiOjE1NjE0NDkzMDUsImVtYWlsIjoibWF4NjM2MUBtYWlsLnJ1IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbIm1heDYzNjFAbWFpbC5ydSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.o79JgCaqf9-EIxxjhM7EuCsvkqS6kzlzXlBjZ-w5dLlKewiAPHSrW4jpM5KSci45hHhB8gkI5AjRkdxoQ0MHq3Sju9DaEXtDdDLlnRlyUIoHkwWDwf1v6odhDQPDd62e_0Ku4TjQ3aL8TUNJIB2n9m1BTMq7biKgfGa5VGE10WDW2VreCh815jioR1C1u7XIR8wQy6ykyDkh_o4-qEzmwt2-DfdV83Yfe9ljQbzTr6MT58Y80E2mNsNIMpdY3o-6TGMNU-qe5Qm91yvk2O1bd19An3AEWHDDjwlzFhvnqiVtyhU9H78JfLn315wS6Yd3fpM4eX0Zn7wnslzPFTtrjw'
  })
};

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private items: any;
  private selectedItem: any;
  private wishlisted: any;
  private wishlisteItems: any;
  private inCartItems: any;
  private cartItems: Array<OrderItem>;
  private userdata: any;

  private updateQtyResponse: any;

  constructor(private http: HttpClient) { }

  retrieve_items_for_category(category: string): Observable<any> {
    return this.http.get(shopURL + '/categories/' + category).pipe(map(res => this.items = res));
  }

  retrieve_sale_items(): Observable<any> {
    return this.http.get(shopURL + '/sale').pipe(map(res => this.items = res));
  }

  retrieve_item_by_id(id: string): Observable<any> {
    return this.http.get(shopURL + '/item/' + id).pipe(map(res => this.selectedItem = res));
  }

  // *******************
  // wishlist methods
  // *******************

  add_remove_to_wishlist(item: Item): Observable<any> {
    return this.http.put(userURL + '/wishlist/' + item.id, {}).pipe(map(res => this.wishlisted = res));
  }

  retrieve_wishlisted_items(): Observable<any> {
    return this.http.get(userURL + '/wishlist').pipe(map(res => this.wishlisteItems = res));
  }

  // *******************
  // cart methods
  // *******************

  add_item_to_cart(itemId: string, size: Convertedsize): Observable<any> {
    return this.http.put(cartURL + '/' + itemId, {[size.label] : size.quantity}).pipe(map( res => this.inCartItems = res));
  }

  retrieve_cart_items(): Observable<Array<OrderItem>> {
    return this.http.get<Array<OrderItem>>(cartURL + '/data').pipe(map(res => this.cartItems = res));
  }

  update_item_quantity(itemId: string, size: string, qty: number): Observable<any> {
    return this.http.put(cartURL + '/qty/' + itemId, {[size] : qty}).pipe(map(res => this.updateQtyResponse = res));
  }

  // *******************
  // user methods
  // *******************

  retrieve_user_data(): Observable<any> {
    return this.http.get(userURL + '/data').pipe(map( res => this.userdata = res));
  }


}
