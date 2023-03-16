import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { SecondaryAuthGuard } from './secondary-auth.guard';

import { SignupComponent } from './Components/signup/signup.component';
import { LoginComponent } from './Components/login/login.component';
import { AboutComponent } from './Components/about/about.component';
import { HomeComponent } from './Components/home/home.component';
import { AccountComponent } from './Components/account/account.component';

const routes: Routes = [
  { path: 'register', component: SignupComponent, canActivate:[SecondaryAuthGuard]},
  { path: 'login', component: LoginComponent, canActivate:[SecondaryAuthGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
