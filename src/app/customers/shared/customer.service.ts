import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Customer } from './customer';
import { CustomerNote } from './customer-note';
import { NOTE_TYPE } from './notetype-model';
import {SERVER_CONFIG} from './server-config';
// import { DUMMY_CUSTOMER_RESPONSE } from './customer-model';
import { DUMMY_CUSTOMER_SUBTYPE } from './customer-subtype-model';

@Injectable()
export class CustomerService {

  private url = SERVER_CONFIG.server + 'pres_customer';
  private notesUrl = SERVER_CONFIG.server + 'pres_notes';
  headers: Headers;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append("Authorization", "Basic " + btoa(SERVER_CONFIG.username + ":" + SERVER_CONFIG.password));
    this.headers.append("Accept", "application/json; odata.metadata=minimal; charset=utf-8;");
    // this.headers.append("Content-Type", "application/json;");
  }

  getCustomers(): Promise<Customer[]> {
    return this.http.get(this.url + '?$top=1000', { headers: this.headers })
      .toPromise()
      .then(response => response.json().value.map(function (x) {
        return new Customer().deserialize(x);
      }))
      .catch(this.handleError);
  }

  getCustomer(id: string): Promise<Customer> {
    let cust: Customer = new Customer();
    var self = this;
    let notes: CustomerNote[];
    return self.getCustomerNotes(id).then(x => notes = x.sort(function (a, b) {
      return a.StatusChangeDate > b.StatusChangeDate ? -1 : 1;
    }))
      .then(y => self.getCustomerDetails(id).then(z => cust = z))
      .then(w => cust.setNotes(notes))
      .then(x => cust);

  }

  getCustomerDetails(id: string): Promise<Customer> {
    return this.http.get(this.url + '(' + id + ')', { headers: this.headers })
      .toPromise()
      .then(response => new Customer().deserialize(response.json()))
      //.then(y=>y.setNotes(this.getCustomerNotes(id).then(z=>z)))
      .catch(this.handleError);
  }

  getCustomerNotes(id: string): Promise<CustomerNote[]> {
    return this.http.get(this.notesUrl + '?$filter=CustomerId eq ' + id, { headers: this.headers })
      .toPromise()
      .then(response => response.json().value)
      .catch(this.handleError);
  }

  getNoteTypes() {
    return Promise.resolve(NOTE_TYPE);
  }

  searchCustomer(searchData: string): Promise<Customer[]> {
    let searcharr = searchData.split(" ");
    let appendURL = '?$filter=';
    for (let index = 0; index < searcharr.length; index++) {
      let element = searcharr[index];
      // appendURL += "indexof(FirstName,'" + element + "') ne -1 or ";
      appendURL += "FirstName eq '" + element + "' or ";
      appendURL += "Surname eq '" + element + "' or ";
    }
    appendURL = appendURL.substring(0, appendURL.lastIndexOf('or')).trim();
    return this.http.get(this.url + appendURL, { headers: this.headers })
      .toPromise()
      .then(response => response.json().value.map(function (x) {
        return new Customer().deserialize(x);
      }))
      .catch(this.handleError);
  }

  updateCustomer(inputCustomer): Promise<Customer> {
    let UpdateHeader = new Headers(this.headers);
    UpdateHeader.append("Content-Type", "application/json; odata.metadata=minimal; charset=utf-8");
    console.log(inputCustomer);
    let notes: CustomerNote[];
    let errorMsgList = [];
    notes = inputCustomer.Notes;
    notes.forEach(element => {
      if (element.NoteId) {
        this.updateCustomerNote(element).then(x => errorMsgList = x.error ? x.error : null);
      } else {
        this.createCustomerNote(element).then(x => errorMsgList = x.error ? x.error : null);
      }
    });
    //console.log(errorMsgList);
    delete inputCustomer.Notes;
    return this.http.patch(this.url + '(' + inputCustomer.CustomerId + ')', JSON.stringify(inputCustomer), { headers: UpdateHeader })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  updateCustomerNote(note: CustomerNote) {
    let UpdateHeader = new Headers(this.headers);
    UpdateHeader.append("Content-Type", "application/json; odata.metadata=minimal; charset=utf-8");

    let noteObject: any = note.toJSON();
    delete noteObject.CustomerId;
    delete noteObject.AlignmentId;
    delete noteObject.EmployeeId;
    delete noteObject.EventId;
    delete noteObject.ProductId;
    delete noteObject.NoteDate;
    delete noteObject.Shared;
    delete noteObject.Status;
    delete noteObject.StatusChangeDate;
    delete noteObject.CreateDate;
    delete noteObject.DueDate;
    delete noteObject.IsModified;
    delete noteObject.NoteDescription

    return this.http.patch(this.notesUrl + '(' + noteObject.NoteId + ')', JSON.stringify(noteObject), { headers: UpdateHeader })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  createCustomerNote(note: CustomerNote) {
    let createHeader = new Headers(this.headers);
    createHeader.append("Content-Type", "application/json; odata.metadata=minimal; charset=utf-8");

    let noteObject: any = note.toJSON();
    delete noteObject.AlignmentId;
    delete noteObject.EmployeeId;
    delete noteObject.EventId;
    delete noteObject.ProductId;
    delete noteObject.NoteDate;
    delete noteObject.Shared;
    delete noteObject.Status;
    delete noteObject.StatusChangeDate;
    delete noteObject.CreateDate;
    delete noteObject.DueDate;
    delete noteObject.NoteId;
    delete noteObject.IsModified;
    delete noteObject.NoteDescription
    return this.http.post(this.notesUrl, JSON.stringify(noteObject), { headers: createHeader })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  createCustomer(inputCustomer) {
    console.log('service Called');
    let createHeader = new Headers(this.headers);
    createHeader.append("Content-Type", "application/json; odata.metadata=minimal; charset=utf-8");
    return this.http.post(this.url,
      JSON.stringify(inputCustomer),
      { headers: createHeader })
      .toPromise()
      .then(response => console.log(response.text()))
      .catch(this.handleError);
  }

  deleteCustomer(inputCustomer) {
    let deleteHeader = new Headers(this.headers);
    deleteHeader.append("Content-Type", "application/json; odata.metadata=minimal; charset=utf-8");
    return Promise.resolve(this.http.delete(this.url + '(' + inputCustomer.CustomerId + ')', { headers: deleteHeader }).toPromise());
  }

  getUserStatus() {
    return Promise.resolve(["ACTV", "INAC"]);
  }

  getCustomerSubType() {
    return Promise.resolve(DUMMY_CUSTOMER_SUBTYPE);
  }

  getValidationStatus() {
    return Promise.resolve(["VALD", "INVL"]);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
