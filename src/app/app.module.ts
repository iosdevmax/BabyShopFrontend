import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';

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
    ReturnsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
