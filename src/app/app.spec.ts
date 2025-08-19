// src/app/app.spec.ts
/*describe('Simple Test', () => {
  it('should pass', () => {
    expect(2 + 2).toBe(4);
  });
});*/

import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  //let component = FooterComponent;
  //let fixture = ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  it('Should Create the App', () => {
    //console.log('test case :::  Should Create the App');
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('App should have a title as "Home page for Dynamic tutle"', () => {
    //console.log('App should have a title as "Home page for Dynamic tutle"');
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app.title.toString()).toEqual('angular-ecom-nest-JS');
  });
});
