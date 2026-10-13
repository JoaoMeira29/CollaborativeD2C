import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from "../../_shared/services/_Auth/auth.service";

@Component({
  selector: 'app-pag-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pag-home.component.html',
  styleUrl: './pag-home.component.css'
})
export class PagHomeComponent {

  constructor(
    public auth: AuthService
  ) {}
}
