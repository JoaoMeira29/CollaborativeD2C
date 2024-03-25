import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagProfileComponent } from './pag-profile.component';

describe('PagProfileComponent', () => {
  let component: PagProfileComponent;
  let fixture: ComponentFixture<PagProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
