import { NgModule } from '@angular/core';
import { RouterModule, Routes} from "@angular/router";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { PagProfileComponent } from './features/pag-profile/pag-profile.component';
import { PagHomeComponent } from './features/pag-home/pag-home.component';
import { HeaderComponent } from './_shared/components/header/header.component';
import { FooterComponent } from './_shared/components/footer/footer.component';
import { PagEditProfileComponent } from './features/pag-edit-profile/pag-edit-profile.component';
import { PagNotFoundComponent } from './_shared/components/pag-not-found/pag-not-found.component';

import { AuthService } from "./_shared/services/_Auth/auth.service";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: PagHomeComponent},
      {path: 'profile/:id', component: PagProfileComponent, canActivate: [AuthService]},
      {path: 'editprofile', component: PagEditProfileComponent, canActivate: [AuthService]},
      {path: '**', component: PagNotFoundComponent},
    ]),
    PagProfileComponent
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PagHomeComponent,
    PagEditProfileComponent,
    PagNotFoundComponent,
    FooterComponent,
    HeaderComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
