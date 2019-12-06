import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBannerComponent } from './employee-banner.component';

describe('EmployeeBannerComponent', () => {
  let component: EmployeeBannerComponent;
  let fixture: ComponentFixture<EmployeeBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
