import { Component, OnInit } from '@angular/core';
import {AuthService} from '../Services/auth.service';
import {User} from '../Models/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-top-bar',
  templateUrl: './main-top-bar.component.html',
  styleUrls: ['./main-top-bar.component.css']
})
export class MainTopBarComponent implements OnInit {
  clothing = 'Clothing';
  bath = 'Bath';
  nursery = 'Nursery';

  currentUser: User;
  email = '';


  constructor(private router: Router, private auth: AuthService) {
    this.auth.currentUser.subscribe(user => {
      this.currentUser = user;

    });
  }

  ngOnInit() {
    const loggedDiv = document.getElementById('logged-in') as HTMLElement;
    const notLogged = document.getElementById('not-logged') as HTMLElement;



    if (this.currentUser) {
      this.email = this.currentUser.email;
      notLogged.style.display = 'none';
      loggedDiv.style.display = 'block';
    } else {
      this.email = '';
      // notLogged.style.display = 'block';
      loggedDiv.style.display = 'none';
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
