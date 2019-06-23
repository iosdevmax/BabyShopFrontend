import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryComponent } from './category/category.component';
import {StartingPageComponent} from './starting-page/starting-page.component';
import {ContactsComponent} from './contacts/contacts.component';
import {ProductComponent} from './product/product.component';
import {CartComponent} from './cart/cart.component';
import {CreateAccountComponent} from './create-account/create-account.component';
import {AboutUsComponent} from './about-us/about-us.component';
import {DeliveryComponent} from './delivery/delivery.component';
import {ReturnsComponent} from './returns/returns.component';
import {TermsConditionsComponent} from './terms-conditions/terms-conditions.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {WishlistComponent} from './wishlist/wishlist.component';

const routes: Routes = [
  {path: '', component: StartingPageComponent},
  {path: 'category/:catName', component: CategoryComponent},
  {path: 'contacts', component: ContactsComponent},
  {path: 'product/:product', component: ProductComponent},
  {path: 'cart', component: CartComponent},
  {path: 'login', component: CreateAccountComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'contacts', component: ContactsComponent},
  {path: 'delivery', component: DeliveryComponent},
  {path: 'returns', component: ReturnsComponent},
  {path: 'terms', component: TermsConditionsComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'wishlist', component: WishlistComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
