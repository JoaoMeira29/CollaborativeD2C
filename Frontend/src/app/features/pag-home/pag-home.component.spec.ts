import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagHomeComponent } from './pag-home.component';

describe('PagHomeComponent', () => {
  let component: PagHomeComponent;
  let fixture: ComponentFixture<PagHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagHomeComponent],
      providers: [provideRouter([]), provideHttpClient()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
