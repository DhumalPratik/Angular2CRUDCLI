import { RouterConfig }          from '@angular/router';
import { CustomersComponent }     from './customers.component';
import { CustomerDetailComponent }     from './customer-detail/customer-detail.component';
import { CustomerCreateComponent }     from './customer-create/customer-create.component';
// import { HeroDetailComponent }   from './hero-detail.component';
export const CustomersRoutes: RouterConfig = [
  {
    path: '',
    redirectTo: '/customers'
  },
  {
    path: 'customers',
    component: CustomersComponent
  },
  {
    path: 'customers/create',
    component: CustomerCreateComponent
  },
  {
    path: 'customers/:id',
    component: CustomerDetailComponent
  }
];
