import { Component, OnInit } from '@angular/core';
import { CustomerService } from './shared/customer.service';
import { Customer } from './shared/customer';
import { Router } from '@angular/router';
import { ColumnConfig } from '../shared/column-config';
import { Config } from '../shared/config';
import { GridComponent } from '../shared/grid/grid.component';
import { DetailComponent } from '../shared/detail/detail.component';
import { ButtonTestComponent } from '../shared/button-test/button-test.component';


@Component({
  selector: 'app-customers',
  templateUrl: 'app/customers/customers.component.html',
  styleUrls: ['app/customers/customers.component.css'],
  providers: [CustomerService],
  directives: [GridComponent, DetailComponent, ButtonTestComponent]
})

export class CustomersComponent implements OnInit {
  Customers: Customer[] = [];
  error: any;
  config: Config;
  detailConfig: Config;
  columnConfig: ColumnConfig[] = [];
  detailcolumnConfig: ColumnConfig[] = [];
  subType = [];
  UnfilteredCustomers: Customer[] = [];
  searchText: string;
  isAsc: boolean = false;
  hasDetail: boolean = false;
  testmsg: string = "hi";
  constructor(private router: Router, private custService: CustomerService) { }

  ngOnInit() {
    console.log("Customer");
    this.initComponent();
  }

  serverSearch() {
    if (this.searchText) {
      let self = this;
      this.UnfilteredCustomers = [];
      this.Customers = [];
      this.custService.searchCustomer(this.searchText)
        .then(x => this.Customers = x.map(function (y) {
          if (y.CustomerType = "PRES") {
            y.CustomerType = "Prescriber";
          }
          y.CustomerSubType = self.resolveSubType(y.CustomerSubType);
          y.Status = y.Status == "ACTV" ? "Active" : "Inactive";
          delete y.ExternalId1;
          delete y.ExternalId2;
          delete y.ExternalId3;
          delete y.ExternalId4;
          delete y.ExternalId5;
          delete y.FirstName;
          delete y.Surname;
          delete y.MiddleName;
          return y;
        }))
        .then(x => this.UnfilteredCustomers = this.Customers);
      // .then(x => console.log(x));
      this.searchText = null;
    }
  }

  resetAll() {
    this.Customers = [];
    this.config = null;
    this.detailConfig = null;
    this.columnConfig = [];
    this.subType = [];
    this.UnfilteredCustomers = [];
    this.searchText = null;
    this.isAsc = false;
    this.hasDetail = false;

  }

  initComponent() {
    let self = this;
    this.resetAll();
    this.custService.getCustomerSubType().then(x => this.subType = x.Value);
    this.custService.getCustomers()
      .then(x => this.Customers = x.map(function (y) {
        if (y.CustomerType = "PRES") {
          y.CustomerType = "Prescriber";
        }
        y.CustomerSubType = self.resolveSubType(y.CustomerSubType);
        y.Status = y.Status == "ACTV" ? "Active" : "Inactive";
        delete y.ExternalId1;
        delete y.ExternalId2;
        delete y.ExternalId3;
        delete y.ExternalId4;
        delete y.ExternalId5;
        delete y.FirstName;
        delete y.Surname;
        delete y.MiddleName;
        return y;
      }))
      .then(x => this.UnfilteredCustomers = this.Customers)
      .then(x => this.setupConfig(this.Customers.map(function (y) {
        let z: any = y.toJSON();
        z.HasButton = z.Status == 'Active';
        return z;
      })))
      .catch(error => this.error = error);
  }

  resolveSubType(dubTypeCode: string) {
    for (let index = 0; index < this.subType.length; index++) {
      let e = this.subType[index];
      if (e['CODE'].toString() == dubTypeCode) {
        return e['DESCRIPTION'].toString();
      }
    };
    return dubTypeCode;
  }

  showDetail(customerInput) {
    // console.log("Show Detail");
    this.detailcolumnConfig = [];
    this.detailcolumnConfig.push(new ColumnConfig({
      ColumnName: "CustomerId",
      Callback: 'getCustomer',
      IsClickable: true,
      DisplayName: "Customer ID"
    }));
    this.detailcolumnConfig.push(new ColumnConfig({
      ColumnName: "VcDisplayName",
      DisplayName: "Name"
    }));
    this.detailcolumnConfig.push(new ColumnConfig({
      ColumnName: "CustomerType",
      DisplayName: "Customer Type"
    }));
    this.detailcolumnConfig.push(new ColumnConfig({
      ColumnName: "CustomerSubType",
      DisplayName: "Subtype"
    }));
    this.detailcolumnConfig.push(new ColumnConfig({
      ColumnName: "Status"
    }));
    this.detailcolumnConfig.push(new ColumnConfig({
      ColumnName: "Edit",
      HasButton: true,
      Callback: 'getCustomer',
      DisplayName: 'Edit'
    }));
    this.hasDetail = false;
    if (!this.detailConfig)
      this.detailConfig = new Config();
    this.detailConfig.DataSource = [customerInput];
    this.detailConfig.DisplayAllColumns = false;
    this.detailConfig.DisplayColumns = this.detailcolumnConfig;
    // console.log(this.detailConfig);
    this.hasDetail = true;
  }

  setupConfig(obj) {
    this.columnConfig.push(new ColumnConfig({
      ClassName: "w110p",
      ColumnName: "CustomerId",
      Callback: 'showDetail',
      IsClickable: true,
      DisplayName: "Customer ID"
    }));
    this.columnConfig.push(new ColumnConfig({
      ColumnName: "VcDisplayName",
      DisplayName: "Name"
    }));
    this.columnConfig.push(new ColumnConfig({
      ColumnName: "CustomerType",
      ClassName: "w110p",
      DisplayName: "Customer Type"
    }));
    this.columnConfig.push(new ColumnConfig({
      ColumnName: "CustomerSubType",
      ClassName: "w200p",
      DisplayName: "Subtype"
    }));
    this.columnConfig.push(new ColumnConfig({
      ColumnName: "Status",
      ClassName: "w110p"
    }));
    this.columnConfig.push(new ColumnConfig({
      ColumnName: "Action",
      HasButton: true,
      DisplayName: "Delete",
      Callback: 'deleteCustomer',
      ClassName: "w80p",
      HeaderClassName: "w80p lastCol"
    }));
    this.config = new Config();
    this.config.DataSource = obj;
    this.config.DisplayAllColumns = false;
    this.config.DisplayColumns = this.columnConfig;
  }

  getCustomer(selectedCustomer) {
    this.router.navigate(['/customers', selectedCustomer.CustomerId]);
  }

  deleteCustomer(selectedCustomer) {
    this.custService.deleteCustomer(selectedCustomer).then(x => this.initComponent()).catch(x => console.log(x));
  }

  gotoCreateCustomers() { this.router.navigate(['/customers/create']); }

  CallbackFunction(obj) {

    switch (obj.Function) {
      case 'getCustomer':
        this.getCustomer(obj.Data);
        break;
      case 'showDetail':
        this.showDetail(obj.Data);
        break;
      case 'deleteCustomer':
        this.deleteCustomer(obj.Data);
        break;
      default:
        break;
    }
  }

  sort(fieldName) {
    let self = this;
    self.isAsc = !self.isAsc;
    self.Customers.sort(function (a, b) {
      return (self.isAsc ? 1 : -1) * ((a[fieldName] < b[fieldName]) ? -1 : (a[fieldName] > b[fieldName]) ? 1 : 0);
    });
  }

  search() {

    let self = this;
    let searchText = this.searchText.toLowerCase();
    self.Customers = this.UnfilteredCustomers.filter(function (x) {
      return x.CustomerId.toString().indexOf(searchText) != -1
        || x.VcDisplayName.toLowerCase().indexOf(searchText) != -1
        || x.CustomerSubType.toLowerCase().indexOf(searchText) != -1
        || x.Status.toLowerCase().indexOf(searchText) != -1;
    });
  }

  getColumns() {
    // let c1 = this.Customers[0];
    // console.log(c1.getAllProperties());
  }

}
