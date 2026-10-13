import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagNotFoundComponent } from './pag-not-found.component';

describe('PagNotFoundComponent', () => {
  let component: PagNotFoundComponent;
  let fixture: ComponentFixture<PagNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagNotFoundComponent],
      providers: [provideRouter([]), provideHttpClient()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
