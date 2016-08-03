/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { ButtonTestComponent } from './button-test.component';

describe('Component: ButtonTest', () => {
  it('should create an instance', () => {
    let component = new ButtonTestComponent();
    expect(component).toBeTruthy();
  });
});
