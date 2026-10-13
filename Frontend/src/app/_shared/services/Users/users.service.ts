import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { API_URL, AuthService, SessionUser } from "../_Auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  updateUser(id: number, data: Partial<SessionUser>) {
    return this.http.put(`${API_URL}/updateUser/${id}`, data, {
      headers: { Authorization: `Bearer ${this.auth.getToken()}` }
    });
  }
}
