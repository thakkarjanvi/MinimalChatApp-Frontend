import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMembersBoxComponent } from './add-members-box.component';

describe('AddMembersBoxComponent', () => {
  let component: AddMembersBoxComponent;
  let fixture: ComponentFixture<AddMembersBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMembersBoxComponent]
    });
    fixture = TestBed.createComponent(AddMembersBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
