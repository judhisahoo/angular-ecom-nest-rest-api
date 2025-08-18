// src/app/shared/footer/footer.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FooterComponent', () => {
  let component = FooterComponent;
  let fixture = ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the footer with the correct copyright text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain(
      '© Your App Name. All rights reserved.'
    );
  });
});
