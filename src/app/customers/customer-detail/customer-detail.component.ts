import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '../shared/customer';
import { CustomerNote } from '../shared/customer-note';
import { CustomerService } from '../shared/customer.service';
import { NgForm } from '@angular/common';

@Component({
  selector: 'app-customer-detail',
  templateUrl: 'app/customers/customer-detail/customer-detail.component.html',
  styleUrls: ['app/customers/customer-detail/customer-detail.component.css', 'app/customers/shared/form.css'],
  providers: [CustomerService]
})
export class CustomerDetailComponent implements OnInit, OnDestroy {

  customer: Customer;
  unchangedCustomerCopy: Customer;
  statusList: string[];
  NoteTypeList: any[];
  customerSubType: any[];
  IsEditable: boolean = false;
  private sub: any;
  isAsc: boolean = false;
  hasNewNote: boolean = false;
  newNote: CustomerNote;
  customerId: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CustomerService
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id']; // In case of number prefix with +; (+) converts string 'id' to a number
      this.customerId = id;
      this.service.getCustomer(id)
        .then(x => this.customer = new Customer().deserialize(x))
        .then(w => this.service.getCustomerSubType()
          .then(x => this.customerSubType = x.Value.sort(function (a, b) {
            return a.DESCRIPTION.localeCompare(b.DESCRIPTION);
          })).then(y =>
            this.service.getUserStatus().then(x => this.statusList = x).then(z =>
              this.service.getNoteTypes().then(x => this.NoteTypeList = x.Value))))
        .then(z => this.init());
    });
  }

  init() {
    let self = this;
    this.customer.Notes.map(function (x) {
      x.IsModified = false;
      self.NoteTypeList.forEach(y => {
        if (y.CODE == x.NoteType) {
          x.NoteDescription = y.DESCRIPTION;
        }
      });
    })
  }

  toggleEdit() {
    if (!this.IsEditable) {
      this.unchangedCustomerCopy = new Customer().deserialize(this.customer);
    } else {
      this.customer = new Customer().deserialize(this.unchangedCustomerCopy);
    }
    this.IsEditable = !this.IsEditable;
  }

  save() {
    let updateCustomer = new Customer().deserialize(this.customer);
    updateCustomer.Notes = updateCustomer.Notes.filter(function (x) {
      return x.IsModified || !x.NoteId;
    });
    this.IsEditable = !this.IsEditable;
    let CustomerObject = updateCustomer.toJSON();
    delete CustomerObject.CustomerType;
    delete CustomerObject.ExternalId1;
    delete CustomerObject.ExternalId2;
    delete CustomerObject.ExternalId3;
    delete CustomerObject.ExternalId4;
    delete CustomerObject.ExternalId5;
    delete CustomerObject.VcDisplayName;
    delete CustomerObject.StatusChangeDate;
    delete CustomerObject.Status;
    // console.log(CustomerObject);
    this.service.updateCustomer(CustomerObject).then(x => this.gotoCustomers());
  }

  noteTypeListForCreate() {
    return this.NoteTypeList.filter(function (x) {
      return x.CreateAllowed == true;
    });
  }

  addNewNote() {
    this.hasNewNote = true;
    this.newNote = new CustomerNote();
    this.newNote.IsModified = true;
    this.newNote.CustomerId = Number(this.customerId);
    this.NoteTypeList.forEach(y => {
      if (y.CODE == this.newNote.NoteType) {
        this.newNote.NoteDescription = y.DESCRIPTION;
      }
    });
    // console.log(this.newNote);
    this.customer.Notes.unshift(this.newNote);
    this.cancelNote();
  }

  deleteNote(index) {
    this.customer.Notes.splice(index, 1);
    delete this.newNote;
  }

  cancelNote() {
    this.hasNewNote = false;
    this.newNote.IsModified = false;
    delete this.newNote;
  }

  gotoCustomers() { this.router.navigate(['/customers']); }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  setModified(e) {
    e.IsModified = true;
  }

  sort(fieldName) {
    let self = this;
    self.isAsc = !self.isAsc;
    self.customer.Notes.sort(function (a, b) {
      return (self.isAsc ? 1 : -1) * ((a[fieldName] < b[fieldName]) ? -1 : (a[fieldName] > b[fieldName]) ? 1 : 0);
    });
  }

}
