import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEpic } from './new-epic';

describe('NewEpic', () => {
  let component: NewEpic;
  let fixture: ComponentFixture<NewEpic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEpic],
    }).compileComponents();

    fixture = TestBed.createComponent(NewEpic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
