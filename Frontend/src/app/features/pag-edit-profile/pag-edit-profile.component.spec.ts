import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagEditProfileComponent } from './pag-edit-profile.component';

describe('PagEditProfileComponent', () => {
  let component: PagEditProfileComponent;
  let fixture: ComponentFixture<PagEditProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagEditProfileComponent],
      providers: [provideRouter([]), provideHttpClient()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
