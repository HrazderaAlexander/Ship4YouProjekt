import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Erforderliche Komponenten, für die route Navigation
import { SignInComponent } from '../../components/sign-in/sign-in.component';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from '../../components/verify-email/verify-email.component';

import { CreateCustomerComponent } from '../../components/customers/create-customer/create-customer.component';
import { CustomersListComponent } from '../../components/customers/customers-list/customers-list.component';

// Import canActivate guard services
import { AuthGuard } from "../../shared/guard/auth.guard";
import { SecureInnerPagesGuard } from "../../shared/guard/secure-inner-pages.guard";
import { UserDetailsComponent } from 'src/app/components/user-details/user-details.component';
import {ShowUpload} from 'src/app/components/newboat/showUpload'

// Array mit allen routen
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sign-in', component: SignInComponent, canActivate: [SecureInnerPagesGuard]},
  { path: 'register-user', component: SignUpComponent, canActivate: [SecureInnerPagesGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'user-details', component: UserDetailsComponent},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add', component: CreateCustomerComponent },
  {path: 'showUpload', component: ShowUpload}
  //{path: 'showUpload', component: ShowUpload}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }