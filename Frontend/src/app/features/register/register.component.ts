import { Component, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { RouterLink } from "@angular/router";
import { AuthService, authErrorMessage } from "../../_shared/services/_Auth/auth.service";

const passwordsMatch = (group: AbstractControl): ValidationErrors | null =>
  group.get('password')?.value === group.get('confirm_password')?.value ? null : { mismatch: true };

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    surname: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm_password: ['', Validators.required]
  }, { validators: passwordsMatch });
  error = signal('');
  sending = signal(false);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  invalid(name: 'name' | 'email' | 'password' | 'confirm_password') {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  mismatch() {
    return this.form.hasError('mismatch') && this.form.controls.confirm_password.touched;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.sending.set(true);

    this.auth.authRegister(this.form.getRawValue()).subscribe({
      next: (response) => {
        if (response.body?.Authorization) {
          this.auth.LogUser(response.body.Authorization);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.sending.set(false);
        this.error.set(authErrorMessage(err));
      }
    });
  }
}
