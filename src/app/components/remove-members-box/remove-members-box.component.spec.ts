import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveMembersBoxComponent } from './remove-members-box.component';

describe('RemoveMembersBoxComponent', () => {
  let component: RemoveMembersBoxComponent;
  let fixture: ComponentFixture<RemoveMembersBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveMembersBoxComponent]
    });
    fixture = TestBed.createComponent(RemoveMembersBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
