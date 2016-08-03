import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent, environment } from './app/';
// import { APP_ROUTER_PROVIDERS  } from './app.routes';
import { provideRouter, RouterConfig } from '@angular/router';
// import {CustomersComponent} from './app/customers/customers.component';
import {CustomersRoutes} from './app/customers/customers.routes';

if (environment.production) {
  enableProdMode();
}
// bootstrap(AppComponent);
export const routes: RouterConfig = [
  // { path: 'customers', component: CustomersComponent }
  ...CustomersRoutes,
  {
    path: '',
    redirectTo: '/customers'
  },
];

const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];

bootstrap(AppComponent, [
  APP_ROUTER_PROVIDERS
]).catch(err => console.error(err));
