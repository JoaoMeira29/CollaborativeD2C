import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { RouterLink } from "@angular/router";
import { AuthService, authErrorMessage } from "../../_shared/services/_Auth/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  error = signal('');
  sending = signal(false);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  invalid(name: 'email' | 'password') {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.error.set('');
    this.sending.set(true);

    this.auth.authLogin(email, password).subscribe({
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
