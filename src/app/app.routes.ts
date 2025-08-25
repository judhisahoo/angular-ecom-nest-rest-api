import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { ForgotComponent } from './auth/forgot/forgot';
import { AuthenticatedLayoutComponent } from './layouts/authenticated-layout/authenticated-layout';
import { ProductListComponent } from './products/product-list/product-list';
import { ProfileComponent } from './user/profile/profile';
import { UpdateProfileComponent } from './user/update-profile/update-profile';
import { ChangePasswordComponent } from './user/change-password/change-password';
import { AddProductComponent } from './products/add-product/add-product';
import { UpdateProductComponent } from './products/update-product/update-product';
import { HomePageComponent } from './pages/home-page/home-page';
import { ContactComponent } from './pages/contact/contact';
import { Details } from './products/details/details';
import { CartComponent } from './cart/cart';

export const routes: Routes = [
  // Public Routes (Accessible without login)
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login Page - Angular App',
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'forgot',
        component: ForgotComponent,
      },
      {
        path: 'products/list',
        component: ProductListComponent,
      },
      {
        path: 'home',
        component: HomePageComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },
      {
        path: 'product-details',
        component: Details,
      },
    ],
  },
  // Authenticated Routes (Protected by AuthGuard)
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'edit-profile',
        component: UpdateProfileComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      {
        path: 'add-product',
        component: AddProductComponent,
      },
      {
        path: 'edit-product/:id',
        component: UpdateProductComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
