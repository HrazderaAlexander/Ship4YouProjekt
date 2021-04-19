import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Erforderliche Komponenten, für die route Navigation
import { SignInComponent } from '../../components/sign-in/sign-in.component';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from '../../components/verify-email/verify-email.component';

import { CreateBoatComponent } from '../../components/boats/create-boat/create-boat.component';

// Import canActivate guard services
import { AuthGuard } from "../../shared/guard/auth.guard";
import { SecureInnerPagesGuard } from "../../shared/guard/secure-inner-pages.guard";
import { UserDetailsComponent } from 'src/app/components/user-details/user-details.component';
import { BewertungComponent } from 'src/app/components/bewertung/bewertung.component';
import { CreateFeedbackComponent } from 'src/app/create-feedback/create-feedback.component';
import { MultiplePicturesComponent } from 'src/app/multiple-pictures/multiple-pictures.component';
import { ContactUsComponent } from 'src/app/components/contact-us/contact-us.component';
import { AboutUsComponent } from 'src/app/components/about-us/about-us.component';
import { ImageSliderComponent } from 'src/app/image-slider/image-slider.component';

// Array mit allen routen
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sign-in', component: SignInComponent, canActivate: [SecureInnerPagesGuard]},
  { path: 'register-user', component: SignUpComponent, canActivate: [SecureInnerPagesGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'user-details', component: UserDetailsComponent, canActivate: [AuthGuard]},
  { path: 'add', component: CreateBoatComponent, canActivate: [AuthGuard]},
  {path: 'bewertung', component: BewertungComponent, runGuardsAndResolvers: 'always'},
  {path: 'create-feedback', component: CreateFeedbackComponent},
  {path: 'multiple-upload', component: MultiplePicturesComponent},
  {path: 'contact-us', component: ContactUsComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'image-slider',  component: ImageSliderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
