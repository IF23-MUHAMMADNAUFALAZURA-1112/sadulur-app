import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeleponPage } from './telepon.page';

describe('TeleponPage', () => {
  let component: TeleponPage;
  let fixture: ComponentFixture<TeleponPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleponPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
