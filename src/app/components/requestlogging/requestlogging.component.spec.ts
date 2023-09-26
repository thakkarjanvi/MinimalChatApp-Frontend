import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestloggingComponent } from './requestlogging.component';

describe('RequestloggingComponent', () => {
  let component: RequestloggingComponent;
  let fixture: ComponentFixture<RequestloggingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestloggingComponent]
    });
    fixture = TestBed.createComponent(RequestloggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
