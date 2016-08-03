import { provideRouter, RouterConfig } from '@angular/router';
import {CustomersComponent} from './app/customers/customers.component';

export const routes: RouterConfig = [

  { path: 'customers', component: CustomersComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
