import { Injectable } from '@angular/core';
import { User } from '../Models/user.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {userError} from '@angular/compiler-cli/src/transformers/util';
import {Router} from '@angular/router';

const url = 'https://babyshop-43300.firebaseapp.com/api';
// const url = 'http://localhost:5000/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  signup(email: string, password: string, first: string, last: string) {
    return this.http.post<any>(url + '/auth/signup', {email, password, first, last}).pipe(map( user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }
    }));
  }

  login(email: string, password: string) {
    return this.http.post<any>(url + '/auth/login', {email, password}).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }
    }));
  }

  autoLogin() {
    const currentUser = localStorage.getItem('CurrentUser');
    return this.http.post<any>(url + '/auth/autologin', {refreshToken : currentUser['refreshToken']}).pipe(map(user => {
      // autologin successful if there's a jwt token in the response
      if (user && user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }
    }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
