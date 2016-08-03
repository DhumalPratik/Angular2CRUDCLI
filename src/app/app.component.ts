import { Component, OnInit } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { CustomersComponent } from './customers/customers.component';
import { ROUTER_DIRECTIVES }  from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [CustomersComponent, ROUTER_DIRECTIVES],
  providers: [HTTP_PROVIDERS]
})



export class AppComponent implements OnInit {
  title = 'app works!';
  error: any;
  constructor() { }
  ngOnInit() {

  }
}
