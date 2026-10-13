import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {CanActivate, Router} from "@angular/router";
import { jwtDecode } from "jwt-decode";

export const API_URL = 'http://localhost:3000/collaborativeD2C/api';

export interface SessionUser {
  ID: number;
  name: string;
  surname?: string;
  email: string;
  role: string;
  status: string;
}

export interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface TokenPayload {
  exp: number;
  user: SessionUser | SessionUser[];
}

interface AuthResponse {
  Authorization: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  loggedIn = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.IsUserLogged();
  }

  authLogin(email: string, password: string) {
    return this.http.post<AuthResponse>(`${API_URL}/authLogin`, { email, password }, {observe: 'response'});
  }

  authRegister(data: RegisterData) {
    return this.http.post<AuthResponse>(`${API_URL}/authRegister`, data, {observe: 'response'});
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private readToken(): TokenPayload | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const tokenPayload = jwtDecode<TokenPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (tokenPayload.exp < currentTime) {
        localStorage.removeItem('token');
        return null;
      }
      return tokenPayload;
    } catch {
      localStorage.removeItem('token');
      return null;
    }
  }

  IsUserLogged() : boolean {
    const logged = this.readToken() !== null;
    this.loggedIn.set(logged);
    return logged;
  }

  currentUser(): SessionUser | null {
    const user = this.readToken()?.user;
    return (Array.isArray(user) ? user[0] : user) ?? null;
  }

  sessionExpiry(): Date | null {
    const tokenPayload = this.readToken();
    return tokenPayload ? new Date(tokenPayload.exp * 1000) : null;
  }

  canActivate():boolean{
    if (this.IsUserLogged()){
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  LogUser(authToken : string) {
    localStorage.setItem('token', authToken);
    this.loggedIn.set(true);
    this.router.navigate(['/home']);
  }

  LogoutUser() {
    localStorage.removeItem('token');
    this.loggedIn.set(false);
    this.router.navigate(['/login']);
  }

}

export function authErrorMessage(err: HttpErrorResponse): string {
  const detail = typeof err.error?.error === 'string' ? err.error.error : '';

  if (err.status === 0) {
    return 'The server is not responding. Check that the API is running on localhost:3000.';
  }
  if (err.status === 403) {
    return detail.includes('Inactive')
      ? 'This account is inactive. Ask an administrator to reactivate it.'
      : 'That email and password do not match an account.';
  }
  if (err.status === 409 && detail) {
    return detail;
  }
  return 'The server could not complete the request. Try again.';
}
