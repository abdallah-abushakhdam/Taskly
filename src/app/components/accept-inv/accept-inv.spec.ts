import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptInv } from './accept-inv';

describe('AcceptInv', () => {
  let component: AcceptInv;
  let fixture: ComponentFixture<AcceptInv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptInv],
    }).compileComponents();

    fixture = TestBed.createComponent(AcceptInv);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
