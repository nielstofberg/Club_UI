import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberLogComponent } from './member-log.component';

describe('MemberLogComponent', () => {
  let component: MemberLogComponent;
  let fixture: ComponentFixture<MemberLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
