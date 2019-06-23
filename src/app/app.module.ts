import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CategoryComponent } from './category/category.component';
import { MainTopBarComponent } from './main-top-bar/main-top-bar.component';
import { StartingPageComponent } from './starting-page/starting-page.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ProductComponent } from './product/product.component';
import { FooterSectionComponent } from './footer-section/footer-section.component';
import { CartComponent } from './cart/cart.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { ReturnsComponent } from './returns/returns.component';
import { MyAccountComponent } from './my-account/my-account.component';
import {JwtInterceptor} from './Services/jwt.interceptor';
import {ErrorInterceptor} from './Services/error.interceptor';
import {AlertComponent} from './Alert/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    MainTopBarComponent,
    StartingPageComponent,
    ContactsComponent,
    ProductComponent,
    FooterSectionComponent,
    CartComponent,
    CreateAccountComponent,
    WishlistComponent,
    CheckoutComponent,
    AboutUsComponent,
    TermsConditionsComponent,
    DeliveryComponent,
    ReturnsComponent,
    MyAccountComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
