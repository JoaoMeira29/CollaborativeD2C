import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { RouterLink } from "@angular/router";
import { AuthService, authErrorMessage } from "../../_shared/services/_Auth/auth.service";
import { UsersService } from "../../_shared/services/Users/users.service";

@Component({
  selector: 'app-pag-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './pag-edit-profile.component.html',
  styleUrl: './pag-edit-profile.component.css'
})
export class PagEditProfileComponent {
  user = this.auth.currentUser();
  form = this.fb.nonNullable.group({
    name: [this.user?.name ?? '', Validators.required],
    surname: [this.user?.surname ?? ''],
    email: [this.user?.email ?? '', [Validators.required, Validators.email]]
  });
  error = signal('');
  saved = signal(false);
  sending = signal(false);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private users: UsersService
  ) {}

  invalid(name: 'name' | 'email') {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  submit() {
    if (this.form.invalid || !this.user) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.saved.set(false);
    this.sending.set(true);

    this.users.updateUser(this.user.ID, this.form.getRawValue()).subscribe({
      next: () => {
        this.sending.set(false);
        this.saved.set(true);
      },
      error: (err: HttpErrorResponse) => {
        this.sending.set(false);
        this.error.set(authErrorMessage(err));
      }
    });
  }
}
