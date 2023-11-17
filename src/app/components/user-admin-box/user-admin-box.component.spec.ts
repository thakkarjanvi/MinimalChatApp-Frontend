import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdminBoxComponent } from './user-admin-box.component';

describe('UserAdminBoxComponent', () => {
  let component: UserAdminBoxComponent;
  let fixture: ComponentFixture<UserAdminBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserAdminBoxComponent]
    });
    fixture = TestBed.createComponent(UserAdminBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
