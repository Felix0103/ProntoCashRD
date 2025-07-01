import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientLocationModalPage } from './client-location-modal.page';

describe('ClientLocationModalPage', () => {
  let component: ClientLocationModalPage;
  let fixture: ComponentFixture<ClientLocationModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ClientLocationModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
