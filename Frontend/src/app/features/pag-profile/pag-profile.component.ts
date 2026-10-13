import { Component } from '@angular/core';
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../_shared/services/_Auth/auth.service";

@Component({
  selector: 'app-pag-profile',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './pag-profile.component.html',
  styleUrl: './pag-profile.component.css'
})
export class PagProfileComponent {
  user = this.auth.currentUser();
  sessionEnds = this.auth.sessionExpiry();

  constructor(
    public auth: AuthService
  ) {}
}
