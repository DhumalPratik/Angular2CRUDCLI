/* tslint:disable:no-unused-variable */
import { HTTP_PROVIDERS } from '@angular/http';
import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { CustomerService } from './customer.service';

describe('Customer Service', () => {
  beforeEachProviders(() => [HTTP_PROVIDERS, CustomerService]);

  it('should ...',
    inject([CustomerService], (service: CustomerService) => {
      expect(service).toBeTruthy();
    }));

});
