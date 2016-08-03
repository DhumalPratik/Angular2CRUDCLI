import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../shared/customer';
import { CustomerService } from '../shared/customer.service';
import { NgForm } from '@angular/common';

@Component({
  selector: 'app-customer-create',
  templateUrl: 'app/customers/customer-create/customer-create.component.html',
  styleUrls: ['app/customers/customer-create/customer-create.component.css', 'app/customers/shared/form.css'],
  providers: [CustomerService]
})
export class CustomerCreateComponent implements OnInit {

  customer: Customer = new Customer();
  statusList: string[];
  validationStatusList: string[];
  customerSubType: any[];
  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CustomerService
  ) { }

  ngOnInit() {
    this.customer.CustomerType = "Prescriber";
    this.customer.Status = "ACTV";
    this.service.getCustomerSubType()
      .then(x => this.customerSubType = x.Value.sort(function (a, b) {
        return a.DESCRIPTION.localeCompare(b.DESCRIPTION);
      }));
    this.service.getUserStatus().then(x => this.statusList = x);
    this.service.getValidationStatus().then(x => this.validationStatusList = x);
  }

  onSubmit() {
    console.log("Submit");
    let CustomerObject = this.customer.toJSON();
    delete CustomerObject.CustomerType;
    delete CustomerObject.ExternalId1;
    delete CustomerObject.ExternalId2;
    delete CustomerObject.ExternalId3;
    delete CustomerObject.ExternalId4;
    delete CustomerObject.ExternalId5;
    delete CustomerObject.VcDisplayName;
    delete CustomerObject.StatusChangeDate;
    delete CustomerObject.Status;
    this.service.createCustomer(CustomerObject).then(x => this.gotoCustomers());
  }

  gotoCustomers() { this.router.navigate(['/customers']); }

}

