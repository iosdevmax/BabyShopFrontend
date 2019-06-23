import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTopBarComponent } from './main-top-bar.component';

describe('MainTopBarComponent', () => {
  let component: MainTopBarComponent;
  let fixture: ComponentFixture<MainTopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
